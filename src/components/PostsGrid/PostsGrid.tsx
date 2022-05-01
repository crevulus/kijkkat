import React, { ReactElement, useEffect, useState } from "react";

import { Button, ImageList } from "@mui/material";

import PostsGridItem from "./PostsGridItem";
import { DocsType } from "../../pages/Home";
import { useErrorStore } from "../../data/store";
import { useCollection } from "react-firebase-hooks/firestore";

type PostsGridPropsType = {
  q: any;
  handleLoading: (loading: boolean) => void;
  loadMoreCallback?: () => void;
};

export function PostsGrid({
  q,
  handleLoading,
  loadMoreCallback,
}: PostsGridPropsType): ReactElement {
  const setError = useErrorStore((state) => state.setError);
  const setErrorMessage = useErrorStore((state) => state.setErrorMessage);
  const [disableLoadMore, setDisableLoadMore] = useState(false);
  const [docsLength, setDocsLength] = useState<number>(0);
  const [docs, setDocs] = useState<DocsType[]>([]);

  const [result, loading, loadError] = useCollection(q);

  useEffect(() => {
    if (docs && docsLength && docs.length === docsLength) {
      setError(true);
      setErrorMessage("No more posts to load!");
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
      handleLoading(true);
      loadMoreCallback();
      handleLoading(loading);
    }
  };

  return (
    <>
      <ImageList sx={{ width: "100%" }} cols={3} rowHeight="auto">
        {docs.map((item) => (
          <PostsGridItem key={item.id} item={item} />
        ))}
      </ImageList>
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
