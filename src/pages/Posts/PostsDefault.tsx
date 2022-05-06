import { useState } from "react";
import {
  query,
  collection,
  orderBy,
  limit,
  getFirestore,
} from "firebase/firestore";

import { Container, Typography } from "@mui/material";

import { PostsGrid } from "../../components";
import { postsStyles } from "../Pages.styles";

const db = getFirestore();

export function PostsDefault() {
  const [count, setCount] = useState(1);

  const q = query(
    collection(db, "posts"),
    orderBy("likes", "desc"),
    limit(count * 12)
  );

  const handleLoadMoreImages = () => {
    setCount((count) => count + 1);
  };

  return (
    <Container maxWidth="sm" sx={postsStyles.postsDefault.container}>
      <Typography variant="h6" color="primary" gutterBottom>
        Posts
      </Typography>
      <PostsGrid loadMoreCallback={handleLoadMoreImages} q={q} />
    </Container>
  );
}
