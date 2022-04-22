import { useEffect } from "react";
import { getFirestore, collection } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";

import { Container, Typography } from "@mui/material";

import { PostsGrid, Search } from "../components";
import { firebaseApp } from "../firebase";
import { useErrorStore } from "../data/store";

const db = getFirestore(firebaseApp);

export function Home() {
  const setError = useErrorStore((state) => state.setError);
  const [values, loading, loadError] = useCollectionData(
    collection(db, "posts")
  );

  useEffect(() => {
    if (loadError) {
      setError(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadError]);

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Container maxWidth="sm">
      <Typography variant="h3" padding={2}>
        Find a cat nearby
      </Typography>
      <Search />
      {/* @ts-ignore  */}
      <PostsGrid data={values} />
    </Container>
  );
}
