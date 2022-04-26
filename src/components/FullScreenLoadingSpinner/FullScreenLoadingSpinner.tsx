import { ReactElement } from "react";
import { Backdrop, CircularProgress } from "@mui/material";

type FullScreenLoadingSpinnerPropsType = {
  loading: boolean;
};

export function FullScreenLoadingSpinner({
  loading,
}: FullScreenLoadingSpinnerPropsType): ReactElement {
  return (
    <Backdrop
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={loading}
    >
      <CircularProgress />
    </Backdrop>
  );
}
