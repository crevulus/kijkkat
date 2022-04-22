import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";

import { Box, Button, Container, Divider, styled } from "@mui/material";

import { firebaseApp } from "../firebase";
import { NavigationRoutes } from "../data/enums";

const auth = getAuth(firebaseApp);

const Root = styled(Container)(({ theme }) => ({
  width: "100%",
  height: "100%",
  ...theme.typography.body2,
  "& > :not(style) + :not(style)": {
    marginTop: theme.spacing(2),
  },
}));

export function Add() {
  const navigate = useNavigate();

  const handleRedirectIfNotSignedIn = () => {
    if (!auth.currentUser) {
      navigate(NavigationRoutes.Account);
    }
  };

  const handleCapture = (event: HTMLInputElement) => {
    handleRedirectIfNotSignedIn();
    console.log(event);
  };

  return (
    <Root>
      <Button>
        <label htmlFor="capture-button">Click here</label>
      </Button>
      <br />
      <Box display="none">
        <input
          accept="image/*"
          id="capture-button"
          type="file"
          capture="environment"
          onChange={(e) => handleCapture(e.target)}
        />
      </Box>
      <Divider>OR</Divider>
      <Button variant="contained">Upload from gallery</Button>
    </Root>
  );
}
