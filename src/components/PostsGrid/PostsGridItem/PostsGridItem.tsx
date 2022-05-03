import React, { ReactElement, useEffect, useMemo } from "react";
import { getStorage, ref } from "firebase/storage";
import { useDownloadURL } from "react-firebase-hooks/storage";

import { ImageListItem, CircularProgress, Typography } from "@mui/material";

import { firebaseApp } from "../../../firebase";
import { useErrorStore } from "../../../data/store";
import { generatePath, useNavigate } from "react-router-dom";
import { NavigationRoutes } from "../../../data/enums";

import styles, { StyledImage } from "./PostsGridItem.styles";

const storage = getStorage(firebaseApp);

export function PostsGridItem({ item }: any): ReactElement {
  const setError = useErrorStore((state) => state.setError);

  const [webpValue, webpLoading, webpLoadError] = useDownloadURL(
    ref(storage, item.data.thumbnailUrlWebpSmall)
  );
  const [jpegValue, jpegLoading, jpegLoadError] = useDownloadURL(
    ref(storage, item.data.thumbnailUrlJpegSmall)
  );
  const navigate = useNavigate();

  useEffect(() => {
    if (webpLoadError && jpegLoadError) {
      setError(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [webpLoadError, jpegLoadError]);

  const path = useMemo(() => {
    return generatePath(NavigationRoutes.PostsDynamic, { id: item.id });
  }, [item.id]);

  const handleClick = () => {
    navigate(path);
  };

  if (item.isNSFW) {
    return (
      <Typography variant="body2" color="error">
        NSFW!
      </Typography>
    );
  }

  return (
    <ImageListItem sx={styles.imageListItem}>
      {webpLoading && jpegLoading ? (
        <CircularProgress color="secondary" />
      ) : (
        <StyledImage
          src={webpValue || jpegValue}
          srcSet={jpegValue}
          alt={item.title}
          loading="lazy"
          onClick={handleClick}
        />
      )}
    </ImageListItem>
  );
}
