import { useState } from "react";

import {
  Box,
  Button,
  Container,
  Divider,
  styled,
  Typography,
} from "@mui/material";

import { useUserStore } from "../data/store";
import { CreatePost } from "../components";
import { addStyles } from "./Pages.styles";
import { SignInDialog } from "../components/utils/SignInDialog";
import { useCheckSignedIn } from "../hooks/useCheckSignedIn";

const DIALOG_MESSAGE_ACTION = "post pictures";

const RootContainer = styled(Container)(({ theme }) => ({
  ...theme.typography.body2,
  "& > :not(style) + :not(style)": {
    marginTop: theme.spacing(2),
  },
}));

export function Add() {
  const isSignedIn = useUserStore((state) => state.isSignedIn);
  const [chosenFile, setChosenFile] = useState<File | null>(null);
  const { showAlert, setShowAlert, checkSignedIn } = useCheckSignedIn();

  const handleAddPicture = async (eventTarget: HTMLInputElement) => {
    if (eventTarget.files) {
      setChosenFile(null);
      const imageForUpload = eventTarget.files[0];
      setChosenFile(imageForUpload);
    }
  };

  return (
    <RootContainer sx={addStyles.rootContainer}>
      <SignInDialog
        showAlert={showAlert}
        setShowAlert={setShowAlert}
        message={DIALOG_MESSAGE_ACTION}
      />
      <Typography variant="h6" color="primary" gutterBottom>
        Add a new post
      </Typography>
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
