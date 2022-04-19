import React from "react";
import "./App.css";

import PetsIcon from "@mui/icons-material/Pets";
import FavoriteIcon from "@mui/icons-material/Favorite";
import LocationOnIcon from "@mui/icons-material/LocationOn";

import {
  Typography,
  BottomNavigation,
  BottomNavigationAction,
  Container,
} from "@mui/material";

function App() {
  const [value, setValue] = React.useState(0);
  return (
    <div className="App">
      <Container sx={{ flexGrow: 1 }}>
        <Typography variant="h1" gutterBottom>
          Kijkkat
        </Typography>
      </Container>
      <BottomNavigation
        showLabels
        value={value}
        onChange={(_, newValue) => {
          setValue(newValue);
        }}
      >
        <BottomNavigationAction label="Cats" icon={<PetsIcon />} />
        <BottomNavigationAction label="Map" icon={<LocationOnIcon />} />
        <BottomNavigationAction label="Favorites" icon={<FavoriteIcon />} />
      </BottomNavigation>
    </div>
  );
}

export default App;
