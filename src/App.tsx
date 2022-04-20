import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

import { Container, Snackbar, createTheme, ThemeProvider } from "@mui/material";

import { getFirestore, collection } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";

import { firebaseApp } from "./firebase";
import Home from "./pages/Home";
import Map from "./pages/Map";
import Account from "./pages/Account";
import { NavigationRoutes } from "./data/enums";
import { BottomNav } from "./components";

const light = createTheme({
  palette: {
    mode: "light",
  },
});

const dark = createTheme({
  palette: {
    mode: "dark",
  },
});

function App() {
  const [errorSnackbarOpen, setErrorSnackbarOpen] = useState(false);
  const [isDarkMode] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
    <ThemeProvider theme={isDarkMode ? dark : light}>
      <div className="App">
        <BrowserRouter>
          <Container sx={{ flexGrow: 1 }} disableGutters>
            <Routes>
              <Route path={NavigationRoutes.Home} element={<Home />} />
              <Route path={NavigationRoutes.Map} element={<Map />} />
              <Route path={NavigationRoutes.Account} element={<Account />} />
            </Routes>
          </Container>

          <BottomNav />
        </BrowserRouter>
        <Snackbar
          open={errorSnackbarOpen}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          message={error}
        />
      </div>
    </ThemeProvider>
  );
}

export default App;
