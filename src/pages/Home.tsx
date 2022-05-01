import { useState } from "react";
import {
  getFirestore,
  collection,
  DocumentData,
  query,
  orderBy,
  limit,
} from "firebase/firestore";

import { Box, Container, Icon, Typography } from "@mui/material";

import { FullScreenLoadingSpinner, PostsGrid, Search } from "../components";
import { firebaseApp } from "../firebase";
import KijkkatLogo from "../icons/kijkkat-violet.svg";
import { primaryColor, secondaryColor } from "../styles/theme";

const db = getFirestore(firebaseApp);

export interface DocsType {
  data: DocumentData;
  id: string;
}

export function Home() {
  const [loading, setLoading] = useState(false);

  const q = query(collection(db, "posts"), orderBy("time", "desc"), limit(12));

  const handleLoading = (loadingPosts: boolean) => {
    setLoading(loadingPosts);
  };

  return loading ? (
    <FullScreenLoadingSpinner loading={loading} />
  ) : (
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
          }}
        >
          Find a cat nearby
        </Typography>
      </Box>
      <Search redirect />
      <PostsGrid q={q} handleLoading={handleLoading} />
    </Container>
  );
}
