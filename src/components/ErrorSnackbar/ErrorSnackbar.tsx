import { ReactElement } from "react";

import { Snackbar, Alert } from "@mui/material";

import { useErrorStore } from "../../data/store";

export function ErrorSnackbar(): ReactElement {
  const error = useErrorStore((state) => state.error);
  const setError = useErrorStore((state) => state.setError);
  const errorMessage = useErrorStore((state) => state.errorMessage);

  const handleClose = () => {
    setError(false);
  };

  return (
    <Snackbar open={error} autoHideDuration={6000} message={errorMessage}>
      <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
        {errorMessage}
      </Alert>
    </Snackbar>
  );
}