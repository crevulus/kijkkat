import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import {
  // connectAuthEmulator,
  getAuth,
  GoogleAuthProvider,
} from "firebase/auth";
import { useLocation, useNavigate } from "react-router-dom";

import { Typography } from "@mui/material";

import { firebaseApp } from "../firebase";
import { useUserStore } from "../data/store";

const auth = getAuth(firebaseApp);
// connectAuthEmulator(auth, "http://localhost:9099");

const uiConfig = {
  signInFlow: "popup",
  signInOptions: [GoogleAuthProvider.PROVIDER_ID],
};

type LocationStateType = {
  path: string;
};

export function Account() {
  const isSignedIn = useUserStore((state) => state.isSignedIn);
  const location = useLocation();
  const navigate = useNavigate();

  const handleRedirect = () => {
    if (location.state && (location.state as LocationStateType).path) {
      navigate((location.state as LocationStateType).path);
    }
  };

  const amendedUiConfig = {
    ...uiConfig,
    callbacks: {
      signInSuccessWithAuthResult: () => {
        handleRedirect();
        return false;
      },
    },
  };

  return (
    <>
      <Typography variant="h1" gutterBottom>
        Account
      </Typography>
      <StyledFirebaseAuth uiConfig={amendedUiConfig} firebaseAuth={auth} />
      {isSignedIn && auth.currentUser?.email}
    </>
  );
}
