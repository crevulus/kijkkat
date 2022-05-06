import { useRef, useMemo, useState, useEffect } from "react";
import parse from "autosuggest-highlight/parse";
import throttle from "lodash.throttle";
import { useNavigate } from "react-router-dom";

import { Box, TextField, Autocomplete, Grid, Typography } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";

import { NavigationRoutes } from "../../data/enums";
import { useGeographicStore } from "../../data/store";

import styles, { StyledSpan } from "./Search.styles";
import { useGeocoder } from "../../hooks/useGeocoder";

const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

function loadScript(src: string, position: HTMLElement | null, id: string) {
  if (!position) {
    return;
  }

  const script = document.createElement("script");
  script.setAttribute("async", "");
  script.setAttribute("id", id);
  script.src = src;
  position.appendChild(script);
}

const autocompleteService = { current: null };

interface MainTextMatchedSubstrings {
  offset: number;
  length: number;
}
interface StructuredFormatting {
  main_text: string;
  secondary_text: string;
  main_text_matched_substrings: readonly MainTextMatchedSubstrings[];
}
export interface PlaceType {
  description: string;
  structured_formatting: StructuredFormatting;
  place_id: string;
}

interface SearchPropsType {
  redirect: boolean;
}

export function Search({ redirect }: SearchPropsType) {
  const chosenLocation = useGeographicStore((state) => state.chosenLocation);
  const setChosenLocation = useGeographicStore(
    (state) => state.setChosenLocation
  );
  const mapLoaded = useGeographicStore((state) => state.mapLoaded);
  const { geocodeCoordsFromAddress } = useGeocoder();

  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState<readonly PlaceType[]>([]);
  const loaded = useRef(false);

  const navigate = useNavigate();

  if (typeof window !== "undefined" && !loaded.current && !mapLoaded) {
    if (
      !document.querySelector("#google-maps-autocomplete-box") &&
      !document.querySelector("#google-maps")
    ) {
      loadScript(
        `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`,
        document.querySelector("head"),
        "google-maps"
      );
    }

    loaded.current = true;
  }

  const fetch = useMemo(
    () =>
      throttle(
        (
          request: { input: string },
          callback: (results?: readonly PlaceType[]) => void
        ) => {
          (autocompleteService.current as any).getPlacePredictions(
            request,
            callback
          );
        },
        200
      ),
    []
  );

  useEffect(() => {
    let active = true;

    if (!autocompleteService.current && (window as any).google) {
      autocompleteService.current = new (
        window as any
      ).google.maps.places.AutocompleteService();
    }
    if (!autocompleteService.current) {
      return undefined;
    }

    if (inputValue === "") {
      setOptions(chosenLocation ? [chosenLocation] : []);
      return undefined;
    }

    fetch({ input: inputValue }, (results?: readonly PlaceType[]) => {
      if (active) {
        let newOptions: readonly PlaceType[] = [];

        if (chosenLocation) {
          newOptions = [chosenLocation];
        }

        if (results) {
          newOptions = [...newOptions, ...results];
        }

        setOptions(newOptions);
      }
    });

    return () => {
      active = false;
    };
  }, [chosenLocation, inputValue, fetch]);

  const handleSelectPlace = async (newValue: PlaceType | null) => {
    if (newValue) {
      setOptions(newValue ? [newValue, ...options] : options);
      setChosenLocation(newValue);
      const coords = await geocodeCoordsFromAddress(newValue.description);
      if (redirect && coords) {
        const params = `lat=${coords.lat}&lng=${coords.lng}`;
        navigate(`${NavigationRoutes.Map}?${params}`);
      }
    } else {
      setChosenLocation(null);
    }
  };

  return (
    <Autocomplete
      id="google-maps-autocomplete-box"
      sx={styles.autocomplete}
      getOptionLabel={(option) =>
        typeof option === "string" ? option : option.description
      }
      filterOptions={(x) => x}
      options={options}
      autoComplete
      includeInputInList
      filterSelectedOptions
      value={chosenLocation}
      clearOnBlur={false}
      onChange={(_, newValue: PlaceType | null) => {
        handleSelectPlace(newValue);
      }}
      onInputChange={(_, newInputValue) => {
        setInputValue(newInputValue);
      }}
      renderInput={(params) => (
        <TextField {...params} label="Search for cats" fullWidth />
      )}
      renderOption={(props, option) => {
        const matches =
          option.structured_formatting.main_text_matched_substrings;
        const parts = parse(
          option.structured_formatting.main_text,
          matches.map((match: any) => [
            match.offset,
            match.offset + match.length,
          ])
        );

        return (
          <li {...props}>
            <Grid container alignItems="center">
              <Grid item>
                <Box component={LocationOnIcon} sx={styles.box} />
              </Grid>
              <Grid item xs>
                {parts.map((part, index) => (
                  <StyledSpan key={index} highlighted={part.highlight}>
                    {part.text}
                  </StyledSpan>
                ))}
                <Typography variant="body2" color="text.secondary">
                  {option.structured_formatting.secondary_text}
                </Typography>
              </Grid>
            </Grid>
          </li>
        );
      }}
    />
  );
}
