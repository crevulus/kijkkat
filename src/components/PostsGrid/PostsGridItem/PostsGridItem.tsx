import React, { ReactElement, useEffect } from "react";
import { getStorage, ref } from "firebase/storage";
import { useDownloadURL } from "react-firebase-hooks/storage";

import { ImageListItem, CircularProgress } from "@mui/material";

import styles from "./PostsGridItem.module.css";

import { firebaseApp } from "../../../firebase";
import { useErrorStore } from "../../../data/store";

const storage = getStorage(firebaseApp);

export function PostsGridItem({ item }: any): ReactElement {
  const setError = useErrorStore((state) => state.setError);
  const [value, loading, loadError] = useDownloadURL(
    ref(storage, item.imgSource)
  );

  useEffect(() => {
    if (loadError) {
      setError(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadError]);

  return (
    <ImageListItem sx={{ alignItems: "center", justifyContent: "center" }}>
      {loading ? (
        <CircularProgress color="secondary" />
      ) : (
        <img
          className={styles.image}
          src={value}
          srcSet={value}
          alt={item.timestamp}
          loading="lazy"
        />
      )}
    </ImageListItem>
  );
}
