import PatternsIcon from "../../assets/icons/kijkkat-patterns.svg";

const styles = {
  card: {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    p: 2,
    backgroundColor: "transparent",
  },
  patternContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    backgroundImage: `url(${PatternsIcon})`,
    width: "100%",
    height: "100%",
    opacity: 0.2,
    filter: "blur(2px)",
  },
  button: {
    mt: 2,
    backgroundColor: "white",
  },
};

export default styles;
