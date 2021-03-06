import { ReactElement } from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";

import { BottomNavigation, BottomNavigationAction } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import PetsIcon from "@mui/icons-material/Pets";
import FaceIcon from "@mui/icons-material/Face";

import { NavigationRoutes, PageNames } from "../../data/enums";
import styles from "./BottomNav.styles";

const CustomisedBottomNavigationAction = (props: any) => (
  <BottomNavigationAction sx={styles.bottomNavigationAction} {...props} />
);

const pagesArray = Object.keys(PageNames);

const getPageIndex = (route: string): number => {
  if (route === NavigationRoutes.Home) {
    return 0;
  }
  return pagesArray.findIndex((pageName) =>
    route.toLowerCase().includes(pageName.toLowerCase())
  );
};

export function BottomNav(): ReactElement {
  const location = useLocation();
  const value = getPageIndex(location.pathname);

  return (
    <BottomNavigation
      value={value}
      onChange={(_, index) => {
        getPageIndex(index);
      }}
      sx={styles.bottomNavigation}
    >
      <CustomisedBottomNavigationAction
        label={PageNames.Home}
        icon={<HomeIcon />}
        component={RouterLink}
        to={NavigationRoutes.Home}
      />
      <CustomisedBottomNavigationAction
        label={PageNames.Map}
        icon={<LocationOnIcon />}
        component={RouterLink}
        to={NavigationRoutes.Map}
      />
      <CustomisedBottomNavigationAction
        label={PageNames.Add}
        icon={<AddCircleOutlineIcon />}
        component={RouterLink}
        to={NavigationRoutes.Add}
      />
      <CustomisedBottomNavigationAction
        label={PageNames.Posts}
        icon={<PetsIcon />}
        component={RouterLink}
        to={NavigationRoutes.Posts}
      />
      <CustomisedBottomNavigationAction
        label={PageNames.Account}
        icon={<FaceIcon />}
        component={RouterLink}
        to={NavigationRoutes.Account}
      />
    </BottomNavigation>
  );
}
