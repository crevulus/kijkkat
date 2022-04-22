import { SyntheticEvent, useState } from "react";
import { styled } from "@mui/material/styles";

import { Rating, Box, Typography } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

import { primaryColor } from "../../styles/theme";

const StyledRating = styled(Rating)({
  "& .MuiRating-iconFilled": {
    color: primaryColor,
  },
});

export const RatingPicker = () => {
  const [rating, setRating] = useState(0);

  const handleRate = (_: SyntheticEvent, newValue: number | null) => {
    const chosenRating = newValue ?? 0;
    setRating(chosenRating);
  };

  return (
    <Box>
      <Typography component="legend">Cuteness</Typography>
      <StyledRating
        size="large"
        value={rating}
        getLabelText={(value: number) =>
          `${value} Heart${value !== 1 ? "s" : ""}`
        }
        precision={1}
        icon={<FavoriteIcon fontSize="inherit" />}
        emptyIcon={<FavoriteBorderIcon fontSize="inherit" />}
        onChange={(event, value) => handleRate(event, value)}
      />
    </Box>
  );
};
