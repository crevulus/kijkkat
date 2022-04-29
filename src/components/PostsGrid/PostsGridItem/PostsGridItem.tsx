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

  const [webpValue, webpLoading, webpLoadError] = useDownloadURL(
    ref(storage, item.data.thumbnailUrlWebp)
  );
  const [jpegValue, jpegLoading, jpegLoadError] = useDownloadURL(
    ref(storage, item.data.thumbnailUrlJpeg)
  );
  const [fallbackValue, fallbackLoading, fallbackLoadError] = useDownloadURL(
    ref(storage, item.data.imageUrl)
  );
  const navigate = useNavigate();

  useEffect(() => {
    if (webpLoadError && jpegLoadError && fallbackLoadError) {
      setError(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [webpLoadError, jpegLoadError, fallbackLoadError]);

  const path = useMemo(() => {
    return generatePath(NavigationRoutes.PostsDynamic, { id: item.id });
  }, [item.id]);

  const handleClick = () => {
    navigate(path);
  };

  return (
    <ImageListItem sx={{ alignItems: "center", justifyContent: "center" }}>
      {webpLoading && jpegLoading && fallbackLoading ? (
        <CircularProgress color="secondary" />
      ) : (
        <img
          src={webpValue || jpegValue}
          srcSet={fallbackValue}
          alt={item.title}
          loading="lazy"
          className={styles.image}
          onClick={handleClick}
        />
      )}
    </ImageListItem>
  );
}
