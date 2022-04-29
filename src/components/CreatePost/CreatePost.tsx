import { Fragment, ReactElement, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  doc,
  GeoPoint,
  getFirestore,
  Timestamp,
  setDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage, ref } from "firebase/storage";
import { useDocument } from "react-firebase-hooks/firestore";
import { useUploadFile } from "react-firebase-hooks/storage";
import * as geofire from "geofire-common";
import { v4 as uuidv4 } from "uuid";

import {
  Box,
  Button,
  Card,
  CircularProgress,
  Divider,
  Grid,
  Typography,
} from "@mui/material";

import styles from "./CreatePost.module.css";

import { firebaseApp } from "../../firebase";
import { RatingPicker, CharacteristicChip } from "../";
import { useErrorStore, useGeographicStore } from "../../data/store";
import { LocationPicker } from "../index";
import { useGeocoder } from "../../hooks/useGeocoder";
import { NavigationRoutes, RatingCategories } from "../../data/enums";
import FullScreenLoadingSpinner from "../FullScreenLoadingSpinner";

const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);
const storage = getStorage();

const editThumbnailFileName = (
  fileName: string,
  fileFormat: string,
  userId: string | undefined
) => {
  return `gs://kijkkat-meow.appspot.com/cats/${userId}/resizes/${fileName}${fileFormat}`;
};

const uuid = uuidv4();

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
  const navigate = useNavigate();

  const [chosenTags, setChosenTags] = useState<CharacteristicsTagsType[]>([]);
  const [ratingValue, setRatingValue] = useState<{ [key: string]: number }>({
    [RatingCategories.Cuteness]: 0,
    [RatingCategories.Friendliness]: 0,
  });

  const [wantsCurrentLocation, setWantsCurrentLocation] = useState(true);
  const [checkedCurrentLocation, setCheckedCurrentLocation] = useState(false);
  const [currentAddress, setCurrentAddress] = useState("");

  const [loading, setLoading] = useState(false);

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
          const address = await geocodeAddressFromCoords(position.coords);
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
    setLoading(true);
    let location;
    let geohash;
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
    if (location) {
      geohash = geofire.geohashForLocation([
        location.latitude,
        location.longitude,
      ]);
    }
    const tags = chosenTags.map((t) => t.id);
    if (chosenFile) {
      const extension = chosenFile.name.substring(
        chosenFile.name.lastIndexOf(".") + 1,
        chosenFile.name.length
      );
      const storageRef = ref(
        storage,
        `cats/${auth.currentUser?.uid}/${uuid}.${extension}`
      );
      await uploadFile(storageRef, chosenFile);
      const thumbnailUrlWebpSmall = editThumbnailFileName(
        uuid,
        "_200x200.webp",
        auth.currentUser?.uid
      );
      const thumbnailUrlJpegSmall = editThumbnailFileName(
        uuid,
        "_200x200.jpeg",
        auth.currentUser?.uid
      );
      const thumbnailUrlWebpLarge = editThumbnailFileName(
        uuid,
        "_400x400.webp",
        auth.currentUser?.uid
      );
      const thumbnailUrlJpegLarge = editThumbnailFileName(
        uuid,
        "_400x400.jpeg",
        auth.currentUser?.uid
      );
      const post = {
        location,
        geohash,
        tags,
        rating: ratingValue,
        userId: auth.currentUser?.uid,
        userName: auth.currentUser?.displayName,
        time: Timestamp.now(),
        likes: 0,
        likedBy: [],
        thumbnailUrlWebpSmall,
        thumbnailUrlJpegSmall,
        thumbnailUrlWebpLarge,
        thumbnailUrlJpegLarge,
      };
      await setDoc(doc(db, "posts", uuid), post)
        .then(() => navigate(`${NavigationRoutes.Posts}/${uuid}`))
        .catch((error) => {
          setError(true);
          setErrorMessage(error.message);
        });
      setLoading(false);
    }
  };

  const handleChangeRatingValue = (category: string, value: number) => {
    setRatingValue({
      ...ratingValue,
      [category]: value,
    });
  };

  const handleSetPreferences = (preferences: { [key: string]: boolean }) => {
    setWantsCurrentLocation(preferences.wantsCurrentLocation);
    setCheckedCurrentLocation(preferences.checkedCurrentLocation);
  };

  return (
    <>
      {loading && <FullScreenLoadingSpinner loading={loading} />}
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
        {Object.keys(ratingValue).map((category, index) => (
          <Fragment key={category}>
            <RatingPicker
              key={category}
              title={category}
              ratingValue={ratingValue[category]}
              handleRatingValue={handleChangeRatingValue}
            />
            {index !== Object.keys(ratingValue).length - 1 && <Divider />}
          </Fragment>
        ))}
      </Card>
      <LocationPicker
        wantsCurrentLocation={wantsCurrentLocation}
        checkedCurrentLocation={checkedCurrentLocation}
        currentAddress={currentAddress}
        handleGetLocation={getCurrentLocation}
        handleSetPreferences={handleSetPreferences}
      />
      <Button variant="contained" onClick={handleFormSubmit}>
        Submit Post
      </Button>
    </>
  );
};
