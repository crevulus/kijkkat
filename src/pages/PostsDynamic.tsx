import { Typography } from "@mui/material";

export function PostsDynamic({ id }: { id: string }) {
  return (
    <>
      <Typography variant="h1" gutterBottom>
        Posts Dynamic
      </Typography>
      {id}
    </>
  );
}
