import { useEffect, lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { doc, getFirestore } from "firebase/firestore";
import { getPerformance } from "firebase/performance";

import {
  AppBar,
  Box,
  Container,
  IconButton,
  ThemeProvider,
  Toolbar,
  Typography,
} from "@mui/material";
import ShareIcon from "@mui/icons-material/Share";
import { light } from "./styles/theme";

import {
  connectStoreToReduxDevtools,
  useErrorStore,
  useGeographicStore,
  useSiteDataStore,
  useUserStore,
} from "./data/store";
import { firebaseApp } from "./firebase";

import { NavigationRoutes } from "./data/enums";
import {
  BottomNav,
  ErrorSnackbar,
  FullScreenLoadingSpinner,
} from "./components";
import { InstallButton } from "./components/utils/InstallButton";
import { isDesktop } from "./utils/deviceUtils";

import { Home } from "./pages/Home";

import styles from "./App.styles";

const Account = lazy(async () => ({
  default: (await import("./pages/Account")).Account,
}));
const Add = lazy(async () => ({
  default: (await import("./pages/Add")).Add,
}));
const Desktop = lazy(async () => ({
  default: (await import("./pages/Desktop")).Desktop,
}));
const Map = lazy(async () => ({
  default: (await import("./pages/Map")).Map,
}));
const Miscellaneous = lazy(async () => ({
  default: (await import("./pages/Miscellaneous")).Miscellaneous,
}));
const NotFound = lazy(async () => ({
  default: (await import("./pages/NotFound")).NotFound,
}));
const Posts = lazy(async () => ({
  default: (await import("./pages/Posts/Posts")).Posts,
}));

const auth = getAuth(firebaseApp);
const db = getFirestore();
process.env.NODE_ENV === "production" && getPerformance(firebaseApp);

connectStoreToReduxDevtools("userStore", useUserStore);
connectStoreToReduxDevtools("errorStore", useErrorStore);
connectStoreToReduxDevtools("geographicStore", useGeographicStore);
connectStoreToReduxDevtools("siteDataStore", useSiteDataStore);

function App() {
  const setError = useErrorStore((state) => state.setError);
  const setUser = useUserStore((state) => state.setUser);
  const setIsSignedIn = useUserStore((state) => state.setIsSignedIn);
  const setTagsDocData = useSiteDataStore((state) => state.setTagsDocData);

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
      setError(true, "Your browser does not support sharing");
      return;
    }
    window.navigator.share({
      title: "Kijkkat",
      url: window.location.href,
      text: "Explore the city with cats",
    });
  };

  if (isDesktop()) {
    return (
      <ThemeProvider theme={light}>
        <div className="App">
          <Desktop />
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={light}>
      <BrowserRouter>
        <div className="App">
          <AppBar position="static">
            <Toolbar sx={styles.toolbar}>
              <Typography variant="h5" color="white">
                Kijkkat
              </Typography>
              <Box sx={styles.box}>
                <InstallButton />
                <IconButton onClick={shareUrl}>
                  <ShareIcon sx={styles.icon} />
                </IconButton>
              </Box>
            </Toolbar>
          </AppBar>
          <Container sx={styles.container} disableGutters>
            <Suspense fallback={<FullScreenLoadingSpinner loading={true} />}>
              <Routes>
                <Route path={NavigationRoutes.Home} element={<Home />} />
                <Route path={NavigationRoutes.Map} element={<Map />} />
                <Route path={NavigationRoutes.Add} element={<Add />} />
                <Route path={NavigationRoutes.Posts} element={<Posts />} />
                <Route
                  path={NavigationRoutes.PostsDynamic}
                  element={<Posts />}
                />
                <Route path={NavigationRoutes.Account} element={<Account />} />
                <Route
                  path={NavigationRoutes.Miscellaneous}
                  element={<Miscellaneous />}
                />
                <Route
                  path={NavigationRoutes.NotFound}
                  element={<NotFound />}
                />
              </Routes>
            </Suspense>
          </Container>
          <BottomNav />
        </div>
      </BrowserRouter>
      <ErrorSnackbar />
    </ThemeProvider>
  );
}

export default App;
