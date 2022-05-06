import { ReactElement, useEffect, useMemo } from "react";
import { getStorage, ref } from "firebase/storage";
import { useDownloadURL } from "react-firebase-hooks/storage";

import {
  ImageListItem,
  CircularProgress,
  Container,
  Icon,
} from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";

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

  if (item.data.isNSFW) {
    return (
      <Container sx={styles.nsfwContainer}>
        <Icon color="error">
          <CancelIcon />
        </Icon>
      </Container>
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
          alt="A cat was kijk'd!"
          loading="lazy"
          onClick={handleClick}
        />
      )}
    </ImageListItem>
  );
}
