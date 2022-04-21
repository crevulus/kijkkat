import { getFirestore, collection } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";

import { Container, Typography } from "@mui/material";

import { PostsGrid, Search } from "../components";
import { firebaseApp } from "../firebase";

const db = getFirestore(firebaseApp);

export default function Home() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [values, loading, error] = useCollectionData(collection(db, "posts"));

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography>Error: {error}</Typography>;
  }

  return (
    <Container sx={{ p: 2 }}>
      <Typography variant="h3" padding={2}>
        Find a cat nearby
      </Typography>
      <div>This is a test</div>
      <Search />
      {/* @ts-ignore  */}
      <PostsGrid data={values} />
    </Container>
  );
}
