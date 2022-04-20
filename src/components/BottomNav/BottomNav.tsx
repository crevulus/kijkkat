import React, { ReactElement } from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";

import { BottomNavigation, BottomNavigationAction } from "@mui/material";
import PetsIcon from "@mui/icons-material/Pets";
import FavoriteIcon from "@mui/icons-material/Favorite";
import LocationOnIcon from "@mui/icons-material/LocationOn";

import styles from "./BottomNav.module.css";

import { NavigationRoutes } from "../../data/enums";

function getPageIndex(route: string) {
  switch (route) {
    case NavigationRoutes.Home:
      return 0;
    case NavigationRoutes.Map:
      return 1;
    case NavigationRoutes.Account:
      return 2;
    default:
      return 0;
  }
}

export function BottomNav(): ReactElement {
  const location = useLocation();
  const value = getPageIndex(location.pathname);
  return (
    <BottomNavigation
      showLabels
      value={value}
      onChange={(_, index) => {
        getPageIndex(index);
      }}
      className={styles.bottomNav}
    >
      <BottomNavigationAction
        label="Home"
        icon={<PetsIcon />}
        component={RouterLink}
        to={NavigationRoutes.Home}
      />
      <BottomNavigationAction
        label="Map"
        icon={<LocationOnIcon />}
        component={RouterLink}
        to={NavigationRoutes.Map}
      />
      <BottomNavigationAction
        label="Account"
        icon={<FavoriteIcon />}
        component={RouterLink}
        to={NavigationRoutes.Account}
      />
    </BottomNavigation>
  );
}
