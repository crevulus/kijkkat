import { useEffect, useState } from "react";

import { Container } from "@mui/material";

// import { MapContainer } from "../components";
import { useGeographicStore } from "../data/store";
import { useGeocoder } from "../hooks/useGeocoder";
import { MapContainer } from "../components/MapContainer/MapContainer";

export type CoordsType = {
  lat: number;
  lng: number;
};

export function Map() {
  const chosenLocation = useGeographicStore((state) => state.chosenLocation);
  const [latLng, setLatLng] = useState<CoordsType | null>(null);

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

  return (
    <Container sx={{ height: "100%" }} disableGutters>
      <MapContainer coords={latLng} forceTriggerQuery={true} />
    </Container>
  );
}
