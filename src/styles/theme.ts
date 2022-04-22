import { createTheme } from "@mui/material";

export const primaryColor = "#00bcd4";

export const secondaryColor = "#BA9FE3";

const themeBase = {
  palette: {
    primary: {
      main: secondaryColor,
    },
    secondary: {
      main: primaryColor,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          border: 0,
          borderRadius: 3,
          color: "white",
          height: 48,
          padding: "0 30px",
        },
      },
    },
  },
};

export const light = createTheme({
  palette: {
    primary: {
      main: primaryColor,
    },
    secondary: {
      main: secondaryColor,
    },
    mode: "light",
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          ...themeBase.components.MuiButton.styleOverrides.root,
          background: `linear-gradient(45deg, ${primaryColor} 10%, ${secondaryColor} 90%)`,
        },
      },
    },
  },
});

export const dark = createTheme({
  palette: {
    primary: {
      main: secondaryColor,
    },
    secondary: {
      main: primaryColor,
    },
    mode: "dark",
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          ...themeBase.components.MuiButton.styleOverrides.root,
          background: `linear-gradient(45deg, ${secondaryColor} 10%, ${primaryColor} 90%)`,
        },
      },
    },
  },
});
