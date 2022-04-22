import React, { ReactElement, useState } from "react";

import { Chip, Grid } from "@mui/material";
import CheckCircle from "@mui/icons-material/CheckCircle";

import { CharacteristicsTagsType } from "../CreatePost/CreatePost";

type CharacteristicChipPropsType = {
  handleTagClick: (tag: CharacteristicsTagsType) => void;
  tag: CharacteristicsTagsType;
};

export function CharacteristicChip({
  handleTagClick,
  tag,
}: CharacteristicChipPropsType): ReactElement {
  const [selected, setSelected] = useState(false);

  const handleClick = (tag: CharacteristicsTagsType) => {
    handleTagClick(tag);
    setSelected(!selected);
  };

  return (
    <Grid item xs={2} sm={4} md={4}>
      <Chip
        sx={{ width: "100%" }}
        label={tag.text}
        color={selected ? "primary" : "default"}
        variant="outlined"
        icon={selected ? <CheckCircle /> : undefined}
        onClick={() => handleClick(tag)}
      ></Chip>
    </Grid>
  );
}
