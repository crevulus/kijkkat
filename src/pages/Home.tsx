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
import KijkkatLogo from "../assets/icons/kijkkat-violet.svg";
import { homeStyles } from "./Pages.styles";

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
    <Container maxWidth="sm" sx={homeStyles.container}>
      <Box sx={homeStyles.box}>
        <Icon sx={homeStyles.icon}>
          <img src={KijkkatLogo} alt="Kijkkat Logo" />
        </Icon>
        <Typography variant="h2" sx={homeStyles.typography}>
          Explore the city with cats
        </Typography>
      </Box>
      <Search redirect />
      <PostsGrid q={q} handleLoading={handleLoading} />
    </Container>
  );
}
