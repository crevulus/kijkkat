import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import { getAuth, GoogleAuthProvider, signOut } from "firebase/auth";
import {
  collection,
  getFirestore,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";

import { Box, Container, Typography } from "@mui/material";

import { firebaseApp } from "../firebase";
import { useUserStore } from "../data/store";
import {
  AccountInfo,
  FullScreenLoadingSpinner,
  PostsGrid,
} from "../components";

const auth = getAuth(firebaseApp);
const db = getFirestore();

const uiConfig = {
  signInFlow: "popup",
  signInOptions: [GoogleAuthProvider.PROVIDER_ID],
};

type LocationStateType = {
  path: string;
};

export function Account() {
  const isSignedIn = useUserStore((state) => state.isSignedIn);
  const setUser = useUserStore((state) => state.setUser);
  const [count, setCount] = useState(1);
  const [loading, setLoading] = useState(false);

  const q = query(
    collection(db, "posts"),
    where("userId", "==", auth.currentUser?.uid || ""),
    orderBy("likes", "desc"),
    limit(count * 2)
  );

  const location = useLocation();
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut(auth);
    setUser(null);
    navigate("/");
  };

  const handleRedirect = () => {
    if (location.state && (location.state as LocationStateType).path) {
      navigate((location.state as LocationStateType).path);
    }
  };

  const handleLoadMoreImages = () => {
    setCount((count) => count + 1);
  };

  const handleLoading = (loadingPosts: boolean) => {
    setLoading(loadingPosts);
  };

  const amendedUiConfig = {
    ...uiConfig,
    callbacks: {
      signInSuccessWithAuthResult: () => {
        setUser(auth.currentUser);
        handleRedirect();
        return false;
      },
      uiShown: () => <FullScreenLoadingSpinner loading={true} />,
    },
  };

  return loading ? (
    <FullScreenLoadingSpinner loading={loading} />
  ) : (
    <Container sx={{ p: 2 }}>
      <Typography variant="h6" color="primary" gutterBottom>
        Your account
      </Typography>
      {!isSignedIn && (
        <StyledFirebaseAuth uiConfig={amendedUiConfig} firebaseAuth={auth} />
      )}
      {isSignedIn && (
        <>
          <AccountInfo handleSignOut={handleSignOut} />
          <Box sx={{ paddingY: 2 }}>
            <Typography variant="h6" color="primary" gutterBottom>
              Cats you've kijk'd
            </Typography>
            <PostsGrid
              q={q}
              loadMoreCallback={handleLoadMoreImages}
              handleLoading={handleLoading}
            />
          </Box>
        </>
      )}
    </Container>
  );
}
