import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";

import { AppBar, Container, ThemeProvider, Toolbar } from "@mui/material";
import "./App.css";
import { light, dark } from "./styles/theme";

import { useUserStore } from "./data/store";
import { firebaseApp } from "./firebase";

import { Home } from "./pages/Home";
import { Map } from "./pages/Map";
import { Account } from "./pages/Account";
import { Add } from "./pages/Add";
import { Posts } from "./pages/Posts/Posts";

import { NavigationRoutes } from "./data/enums";
import { BottomNav, ErrorSnackbar } from "./components";

const auth = getAuth(firebaseApp);

function App() {
  const setUser = useUserStore((state) => state.setUser);
  const setIsSignedIn = useUserStore((state) => state.setIsSignedIn);
  const [isDarkMode] = useState(false);

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
      <BrowserRouter>
        <div className="App">
          <AppBar position="static">
            <Toolbar>Kijkkat</Toolbar>
          </AppBar>
          <Container sx={{ flexGrow: 1, overflowY: "scroll" }} disableGutters>
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
        </div>
      </BrowserRouter>
      <ErrorSnackbar />
    </ThemeProvider>
  );
}

export default App;
