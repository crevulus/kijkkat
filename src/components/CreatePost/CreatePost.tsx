import { ReactElement, useEffect, useState } from "react";
import { doc, getFirestore } from "firebase/firestore";
import { useDocument } from "react-firebase-hooks/firestore";
import Geocode from "react-geocode";

import { Box, Button, Grid, Paper, Stack, Typography } from "@mui/material";
import LocationOn from "@mui/icons-material/LocationOn";
import Search from "@mui/icons-material/Search";
import { styled } from "@mui/material/styles";

import styles from "./CreatePost.module.css";

import { firebaseApp } from "../../firebase";
import { RatingPicker, CharacteristicChip } from "../";
import { useErrorStore, useGeographicStore } from "../../data/store";
import { Search as SearchBox } from "../index";

const db = getFirestore(firebaseApp);

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  textAlign: "center",
  color: theme.palette.text.secondary,
  lineHeight: "60px",
}));

type CreatePostPropsType = {
  chosenImage: string;
};

export type CharacteristicsTagsType = {
  id: number;
  text: string;
};

export const CreatePost = ({
  chosenImage,
}: CreatePostPropsType): ReactElement => {
  const setError = useErrorStore((state) => state.setError);
  const currentLocation = useGeographicStore((state) => state.currentLocation);
  const setCurrentLocation = useGeographicStore(
    (state) => state.setCurrentLocation
  );
  const [values, loading, loadError] = useDocument(
    doc(db, "tags", "appearance")
  );
  const [chosenTags, setChosenTags] = useState<CharacteristicsTagsType[]>([]);
  const [wantsCurrentLocation, setWantsCurrentLocation] = useState(true);
  const [currentAddress, setCurrentAddress] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    if (loadError) {
      setError(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadError]);

  const getLocation = () => {
    if (!(navigator as any).geolocation) {
      setStatus("Geolocation is not supported by your browser");
      setWantsCurrentLocation(false);
    } else {
      setStatus("Locating...");
      (navigator as any).geolocation.getCurrentPosition(
        (position: GeolocationPosition) => {
          setStatus(null);
          setCurrentLocation(position);
          Geocode.fromLatLng(
            position.coords.latitude.toString(),
            position.coords.longitude.toString()
          ).then(
            (response) => {
              const address = response.results[0];
              const formattedAddress = address.address_components
                .slice(1, 4)
                .map((a: any) => a.long_name)
                .join(", ");
              console.log(formattedAddress);
              setCurrentAddress(formattedAddress);
            },
            (error) => {
              console.error(error);
            }
          );
        },
        () => {
          setStatus("Unable to retrieve your location");
          setWantsCurrentLocation(false);
        }
      );
    }
  };

  const handleTagClick = (tag: CharacteristicsTagsType) => {
    const index = chosenTags.findIndex((t) => t.id === tag.id);
    if (index === -1) {
      setChosenTags([...chosenTags, tag]);
    } else {
      setChosenTags(chosenTags.filter((t) => t.id !== tag.id));
    }
  };

  return (
    <>
      <Box maxWidth="sm" className={styles.CreatePost}>
        <img src={chosenImage} alt="A cat you kijked" width="100%" />
      </Box>
      <Grid
        container
        spacing={{ xs: 2, md: 3 }}
        columns={{ xs: 6, sm: 9, md: 12 }}
      >
        {values?.data()?.tags.map((tag: CharacteristicsTagsType) => (
          <CharacteristicChip
            tag={tag}
            key={tag.id}
            handleTagClick={handleTagClick}
          />
        ))}
      </Grid>
      <RatingPicker />
      {wantsCurrentLocation && (
        <Typography variant="body1" padding={2}>
          Would you like to use your current location?
        </Typography>
      )}
      {wantsCurrentLocation ? (
        <Stack direction="row" spacing={2}>
          <Button startIcon={<LocationOn />} onClick={getLocation}>
            Find me
          </Button>
          <Button
            endIcon={<Search />}
            onClick={() => setWantsCurrentLocation(false)}
          >
            Search
          </Button>
        </Stack>
      ) : (
        <SearchBox />
      )}
      {currentAddress && (
        <Item>
          <LocationOn />
          {currentAddress}
        </Item>
      )}
    </>
  );
};
