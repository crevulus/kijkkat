import React, { ReactElement, useEffect, useMemo } from "react";
import { getStorage, ref } from "firebase/storage";
import { useDownloadURL } from "react-firebase-hooks/storage";

import { ImageListItem, CircularProgress } from "@mui/material";

import styles from "./PostsGridItem.module.css";

import { firebaseApp } from "../../../firebase";
import { useErrorStore } from "../../../data/store";
import { generatePath, useNavigate } from "react-router-dom";
import { NavigationRoutes } from "../../../data/enums";

const storage = getStorage(firebaseApp);

export function PostsGridItem({ item }: any): ReactElement {
  const setError = useErrorStore((state) => state.setError);

  const [value, loading, loadError] = useDownloadURL(
    ref(storage, item.data.imageUrl)
  );
  const navigate = useNavigate();

  useEffect(() => {
    if (loadError) {
      setError(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadError]);

  const path = useMemo(() => {
    return generatePath(NavigationRoutes.PostsDynamic, { id: item.id });
  }, [item.id]);

  const handleClick = () => {
    navigate(path);
  };

  return (
    <ImageListItem sx={{ alignItems: "center", justifyContent: "center" }}>
      {loading ? (
        <CircularProgress color="secondary" />
      ) : (
        <img
          className={styles.image}
          src={value}
          srcSet={value}
          alt={item.data.time}
          loading="lazy"
          aria-label="Click here to check out this cat"
          onClick={handleClick}
        />
      )}
    </ImageListItem>
  );
}
