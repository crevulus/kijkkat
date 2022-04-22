import { useEffect, useState } from "react";
import Geocode from "react-geocode";

import { Container } from "@mui/material";

import { MapContainer } from "../components";
import { useGeographicStore } from "../data/store";

type CoordsType = {
  lat: number;
  lng: number;
};

Geocode.setApiKey(process.env.REACT_APP_GOOGLE_MAPS_GEOCODING_API_KEY!);

export function Map() {
  const chosenLocation = useGeographicStore((state) => state.chosenLocation);
  const [latLng, setLatLng] = useState<CoordsType | null>(null);

  useEffect(() => {
    if (chosenLocation) {
      const {
        structured_formatting: { main_text, secondary_text },
      } = chosenLocation;
      Geocode.fromAddress(`${main_text}, ${secondary_text}`).then(
        (response: any) => {
          const { lat, lng } = response.results[0].geometry.location;
          setLatLng({ lat, lng });
        },
        (error: any) => {
          console.error(error);
        }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chosenLocation?.description]);

  return (
    <Container sx={{ height: "100%" }} disableGutters>
      <MapContainer coords={latLng} />
    </Container>
  );
}
