import { SyntheticEvent } from "react";
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

type RatingPropsType = {
  ratingValue: number;
  setRatingValue: (value: number) => void;
};

export const RatingPicker = ({
  ratingValue,
  setRatingValue,
}: RatingPropsType) => {
  const handleRate = (_: SyntheticEvent, newValue: number) => {
    const chosenRating = newValue ?? 0;
    setRatingValue(chosenRating);
  };

  return (
    <Box>
      <Typography variant="h6">Cuteness</Typography>
      <StyledRating
        size="large"
        value={ratingValue}
        getLabelText={(value: number) =>
          `${value} Heart${value !== 1 ? "s" : ""}`
        }
        precision={1}
        icon={<FavoriteIcon fontSize="inherit" />}
        emptyIcon={<FavoriteBorderIcon fontSize="inherit" />}
        onChange={(event, value = 0) => handleRate(event, value!)}
      />
    </Box>
  );
};
