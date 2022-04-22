import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

import { Typography } from "@mui/material";
import { firebaseApp } from "../firebase";
import { useUserStore } from "../data/store";

const auth = getAuth(firebaseApp);

// Configure FirebaseUI.
const uiConfig = {
  // Popup signin flow rather than redirect flow.
  signInFlow: "popup",
  // We will display Google and Facebook as auth providers.
  signInOptions: [GoogleAuthProvider.PROVIDER_ID],
  callbacks: {
    // Avoid redirects after sign-in.
    signInSuccessWithAuthResult: () => false,
  },
};

export default function Account() {
  const user = useUserStore((state) => state.user);
  const isSignedIn = useUserStore((state) => state.isSignedIn);

  return (
    <>
      <Typography variant="h1" gutterBottom>
        Account
      </Typography>
      <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth} />
      {isSignedIn && user?.email}
    </>
  );
}
