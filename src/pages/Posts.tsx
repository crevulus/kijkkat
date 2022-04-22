import { Typography } from "@mui/material";
import { useParams } from "react-router-dom";

export default function Posts() {
  const { id } = useParams();

  return (
    <>
      <Typography variant="h1" gutterBottom>
        Posts
      </Typography>
      {id ?? "No id"}
    </>
  );
}
