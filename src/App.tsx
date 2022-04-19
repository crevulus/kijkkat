import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Link as RouterLink,
  Routes,
  Route,
} from "react-router-dom";
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
  CircularProgress,
} from "@mui/material";

import { getFirestore, collection } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";

import { firebaseApp } from "./firebase";

const container = (text: string, loading: boolean) => {
  return (
    <Container sx={{ flexGrow: 1 }}>
      {loading ? (
        <CircularProgress />
      ) : (
        <Typography variant="h1" gutterBottom>
          {text}
        </Typography>
      )}
    </Container>
  );
};

function App() {
  const [value, setValue] = useState(0);
  const [errorSnackbarOpen, setErrorSnackbarOpen] = useState(false);

  const [result, loading, error] = useCollection(
    collection(getFirestore(firebaseApp), "test")
  );

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
      <BrowserRouter>
        <Routes>
          <Route path="/" element={container("Home", loading)} />
          <Route path="/map" element={container("Map", loading)} />
          <Route
            path="/favourites"
            element={container("Favourites", loading)}
          />
        </Routes>

        <BottomNavigation
          showLabels
          value={value}
          onChange={(_, newValue) => {
            setValue(newValue);
          }}
        >
          <BottomNavigationAction
            label="Cats"
            icon={<PetsIcon />}
            component={RouterLink}
            to="/"
          />
          <BottomNavigationAction
            label="Map"
            icon={<LocationOnIcon />}
            component={RouterLink}
            to="/map"
          />
          <BottomNavigationAction
            label="Favourites"
            icon={<FavoriteIcon />}
            component={RouterLink}
            to="/favourites"
          />
        </BottomNavigation>
      </BrowserRouter>
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
