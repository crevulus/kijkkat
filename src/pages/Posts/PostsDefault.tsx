import { useState } from "react";
import {
  query,
  collection,
  orderBy,
  limit,
  getFirestore,
} from "firebase/firestore";

import { Container, Typography } from "@mui/material";

import { FullScreenLoadingSpinner, PostsGrid } from "../../components";
import { postsStyles } from "../Pages.styles";

const db = getFirestore();

export function PostsDefault() {
  const [count, setCount] = useState(1);
  const [loading, setLoading] = useState(false);

  const q = query(
    collection(db, "posts"),
    orderBy("likes", "desc"),
    limit(count * 2)
  );

  const handleLoadMoreImages = () => {
    setCount((count) => count + 1);
  };

  const handleLoading = (loadingPosts: boolean) => {
    setLoading(loadingPosts);
  };

  return loading ? (
    <FullScreenLoadingSpinner loading={loading} />
  ) : (
    <Container maxWidth="sm" sx={postsStyles.postsDefault.container}>
      <Typography variant="h6" color="primary" gutterBottom>
        Posts
      </Typography>
      <PostsGrid
        loadMoreCallback={handleLoadMoreImages}
        q={q}
        handleLoading={handleLoading}
      />
    </Container>
  );
}
