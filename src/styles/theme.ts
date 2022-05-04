import { createTheme } from "@mui/material";

export const primaryColor = "#00bcd4";

export const secondaryColor = "#BA9FE3";

declare module "@mui/material/Button" {
  interface ButtonPropsVariantOverrides {
    ["white-outlined"]: true;
  }
}

const themeBase = {
  palette: {
    primary: {
      main: primaryColor,
    },
    secondary: {
      main: secondaryColor,
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
  ...themeBase,
  palette: {
    ...themeBase.palette,
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
      variants: [
        {
          props: { variant: "white-outlined" },
          style: {
            ...themeBase.components.MuiButton.styleOverrides.root,
            color: "white",
            border: "1px solid white",
          },
        },
      ],
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

// theme: https://coolors.co/00bcd4-ba9fe3-99f7ab-abdf75-60695c
