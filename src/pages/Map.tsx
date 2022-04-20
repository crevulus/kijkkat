import { Container, Typography } from "@mui/material";
import { MapContainer } from "../components";
import { useStore } from "../data/store";

export default function Map() {
  const chosenLocation = useStore((state) => state.chosenLocation);
  return (
    <Container sx={{ height: "100%" }} disableGutters>
      <Typography variant="h3">
        {chosenLocation?.structured_formatting.main_text}
      </Typography>
      <MapContainer />
    </Container>
  );
}
