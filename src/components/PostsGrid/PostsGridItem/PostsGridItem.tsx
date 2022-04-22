import React, { ReactElement } from "react";
import { getStorage, ref } from "firebase/storage";
import { useDownloadURL } from "react-firebase-hooks/storage";

import { ImageListItem } from "@mui/material";

import styles from "./PostsGridItem.module.css";

import { firebaseApp } from "../../../firebase";

const storage = getStorage(firebaseApp);

export function PostsGridItem({ item }: any): ReactElement {
  const [value, loading, error] = useDownloadURL(ref(storage, item.imgSource));

  if (error) {
    //@ts-ignore
    return <div>Error: {error}</div>;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <ImageListItem>
      <img
        className={styles.image}
        src={value}
        srcSet={value}
        alt={item.timestamp}
        loading="lazy"
      />
    </ImageListItem>
  );
}
