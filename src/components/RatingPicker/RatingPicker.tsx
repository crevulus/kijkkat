import { SyntheticEvent } from "react";
import { styled } from "@mui/material/styles";

import { Rating, Box, Typography } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

import { primaryColor } from "../../styles/theme";

export const StyledRating = styled(Rating)({
  "& .MuiRating-iconFilled": {
    color: primaryColor,
  },
});

type RatingPropsType = {
  title: string;
  ratingValue: number;
  handleRatingValue?: (arg: string, value: number) => void;
  readOnly?: boolean;
};

export const RatingPicker = ({
  title,
  ratingValue,
  handleRatingValue,
  readOnly,
}: RatingPropsType) => {
  const handleRate = (_: SyntheticEvent, newValue: number) => {
    const chosenRating = newValue ?? 0;
    if (handleRatingValue) {
      handleRatingValue(title, chosenRating);
    }
  };

  return (
    <Box padding={1}>
      <Typography variant="h6">{title}</Typography>
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
        readOnly={readOnly}
      />
    </Box>
  );
};
