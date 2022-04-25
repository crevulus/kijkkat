import { ReactElement, useEffect, useState } from "react";
import { Box, Grid } from "@mui/material";
import { doc, getFirestore, GeoPoint } from "firebase/firestore";
import { useDocument } from "react-firebase-hooks/firestore";

import styles from "./CreatePost.module.css";

import { firebaseApp } from "../../firebase";
import { RatingPicker, CharacteristicChip } from "../";
import { useErrorStore } from "../../data/store";

const db = getFirestore(firebaseApp);

type CreatePostPropsType = {
  chosenImage: string;
};

export type CharacteristicsTagsType = {
  id: number;
  text: string;
};

export const CreatePost = ({
  chosenImage,
}: CreatePostPropsType): ReactElement => {
  const setError = useErrorStore((state) => state.setError);
  const [values, loading, loadError] = useDocument(
    doc(db, "tags", "appearance")
  );
  const [chosenTags, setChosenTags] = useState<CharacteristicsTagsType[]>([]);
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    if (loadError) {
      setError(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadError]);

  const getLocation = () => {
    if (!(navigator as any).geolocation) {
      setStatus("Geolocation is not supported by your browser");
    } else {
      setStatus("Locating...");
      (navigator as any).geolocation.getCurrentPosition(
        (position: GeolocationPosition) => {
          setStatus(null);
          setLat(position.coords.latitude);
          setLng(position.coords.longitude);
        },
        () => {
          setStatus("Unable to retrieve your location");
        }
      );
    }
  };

  useEffect(() => {
    getLocation();
    if (lat && lng) {
      console.log(new GeoPoint(lat, lng));
    }
    console.log({ lat, lng, status, loading });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lat, lng]);

  const handleTagClick = (tag: CharacteristicsTagsType) => {
    const index = chosenTags.findIndex((t) => t.id === tag.id);
    if (index === -1) {
      setChosenTags([...chosenTags, tag]);
    } else {
      setChosenTags(chosenTags.filter((t) => t.id !== tag.id));
    }
  };

  return (
    <>
      <Box maxWidth="sm" className={styles.CreatePost}>
        <img src={chosenImage} alt="A cat you kijked" width="100%" />
      </Box>
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
      <RatingPicker />
    </>
  );
};
