import { ReactElement } from "react";
import { Backdrop, CircularProgress } from "@mui/material";
import styles from "./FullScreenLoadingSpinner.styles";

type FullScreenLoadingSpinnerPropsType = {
  loading: boolean;
};

export function FullScreenLoadingSpinner({
  loading,
}: FullScreenLoadingSpinnerPropsType): ReactElement {
  return (
    <Backdrop sx={styles.backdrop} open={loading}>
      <CircularProgress color="secondary" />
    </Backdrop>
  );
}
