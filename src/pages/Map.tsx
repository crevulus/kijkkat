import { Container } from "@mui/material";
import { MapContainer } from "../components";

export default function Map() {
  return (
    <Container sx={{ height: "100%" }} disableGutters>
      <MapContainer />
    </Container>
  );
}
