import React, { ReactElement, useEffect } from "react";
import { CardMedia } from "@mui/material";
import { useDownloadURL } from "react-firebase-hooks/storage";
import { getStorage, ref } from "firebase/storage";
import { useErrorStore } from "../../data/store";
import FullScreenLoadingSpinner from "../FullScreenLoadingSpinner";

const storage = getStorage();

type MainImagePropsType = {
  webpUrl: string;
  jpegUrl: string;
  fallbackUrl: string;
};

// TODO: Refactor and figure out the urls thing so I don't need this component at all
export function MainImage({
  webpUrl,
  jpegUrl,
  fallbackUrl,
}: MainImagePropsType): ReactElement {
  const setError = useErrorStore((state) => state.setError);
  const [webpImage, webpLoading, webpLoadError] = useDownloadURL(
    ref(storage, webpUrl)
  );
  const [jpegImage, jpegLoading, jpegLoadError] = useDownloadURL(
    ref(storage, jpegUrl)
  );

  useEffect(() => {
    if (webpLoadError && jpegLoadError && !fallbackUrl) {
      setError(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [webpLoadError, jpegLoadError, fallbackUrl]);

  if (webpLoading && jpegLoading && !fallbackUrl)
    <FullScreenLoadingSpinner
      loading={webpLoading && jpegLoading && !fallbackUrl}
    />;

  return (
    <CardMedia
      component="img"
      image={webpImage || jpegImage || fallbackUrl}
      alt="Someone kijk'd a cat!"
      height={400}
    />
  );
}
