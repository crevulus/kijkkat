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

import { Box, Container, Icon, Typography } from "@mui/material";

import { FullScreenLoadingSpinner, PostsGrid, Search } from "../components";
import { firebaseApp } from "../firebase";
import { useErrorStore } from "../data/store";
import KijkkatLogo from "../icons/kijkkat-violet.svg";
import { primaryColor, secondaryColor } from "../styles/theme";

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
    <Container maxWidth="sm" sx={{ p: 2 }}>
      <Box sx={{ position: "relative", m: 3 }}>
        <Icon
          sx={{
            width: "100%",
            height: "100%",
            opacity: 0.1,
            filter: "blur(2px)",
          }}
        >
          <img src={KijkkatLogo} alt="Kijkkat Logo" />
        </Icon>
        <Typography
          variant="h2"
          sx={{
            width: "100%",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            fontWeight: 600,
            background: `-webkit-linear-gradient(45deg, ${primaryColor} 10%, ${secondaryColor} 90%)`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            // filter: "drop-shadow(2px 2px 2px #aaa)",
          }}
        >
          Find a cat nearby
        </Typography>
      </Box>
      <Search redirect />
      <PostsGrid data={docs} />
    </Container>
  );
}
