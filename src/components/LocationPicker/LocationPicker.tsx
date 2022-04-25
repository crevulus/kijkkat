import React, { ReactElement } from "react";
import { Button, Card, CardContent, Stack, Typography } from "@mui/material";

import LocationOn from "@mui/icons-material/LocationOn";
import Search from "@mui/icons-material/Search";

import { Search as SearchBox } from "../index";

type LocationPickerPropsType = {
  handleSetPreferences: (preferences: any) => void;
  checkedCurrentLocation: boolean;
  handleGetLocation: () => void;
  wantsCurrentLocation: boolean;
  currentAddress: string;
};

export function LocationPicker({
  handleSetPreferences,
  checkedCurrentLocation,
  handleGetLocation,
  wantsCurrentLocation,
  currentAddress,
}: LocationPickerPropsType): ReactElement {
  return (
    <Card sx={{ p: 2 }}>
      {!checkedCurrentLocation && (
        <>
          <Typography variant="body1" padding={2}>
            Would you like to use your current location?
          </Typography>
          <Stack direction="row" spacing={2} justifyContent="center">
            <Button startIcon={<LocationOn />} onClick={handleGetLocation}>
              Find me
            </Button>
            <Button
              endIcon={<Search />}
              onClick={() => {
                handleSetPreferences({
                  wantsCurrentLocation: false,
                  checkedCurrentLocation: true,
                });
              }}
            >
              Search
            </Button>
          </Stack>
        </>
      )}
      {checkedCurrentLocation && wantsCurrentLocation && currentAddress && (
        <CardContent>
          <LocationOn color="primary" />
          <Typography variant="body2">{currentAddress}</Typography>
        </CardContent>
      )}
      {checkedCurrentLocation && !wantsCurrentLocation && !currentAddress && (
        <SearchBox redirect={false} />
      )}
    </Card>
  );
}
