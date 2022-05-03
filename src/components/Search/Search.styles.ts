import styled from "@emotion/styled";

const styles = {
  box: { color: "text.secondary", mr: 2 },
  autocomplete: { width: "100%" },
};

export const StyledSpan = styled("span")<{ highlighted: boolean }>`
  font-weight: ${(props) => (props.highlighted ? 700 : 400)};
`;

export default styles;
