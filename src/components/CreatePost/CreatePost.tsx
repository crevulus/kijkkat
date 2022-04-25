import { ReactElement, useEffect, useState } from "react";
import {
  doc,
  GeoPoint,
  getFirestore,
  addDoc,
  Timestamp,
  collection,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getDownloadURL, getStorage, ref } from "firebase/storage";
import { useDocument } from "react-firebase-hooks/firestore";
import { useUploadFile } from "react-firebase-hooks/storage";

import {
  Box,
  Button,
  Card,
  CircularProgress,
  Grid,
  Typography,
} from "@mui/material";

import styles from "./CreatePost.module.css";

import { firebaseApp } from "../../firebase";
import { RatingPicker, CharacteristicChip } from "../";
import { useErrorStore, useGeographicStore } from "../../data/store";
import { LocationPicker } from "../index";
import { useGeocoder } from "../../hooks/useGeocoder";

const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);
const storage = getStorage();

type CreatePostPropsType = {
  chosenFile: File;
};

export type CharacteristicsTagsType = {
  id: number;
  text: string;
};

export const CreatePost = ({
  chosenFile,
}: CreatePostPropsType): ReactElement => {
  const setError = useErrorStore((state) => state.setError);
  const setErrorMessage = useErrorStore((state) => state.setErrorMessage);
  const chosenLocation = useGeographicStore((state) => state.chosenLocation);
  const currentLocation = useGeographicStore((state) => state.currentLocation);
  const setCurrentLocation = useGeographicStore(
    (state) => state.setCurrentLocation
  );
  const { geocodeCoordsFromAddress, geocodeAddressFromCoords } = useGeocoder();

  const [values, loadingChips, chipsLoadError] = useDocument(
    doc(db, "tags", "appearance")
  );
  const [uploadFile] = useUploadFile();

  const [chosenTags, setChosenTags] = useState<CharacteristicsTagsType[]>([]);
  const [ratingValue, setRatingValue] = useState<number>(0);

  const [wantsCurrentLocation, setWantsCurrentLocation] = useState(true);
  const [checkedCurrentLocation, setCheckedCurrentLocation] = useState(false);
  const [currentAddress, setCurrentAddress] = useState("");

  useEffect(() => {
    if (chipsLoadError) {
      setError(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chipsLoadError]);

  const getCurrentLocation = () => {
    setCheckedCurrentLocation(true);
    if (!(navigator as any).geolocation) {
      setError(true);
      setErrorMessage("Geolocation is not supported by your browser");
      setWantsCurrentLocation(false);
    } else {
      (navigator as any).geolocation.getCurrentPosition(
        async (position: GeolocationPosition) => {
          setCurrentLocation(position);
          const address = await geocodeAddressFromCoords(position);
          setCurrentAddress(address);
        },
        () => {
          setError(true);
          setErrorMessage("Unable to retrieve your location");
          setWantsCurrentLocation(false);
        }
      );
    }
  };

  const handleTagClick = (tag: CharacteristicsTagsType) => {
    const index = chosenTags.findIndex((t) => t.id === tag.id);
    if (index === -1) {
      setChosenTags([...chosenTags, tag]);
    } else {
      setChosenTags(chosenTags.filter((t) => t.id !== tag.id));
    }
  };

  const handleFormSubmit = async () => {
    let location;
    let imageUrl;
    if (currentLocation) {
      location = new GeoPoint(
        currentLocation.coords.latitude,
        currentLocation.coords.longitude
      );
    } else if (chosenLocation) {
      const {
        structured_formatting: { main_text, secondary_text },
      } = chosenLocation;
      const address = `${main_text}, ${secondary_text}`;
      const coords = await geocodeCoordsFromAddress(address);
      location = new GeoPoint(coords!.lat, coords!.lng);
    } else {
      setError(true);
      setErrorMessage("You must choose a location");
    }
    const tags = chosenTags.map((t) => t.id);
    if (chosenFile) {
      const storageRef = ref(
        storage,
        `cats/${auth.currentUser?.uid}/${chosenFile.name}`
      );
      await uploadFile(storageRef, chosenFile);
      imageUrl = await getDownloadURL(storageRef).then((downloadURL) => {
        return downloadURL;
      });
      const post = {
        location,
        tags,
        rating: ratingValue,
        userId: auth.currentUser?.uid,
        time: Timestamp.now(),
        likes: 0,
        imageUrl,
      };
      await addDoc(collection(db, "posts"), post).catch((error) => {
        setError(true);
        setErrorMessage(error.message);
      });
    }
  };

  const handleSetPreferences = (preferences: { [key: string]: boolean }) => {
    setWantsCurrentLocation(preferences.wantsCurrentLocation);
    setCheckedCurrentLocation(preferences.checkedCurrentLocation);
  };

  return (
    <>
      <Box maxWidth="sm" className={styles.CreatePost}>
        <img
          src={URL.createObjectURL(chosenFile)}
          alt="A cat you kijked"
          width="100%"
        />
      </Box>
      {loadingChips ? (
        <CircularProgress />
      ) : (
        <Card sx={{ p: 2 }}>
          <Typography variant="h6">Tags</Typography>
          <Grid
            container
            spacing={{ xs: 2, md: 3 }}
            columns={{ xs: 6, sm: 9, md: 12 }}
          >
            {values?.data()?.tags.map((tag: CharacteristicsTagsType) => (
              <CharacteristicChip
                tag={tag}
                key={tag.id}
                handleTagClick={handleTagClick}
              />
            ))}
          </Grid>
        </Card>
      )}
      <Card sx={{ p: 2 }}>
        <RatingPicker
          ratingValue={ratingValue}
          setRatingValue={setRatingValue}
        />
      </Card>
      <LocationPicker
        wantsCurrentLocation={wantsCurrentLocation}
        checkedCurrentLocation={checkedCurrentLocation}
        currentAddress={currentAddress}
        handleGetLocation={getCurrentLocation}
        handleSetPreferences={handleSetPreferences}
      />
      <Button onClick={handleFormSubmit}>Submit Post</Button>
    </>
  );
};
