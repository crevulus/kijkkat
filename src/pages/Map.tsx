import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { Container } from "@mui/material";

import { MapContainer } from "../components/MapContainer/MapContainer";
import { mapStyles } from "./Pages.styles";

export type CoordsType = {
  lat: number;
  lng: number;
};

export function Map() {
  const [latLng, setLatLng] = useState<CoordsType | null>(null);
  const [zoom, setZoom] = useState(12);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.get("lat") && searchParams.get("lng")) {
      setLatLng({
        lat: parseFloat(searchParams.get("lat") as string),
        lng: parseFloat(searchParams.get("lng") as string),
      });
    }
    if (searchParams.get("zoom")) {
      setZoom(parseInt(searchParams.get("zoom")!, 10));
    }
  }, [searchParams]);

  return (
    <Container sx={mapStyles.container} disableGutters>
      <MapContainer coords={latLng} zoom={zoom} forceTriggerQuery={true} />
    </Container>
  );
}
