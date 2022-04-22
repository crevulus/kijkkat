import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { getStorage, ref } from "firebase/storage";
import { useUploadFile } from "react-firebase-hooks/storage";

import {
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  styled,
  Typography,
} from "@mui/material";

import { firebaseApp } from "../firebase";
import { NavigationRoutes } from "../data/enums";

const auth = getAuth(firebaseApp);
const storage = getStorage(firebaseApp);

const Root = styled(Container)(({ theme }) => ({
  width: "100%",
  height: "100%",
  ...theme.typography.body2,
  "& > :not(style) + :not(style)": {
    marginTop: theme.spacing(2),
  },
}));

const FIREBASE_IMAGE_SUBFOLDER = "cats";

export function Add() {
  const navigate = useNavigate();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [uploadFile, uploading, _, error] = useUploadFile();

  const handleRedirectIfNotSignedIn = () => {
    if (!auth.currentUser) {
      navigate(NavigationRoutes.Account);
    }
  };

  const handleCapture = async (eventTarget: HTMLInputElement) => {
    if (eventTarget.files) {
      const imageForUpload = eventTarget.files[0];
      const bucketRef = ref(
        storage,
        `${FIREBASE_IMAGE_SUBFOLDER}/${imageForUpload.lastModified}`
      );
      await uploadFile(bucketRef, imageForUpload, {
        contentType: "image/jpeg",
      });
    }
  };

  return (
    <Root>
      {error && <Typography variant="h6">Error...</Typography>}
      <Button variant="contained" onClick={handleRedirectIfNotSignedIn}>
        <label htmlFor="capture-button">Take a photo</label>
      </Button>
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
      {uploading && (
        <Container>
          <CircularProgress />
        </Container>
      )}
    </Root>
  );
}
