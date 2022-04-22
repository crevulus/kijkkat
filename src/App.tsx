import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";

import { Container, Snackbar, ThemeProvider } from "@mui/material";
import "./App.css";
import { light, dark } from "./styles/theme";

import { useUserStore } from "./data/store";
import { firebaseApp } from "./firebase";

import { Home } from "./pages/Home";
import { Map } from "./pages/Map";
import { Account } from "./pages/Account";
import { Add } from "./pages/Add";
import { Posts } from "./pages/Posts";

import { NavigationRoutes } from "./data/enums";
import { BottomNav } from "./components";

const auth = getAuth(firebaseApp);

function App() {
  const setUser = useUserStore((state) => state.setUser);
  const setIsSignedIn = useUserStore((state) => state.setIsSignedIn);
  const [errorSnackbarOpen, setErrorSnackbarOpen] = useState(false);
  const [isDarkMode] = useState(false);

  const handleCloseSnackbar = () => {
    setErrorSnackbarOpen(false);
  };

  // Listen to the Firebase Auth state and set the local state.
  useEffect(() => {
    const unregisterAuthObserver = onAuthStateChanged(auth, (userData) => {
      setIsSignedIn(!!userData);
      setUser(userData);
    });
    return () => unregisterAuthObserver(); // Make sure we un-register Firebase observers when the component unmounts.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ThemeProvider theme={isDarkMode ? dark : light}>
      <div className="App">
        <BrowserRouter>
          <Container sx={{ flexGrow: 1 }} disableGutters>
            <Routes>
              <Route path={NavigationRoutes.Home} element={<Home />} />
              <Route path={NavigationRoutes.Map} element={<Map />} />
              <Route path={NavigationRoutes.Add} element={<Add />} />
              <Route path={NavigationRoutes.Posts} element={<Posts />} />
              <Route path={NavigationRoutes.PostsDynamic} element={<Posts />} />
              <Route path={NavigationRoutes.Account} element={<Account />} />
            </Routes>
          </Container>
          <BottomNav />
        </BrowserRouter>
        <Snackbar
          open={errorSnackbarOpen}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
        />
      </div>
    </ThemeProvider>
  );
}

export default App;
