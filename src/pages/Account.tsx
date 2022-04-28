import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { useLocation, useNavigate } from "react-router-dom";

import { Container, Typography } from "@mui/material";

import { firebaseApp } from "../firebase";
import { useUserStore } from "../data/store";
import { AccountInfo } from "../components";

const auth = getAuth(firebaseApp);

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
        setUser(auth.currentUser);
        handleRedirect();
        return false;
      },
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
    </Container>
  );
}
