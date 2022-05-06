import React, { ReactElement, useEffect, useState } from "react";

import {
  Button,
  CircularProgress,
  Container,
  ImageList,
  Typography,
} from "@mui/material";

import PostsGridItem from "./PostsGridItem";
import { DocsType } from "../../pages/Home";
import { useErrorStore } from "../../data/store";
import { useCollection } from "react-firebase-hooks/firestore";
import styles from "./PostsGrid.styles";

type PostsGridPropsType = {
  q: any;
  loadMoreCallback?: () => void;
};

export function PostsGrid({
  q,
  loadMoreCallback,
}: PostsGridPropsType): ReactElement {
  const setError = useErrorStore((state) => state.setError);
  const [disableLoadMore, setDisableLoadMore] = useState(false);
  const [docsLength, setDocsLength] = useState<number>(0);
  const [docs, setDocs] = useState<DocsType[]>([]);
  const [loadMore, setLoadMore] = useState(false);

  const [result, loading, loadError] = useCollection(q);

  useEffect(() => {
    // only applicable to posts grids with a load more button
    if (loadMoreCallback && docs && docsLength && docs.length === docsLength) {
      setError(true, "No more posts to load!");
      setDisableLoadMore(true);
    } else {
      setDocsLength(docs.length);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [docs]);

  useEffect(() => {
    if (result) {
      const docs = result.docs.map((doc) => ({ data: doc.data(), id: doc.id }));
      setDocs(docs);
    }
  }, [result]);

  useEffect(() => {
    if (loadError) {
      setError(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadError]);

  const handleLoadMore = () => {
    if (loadMoreCallback) {
      setLoadMore(true);
      loadMoreCallback();
      setLoadMore(loading);
    }
  };

  return (
    <>
      <ImageList sx={styles.imageList} cols={3} rowHeight="auto">
        {docs.map((item) => (
          <PostsGridItem key={item.id} item={item} />
        ))}
      </ImageList>
      {(loading || loadMore) && (
        <Container sx={styles.container}>
          <CircularProgress color="secondary" />
          <Typography variant="h6" color="primary">
            Fetching some cat pictures for you...
          </Typography>
        </Container>
      )}
      {loadMoreCallback && (
        <Button
          variant="contained"
          onClick={handleLoadMore}
          disabled={disableLoadMore}
        >
          Load More
        </Button>
      )}
    </>
  );
}
