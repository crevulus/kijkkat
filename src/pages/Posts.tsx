import { useParams } from "react-router-dom";

import { Typography } from "@mui/material";

import { PostsDynamic } from "./PostsDynamic";

export function Posts() {
  const { id } = useParams();

  if (id) {
    return <PostsDynamic id={id} />;
  }

  return (
    <>
      <Typography variant="h1" gutterBottom>
        Posts
      </Typography>
      {id ?? "No id"}
    </>
  );
}
