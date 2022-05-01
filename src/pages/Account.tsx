import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import {
  collection,
  getFirestore,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";

import { Box, Button, Container, Typography } from "@mui/material";

import { firebaseApp } from "../firebase";
import { useErrorStore, useUserStore } from "../data/store";
import {
  AccountInfo,
  FullScreenLoadingSpinner,
  PostsGrid,
} from "../components";
import { DocsType } from "./Home";

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
  const setError = useErrorStore((state) => state.setError);
  const isSignedIn = useUserStore((state) => state.isSignedIn);
  const setUser = useUserStore((state) => state.setUser);
  const [count, setCount] = useState(1);
  const [docs, setDocs] = useState<DocsType[]>([]);

  const [result, loading, loadError] = useCollection(
    query(
      collection(db, "posts"),
      where("userId", "==", auth.currentUser?.uid || ""),
      orderBy("likes", "desc"),
      limit(count * 2)
    )
  );

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (result) {
      const docs = result.docs.map((doc) => ({ data: doc.data(), id: doc.id }));
      setDocs(docs);
    }
  }, [result]);

  useEffect(() => {
    if (loadError) {
      setError(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadError]);

  const handleRedirect = () => {
    if (location.state && (location.state as LocationStateType).path) {
      navigate((location.state as LocationStateType).path);
    }
  };

  const handleLoadMoreImages = () => {
    setCount((count) => count + 1);
  };

  if (loading) <FullScreenLoadingSpinner loading={loading} />;

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
    <Container sx={{ p: 2 }}>
      <Typography variant="h6" color="primary" gutterBottom>
        Your account
      </Typography>
      {!isSignedIn && (
        <StyledFirebaseAuth uiConfig={amendedUiConfig} firebaseAuth={auth} />
      )}
      {isSignedIn && <AccountInfo />}
      {isSignedIn && (
        <Box sx={{ paddingY: 2 }}>
          <Typography variant="h6" color="primary" gutterBottom>
            Cats you've kijk'd
          </Typography>
          <PostsGrid data={docs} />
          <Button variant="contained" onClick={handleLoadMoreImages}>
            Load more
          </Button>
        </Box>
      )}
    </Container>
  );
}
