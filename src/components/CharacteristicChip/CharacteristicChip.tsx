import React, { ReactElement, useState } from "react";

import { Chip, Grid } from "@mui/material";
import CheckCircle from "@mui/icons-material/CheckCircle";

import { TagsType } from "../../data/store";
import { styles } from "./CharacteristicChip.styles";

type CharacteristicChipPropsType = {
  handleTagClick: (tag: TagsType) => void;
  tag: TagsType;
};

export function CharacteristicChip({
  handleTagClick,
  tag,
}: CharacteristicChipPropsType): ReactElement {
  const [selected, setSelected] = useState(false);

  const handleClick = (tag: TagsType) => {
    handleTagClick(tag);
    setSelected(!selected);
  };

  return (
    <Grid item xs={2} sm={4} md={4}>
      <Chip
        sx={styles.chip}
        label={tag.text}
        color={selected ? "primary" : "default"}
        variant="outlined"
        icon={selected ? <CheckCircle /> : undefined}
        onClick={() => handleClick(tag)}
      ></Chip>
    </Grid>
  );
}
