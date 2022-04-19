import React, { useEffect, useState } from "react";
import "./App.css";

import PetsIcon from "@mui/icons-material/Pets";
import FavoriteIcon from "@mui/icons-material/Favorite";
import LocationOnIcon from "@mui/icons-material/LocationOn";

import {
  Typography,
  BottomNavigation,
  BottomNavigationAction,
  Container,
  Snackbar,
} from "@mui/material";

import { getFirestore, collection } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";

import { firebaseApp } from "./firebase";

function App() {
  const [value, setValue] = useState(0);
  const [errorSnackbarOpen, setErrorSnackbarOpen] = useState(false);

  const [result, loading, error] = useCollection(
    collection(getFirestore(firebaseApp), "test")
  );

  useEffect(() => {
    if (result) {
      result.docs.forEach((doc) => {
        console.log(doc.data());
      });
    }
  }, [result]);

  const handleCloseSnackbar = () => {
    setErrorSnackbarOpen(false);
  };

  useEffect(() => {
    if (error) {
      setErrorSnackbarOpen(true);
    } else {
      handleCloseSnackbar();
    }
  }, [error]);

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
      <Snackbar
        open={errorSnackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={error}
      />
    </div>
  );
}

export default App;
