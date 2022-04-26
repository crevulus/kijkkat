import { useEffect, useState } from "react";
import {
  query,
  collection,
  orderBy,
  limit,
  getFirestore,
} from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";

import { Button, Container } from "@mui/material";

import { FullScreenLoadingSpinner, PostsGrid } from "../../components";
import { useErrorStore } from "../../data/store";
import { DocsType } from "../Home";

const db = getFirestore();

export function PostsDefault() {
  const setError = useErrorStore((state) => state.setError);
  const [count, setCount] = useState(1);
  const [result, loading, loadError] = useCollection(
    query(collection(db, "posts"), orderBy("likes", "desc"), limit(count * 2))
  );
  const [docs, setDocs] = useState<DocsType[]>([]);

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

  const handleLoadMoreImages = () => {
    setCount((count) => count + 1);
  };

  if (loading) <FullScreenLoadingSpinner loading={loading} />;

  return (
    <Container maxWidth="sm">
      <PostsGrid data={docs} />
      <Button onClick={handleLoadMoreImages}>Load more</Button>
    </Container>
  );
}
