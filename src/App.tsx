import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { doc, getFirestore } from "firebase/firestore";
import { getPerformance } from "firebase/performance";

import {
  AppBar,
  Box,
  Button,
  Container,
  IconButton,
  ThemeProvider,
  Toolbar,
  Typography,
} from "@mui/material";
import ShareIcon from "@mui/icons-material/Share";
import { light, dark } from "./styles/theme";

import {
  connectStoreToReduxDevtools,
  useErrorStore,
  useGeographicStore,
  useSiteDataStore,
  useUserStore,
} from "./data/store";
import { firebaseApp } from "./firebase";

import { Home } from "./pages/Home";
import { Map } from "./pages/Map";
import { Account } from "./pages/Account";
import { Add } from "./pages/Add";
import { Posts } from "./pages/Posts/Posts";
import { NotFound } from "./pages/NotFound";

import { NavigationRoutes } from "./data/enums";
import { BottomNav, ErrorSnackbar } from "./components";
import styles from "./App.styles";

const auth = getAuth(firebaseApp);
const db = getFirestore();
process.env.NODE_ENV === "production" && getPerformance(firebaseApp);

connectStoreToReduxDevtools("userStore", useUserStore);
connectStoreToReduxDevtools("errorStore", useErrorStore);
connectStoreToReduxDevtools("geographicStore", useGeographicStore);
connectStoreToReduxDevtools("siteDataStore", useSiteDataStore);

function App() {
  const setUser = useUserStore((state) => state.setUser);
  const setIsSignedIn = useUserStore((state) => state.setIsSignedIn);
  const setTagsDocData = useSiteDataStore((state) => state.setTagsDocData);
  const [isDarkMode] = useState(false);

  const [tagsDocData] = useDocumentData(doc(db, "tags", "appearance"));

  useEffect(() => {
    if (tagsDocData) {
      setTagsDocData(tagsDocData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tagsDocData]);

  // Listen to the Firebase Auth state and set the local state.
  useEffect(() => {
    const unregisterAuthObserver = onAuthStateChanged(auth, (userData) => {
      setIsSignedIn(!!userData);
      setUser(userData);
    });
    return () => unregisterAuthObserver(); // Make sure we un-register Firebase observers when the component unmounts.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const shareUrl = () => {
    if (!window.navigator.canShare) {
      return;
    }
    window.navigator.share({
      url: window.location.href,
      text: "Check out this cat!",
    });
  };

  return (
    <ThemeProvider theme={isDarkMode ? dark : light}>
      <BrowserRouter>
        <div className="App">
          <AppBar position="static">
            <Toolbar sx={styles.toolbar}>
              <Typography variant="h5" color="white">
                Kijkkat
              </Typography>
              <Box sx={styles.box}>
                <Button variant="white-outlined" color="info">
                  Install
                </Button>
                <IconButton onClick={shareUrl}>
                  <ShareIcon sx={styles.icon} />
                </IconButton>
              </Box>
            </Toolbar>
          </AppBar>
          <Container sx={styles.container} disableGutters>
            <Routes>
              <Route path={NavigationRoutes.Home} element={<Home />} />
              <Route path={NavigationRoutes.Map} element={<Map />} />
              <Route path={NavigationRoutes.Add} element={<Add />} />
              <Route path={NavigationRoutes.Posts} element={<Posts />} />
              <Route path={NavigationRoutes.PostsDynamic} element={<Posts />} />
              <Route path={NavigationRoutes.Account} element={<Account />} />
              <Route path={NavigationRoutes.NotFound} element={<NotFound />} />
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
