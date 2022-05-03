import { primaryColor, secondaryColor } from "../styles/theme";

export const accountStyles = {
  container: { p: 2 },
  box: { paddingY: 2 },
};

export const addStyles = {
  rootContainer: { mt: 2, mb: 2, width: "100%" },
  dialogActions: { justifyContent: "center" },
};

export const homeStyles = {
  container: { p: 2 },
  box: { position: "relative", m: 3 },
  icon: {
    width: "100%",
    height: "100%",
    opacity: 0.1,
    filter: "blur(2px)",
  },
  typography: {
    width: "100%",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    fontWeight: 600,
    background: `-webkit-linear-gradient(45deg, ${primaryColor} 10%, ${secondaryColor} 90%)`,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
};

export const mapStyles = {
  container: { height: "100%" },
};

export const notFoundStyles = {
  grid: { p: 2, alignItems: "center", justifyContent: "center" },
};

export const postsStyles = {
  postsDefault: {
    container: {
      p: 2,
    },
  },
  postsDynamic: {
    container: { p: 2 },
    nsfwContainer: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: "100%",
    },
    card: { maxWidth: "100%" },
    cardActions: { display: "flex", justifyContent: "space-between" },
    box: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      gap: 1,
    },
  },
};
