import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { Container } from "@mui/material";

import { useGeographicStore } from "../data/store";
import { useGeocoder } from "../hooks/useGeocoder";
import { MapContainer } from "../components/MapContainer/MapContainer";
import { mapStyles } from "./Pages.styles";

export type CoordsType = {
  lat: number;
  lng: number;
};

export function Map() {
  const chosenLocation = useGeographicStore((state) => state.chosenLocation);
  const [latLng, setLatLng] = useState<CoordsType | null>(null);
  const [searchParams] = useSearchParams();

  const { geocodeCoordsFromAddress } = useGeocoder();

  useEffect(() => {
    const getLocation = async () => {
      if (chosenLocation) {
        const {
          structured_formatting: { main_text, secondary_text },
        } = chosenLocation;
        const address = `${main_text}, ${secondary_text}`;
        const coords = await geocodeCoordsFromAddress(address);
        setLatLng(coords);
      }
    };
    getLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chosenLocation?.description]);

  useEffect(() => {
    if (searchParams.get("lat") && searchParams.get("lng")) {
      setLatLng({
        lat: parseFloat(searchParams.get("lat") as string),
        lng: parseFloat(searchParams.get("lng") as string),
      });
    }
  }, [searchParams]);

  return (
    <Container sx={mapStyles.container} disableGutters>
      <MapContainer coords={latLng} forceTriggerQuery={true} />
    </Container>
  );
}
