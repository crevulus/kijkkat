import { useEffect, useState } from "react";
import {
  getFirestore,
  collection,
  DocumentData,
  query,
  orderBy,
  limit,
} from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";

import { Container, Typography } from "@mui/material";

import { FullScreenLoadingSpinner, PostsGrid, Search } from "../components";
import { firebaseApp } from "../firebase";
import { useErrorStore } from "../data/store";

const db = getFirestore(firebaseApp);

export interface DocsType {
  data: DocumentData;
  id: string;
}

export function Home() {
  const setError = useErrorStore((state) => state.setError);
  const [result, loading, loadError] = useCollection(
    query(collection(db, "posts"), orderBy("time", "desc"), limit(12))
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

  if (loading) {
    return <FullScreenLoadingSpinner loading={loading} />;
  }

  return (
    <Container maxWidth="sm">
      <Typography variant="h3" padding={2}>
        Find a cat nearby
      </Typography>
      <Search redirect />
      <PostsGrid data={docs} />
    </Container>
  );
}
