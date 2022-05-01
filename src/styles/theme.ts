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
          borderRadius: 20,
          height: 40,
          padding: "0 30px",
        },
      },
    },
  },
  typography: {
    fontFamily: "Poppins, sans-serif;",
  },
};

export const light = createTheme({
  typography: {
    fontFamily: "Poppins, sans-serif;",
  },
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
    MuiPaper: {
      styleOverrides: {
        root: {
          elevation: 3,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          "&.MuiButton-outlined": {
            ...themeBase.components.MuiButton.styleOverrides.root,
          },
          "&.MuiButton-contained": {
            ...themeBase.components.MuiButton.styleOverrides.root,
            color: "white",
            border: 0,
            background: `linear-gradient(45deg, ${primaryColor} 10%, ${secondaryColor} 90%)`,
          },
          "&.Mui-disabled": {
            background: "#f5f5f5",
            color: "#bdbdbd",
          },
        },
      },
    },
  },
});

export const dark = createTheme({
  typography: {
    fontFamily: "Poppins, sans-serif;",
  },
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

// theme: https://coolors.co/00bcd4-ba9fe3-99f7ab-abdf75-60695c
