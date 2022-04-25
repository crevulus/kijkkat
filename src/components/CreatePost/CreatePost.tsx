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
import Geocode from "react-geocode";

import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import LocationOn from "@mui/icons-material/LocationOn";
import Search from "@mui/icons-material/Search";

import styles from "./CreatePost.module.css";

import { firebaseApp } from "../../firebase";
import { RatingPicker, CharacteristicChip } from "../";
import { useErrorStore, useGeographicStore } from "../../data/store";
import { Search as SearchBox } from "../index";

const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);
const storage = getStorage();

type CreatePostPropsType = {
  chosenImage: string;
  chosenFile: File;
};

export type CharacteristicsTagsType = {
  id: number;
  text: string;
};

export const CreatePost = ({
  chosenImage,
  chosenFile,
}: CreatePostPropsType): ReactElement => {
  const setError = useErrorStore((state) => state.setError);
  const currentLocation = useGeographicStore((state) => state.currentLocation);
  const setCurrentLocation = useGeographicStore(
    (state) => state.setCurrentLocation
  );

  const [values, loading, loadError] = useDocument(
    doc(db, "tags", "appearance")
  );
  const [uploadFile, uploading, snapshot, error] = useUploadFile();

  const [chosenTags, setChosenTags] = useState<CharacteristicsTagsType[]>([]);
  const [ratingValue, setRatingValue] = useState<number | null>(null);

  const [wantsCurrentLocation, setWantsCurrentLocation] = useState(true);
  const [checkedCurrentLocation, setCheckedCurrentLocation] = useState(false);
  const [currentAddress, setCurrentAddress] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    if (loadError) {
      setError(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadError]);

  const getLocation = () => {
    setCheckedCurrentLocation(true);
    if (!(navigator as any).geolocation) {
      setStatus("Geolocation is not supported by your browser");
      setWantsCurrentLocation(false);
    } else {
      setStatus("Locating...");
      (navigator as any).geolocation.getCurrentPosition(
        (position: GeolocationPosition) => {
          setStatus(null);
          setCurrentLocation(position);
          Geocode.fromLatLng(
            position.coords.latitude.toString(),
            position.coords.longitude.toString()
          ).then(
            (response) => {
              const address = response.results[0];
              const formattedAddress = address.address_components
                .slice(1, 4)
                .map((a: any) => a.long_name)
                .join(", ");
              setCurrentAddress(formattedAddress);
            },
            (error) => {
              console.error(error);
            }
          );
        },
        () => {
          setStatus("Unable to retrieve your location");
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
    }
    const tags = chosenTags.map((t) => t.id);
    if (chosenFile) {
      const storageRef = ref(storage, "cats/" + chosenFile.name);
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
      try {
        await addDoc(collection(db, "posts"), post);
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <>
      <Box maxWidth="sm" className={styles.CreatePost}>
        <img src={chosenImage} alt="A cat you kijked" width="100%" />
      </Box>
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
      <Card sx={{ p: 2 }}>
        <RatingPicker setRatingValue={setRatingValue} />
      </Card>
      {!checkedCurrentLocation && (
        <>
          <Typography variant="body1" padding={2}>
            Would you like to use your current location?
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button startIcon={<LocationOn />} onClick={getLocation}>
              Find me
            </Button>
            <Button
              endIcon={<Search />}
              onClick={() => {
                setWantsCurrentLocation(false);
                setCheckedCurrentLocation(true);
              }}
            >
              Search
            </Button>
          </Stack>
        </>
      )}
      {checkedCurrentLocation && wantsCurrentLocation && currentAddress && (
        <Card sx={{ m: 2 }}>
          <CardContent>
            <LocationOn color="primary" />
            <Typography variant="body2">{currentAddress}</Typography>
          </CardContent>
        </Card>
      )}
      {checkedCurrentLocation && !wantsCurrentLocation && !currentAddress && (
        <SearchBox />
      )}
      <Button onClick={handleFormSubmit}>Submit Post</Button>
    </>
  );
};
