import styled from "@emotion/styled";
import { Container } from "@mui/material";
import { primaryColor, secondaryColor } from "../styles/theme";

export const accountStyles = {
  container: { p: 2 },
  box: { paddingY: 2 },
};

export const addStyles = {
  rootContainer: { mt: 2, mb: 2, width: "100%" },
  dialogActions: { justifyContent: "center" },
};

export const desktopStyles = {
  container: {
    maxWidth: "none !important",
    padding: 2,
    gap: 4,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    backgroundColor: "primary.main",
    color: "white",
  },
  imgBox: { width: 400 },
  ctaBox: { display: "flex", gap: 2 },
  icon: { height: "auto" },
};

export const StyledContainer = styled("div")`
  height: 100%;
  overflow: hidden;
  position: relative;
`;

export const StyledDesktopCTAContainer = styled(Container)`
  @media only screen and (max-width: 1440px) {
    padding-right: 240px;
  }
`;

const StyledDesktopImg = styled("img")`
  position: absolute;
  top: 50%;
  left: 90%;
  transform: translate(-50%, -50%);
  position: absolute;
  max-height: 800px;
  overflow-x: hidden;
`;

export const StyledDesktopImgPrimary = styled(StyledDesktopImg)`
  @media only screen and (min-width: 1440px) {
    left: 80%;
  }
`;

export const StyledDesktopImgSecondary = styled(StyledDesktopImg)`
  display: none;
  @media only screen and (min-width: 1440px) {
    left: 20%;
    display: block;
  }
`;

export const StyledDesktopQRCode = styled("img")`
  max-width: 100%;
  border-radius: 20px;
`;

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
