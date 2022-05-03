import styled from "@emotion/styled";

const styles = {
  imageListItem: { alignItems: "center", justifyContent: "center" },
  nsfwContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
};

export const StyledImage = styled.img`
  aspect-ratio: 1;
  object-fit: cover;
  width: 100%;
  height: auto;
  -webkit-box-flex: 1;
  -webkit-flex-grow: 1;
  -ms-flex-positive: 1;
  flex-grow: 1;
`;

export default styles;
