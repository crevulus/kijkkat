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
import { accountStyles } from "./Pages.styles";

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

  const q = query(
    collection(db, "posts"),
    where("userId", "==", auth.currentUser?.uid || ""),
    orderBy("likes", "desc"),
    limit(count * 12)
  );

  const q2 = query(
    collection(db, "users", auth.currentUser?.uid || "", "likes"),
    orderBy("time", "desc"),
    limit(count * 12)
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

  return (
    <Container sx={accountStyles.container}>
      <Typography variant="h6" color="primary" gutterBottom>
        Your account
      </Typography>
      {!isSignedIn && (
        <StyledFirebaseAuth uiConfig={amendedUiConfig} firebaseAuth={auth} />
      )}
      {isSignedIn && (
        <>
          <AccountInfo handleSignOut={handleSignOut} />
          <Box sx={accountStyles.box}>
            <Typography variant="h6" color="primary" gutterBottom>
              Cats you've kijk'd
            </Typography>
            <PostsGrid q={q} loadMoreCallback={handleLoadMoreImages} />
          </Box>
          <Box sx={accountStyles.box}>
            <Typography variant="h6" color="primary" gutterBottom>
              Cats you've liked
            </Typography>
            <PostsGrid q={q2} loadMoreCallback={handleLoadMoreImages} />
          </Box>
        </>
      )}
    </Container>
  );
}
