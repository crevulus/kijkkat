import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";

import {
  Box,
  Button,
  Container,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
  Divider,
  styled,
  Typography,
  Grow,
} from "@mui/material";

import { firebaseApp } from "../firebase";
import { NavigationRoutes } from "../data/enums";
import { useUserStore } from "../data/store";
import { CreatePost } from "../components";

const auth = getAuth(firebaseApp);

const RootContainer = styled(Container)(({ theme }) => ({
  ...theme.typography.body2,
  "& > :not(style) + :not(style)": {
    marginTop: theme.spacing(2),
  },
}));

export function Add() {
  const isSignedIn = useUserStore((state) => state.isSignedIn);
  const navigate = useNavigate();
  const location = useLocation();
  const [chosenFile, setChosenFile] = useState<File | null>(null);
  const [showAlert, setShowAlert] = useState(false);

  const checkSignedIn = () => {
    if (!auth.currentUser) {
      setShowAlert(true);
    }
  };

  const handleRedirect = () => {
    if (!auth.currentUser) {
      navigate(NavigationRoutes.Account, {
        state: { path: location.pathname },
      });
    }
  };

  const handleAddPicture = async (eventTarget: HTMLInputElement) => {
    if (eventTarget.files) {
      setChosenFile(null);
      const imageForUpload = eventTarget.files[0];
      setChosenFile(imageForUpload);
    }
  };

  return (
    <RootContainer sx={{ mt: 2, mb: 2, width: "100%" }}>
      <Dialog
        open={showAlert}
        onClose={() => setShowAlert(false)}
        TransitionComponent={Grow}
        keepMounted
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>Uh oh, you need to be signed in to do that...</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            You can post pictures to your heart's content once we know who you
            are.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center" }}>
          <Button onClick={handleRedirect} variant="outlined">
            Login
          </Button>
        </DialogActions>
      </Dialog>
      <Button variant="contained" onClick={checkSignedIn}>
        <label htmlFor="capture-button">Take a photo</label>
      </Button>
      <Box display="none">
        <input
          accept="image/*"
          id="capture-button"
          type="file"
          capture="environment"
          disabled={!isSignedIn}
          onChange={(e) => handleAddPicture(e.target)}
        />
      </Box>
      <Divider>
        <Typography variant="overline">OR</Typography>
      </Divider>
      <Button variant="contained" onClick={checkSignedIn}>
        <label htmlFor="upload-button">Upload from gallery</label>
      </Button>
      <Box display="none">
        <input
          accept="image/*"
          id="upload-button"
          type="file"
          disabled={!isSignedIn}
          onChange={(e) => handleAddPicture(e.target)}
        />
      </Box>
      {chosenFile && <CreatePost chosenFile={chosenFile} />}
    </RootContainer>
  );
}
