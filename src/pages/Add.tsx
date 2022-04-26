import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
// import { getStorage, ref } from "firebase/storage";
import { useUploadFile } from "react-firebase-hooks/storage";

import {
  Box,
  Button,
  CircularProgress,
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
import { useErrorStore, useUserStore } from "../data/store";
import { CreatePost } from "../components";

const auth = getAuth(firebaseApp);

const RootContainer = styled(Container)(({ theme }) => ({
  width: "100%",
  ...theme.typography.body2,
  "& > :not(style) + :not(style)": {
    marginTop: theme.spacing(2),
  },
}));

export function Add() {
  const setError = useErrorStore((state) => state.setError);
  const isSignedIn = useUserStore((state) => state.isSignedIn);
  const navigate = useNavigate();
  const location = useLocation();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [uploadFile, uploading, snapshot, loadError] = useUploadFile();
  const [chosenFile, setChosenFile] = useState<File | null>(null);
  const [showAlert, setShowAlert] = useState(false);

  const checkSignedIn = () => {
    if (!auth.currentUser) {
      setShowAlert(true);
    }
    console.log(auth.currentUser);
  };

  const handleRedirect = () => {
    if (!auth.currentUser) {
      navigate(NavigationRoutes.Account, {
        state: { path: location.pathname },
      });
    }
  };

  const handleCapture = async (eventTarget: HTMLInputElement) => {
    if (eventTarget.files) {
      setChosenFile(null);
      const imageForUpload = eventTarget.files[0];
      setChosenFile(imageForUpload);
    }
  };

  useEffect(() => {
    if (loadError) {
      setError(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadError]);

  return (
    <RootContainer sx={{ mt: 2, mb: 2 }}>
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
          onChange={(e) => handleCapture(e.target)}
        />
      </Box>
      <Divider>
        <Typography variant="overline">OR</Typography>
      </Divider>
      <Button variant="contained">Upload from gallery</Button>
      {uploading && (
        <Container>
          <CircularProgress />
        </Container>
      )}
      {chosenFile && <CreatePost chosenFile={chosenFile} />}
    </RootContainer>
  );
}
