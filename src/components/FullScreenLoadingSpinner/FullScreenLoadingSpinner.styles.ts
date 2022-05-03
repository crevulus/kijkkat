import { Theme } from "@mui/material";

const styles = {
  backdrop: {
    zIndex: (theme: Theme) => theme.zIndex.drawer + 1,
  },
};

export default styles;
