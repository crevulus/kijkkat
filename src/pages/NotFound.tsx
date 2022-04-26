import { Grid, Typography } from "@mui/material";

export function NotFound() {
  return (
    <Grid
      container
      spacing={0}
      direction="column"
      height={1}
      sx={{ p: 2, alignItems: "center", justifyContent: "center" }}
    >
      <Grid item>
        <Typography variant="h6" color="primary">
          I'm not sure what you're looking for, but it ain't here.
        </Typography>
      </Grid>
    </Grid>
  );
}
