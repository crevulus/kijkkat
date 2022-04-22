import { ReactElement } from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";

import { BottomNavigation, BottomNavigationAction } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CameraIcon from "@mui/icons-material/Camera";
import PetsIcon from "@mui/icons-material/Pets";
import FaceIcon from "@mui/icons-material/Face";

import styles from "./BottomNav.module.css";

import { NavigationRoutes, PageNames } from "../../data/enums";

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
      className={styles.bottomNav}
    >
      <BottomNavigationAction
        label={PageNames.Home}
        icon={<HomeIcon />}
        component={RouterLink}
        to={NavigationRoutes.Home}
      />
      <BottomNavigationAction
        label={PageNames.Map}
        icon={<LocationOnIcon />}
        component={RouterLink}
        to={NavigationRoutes.Map}
      />
      <BottomNavigationAction
        label={PageNames.Add}
        icon={<CameraIcon />}
        component={RouterLink}
        to={NavigationRoutes.Add}
      />
      <BottomNavigationAction
        label={PageNames.Posts}
        icon={<PetsIcon />}
        component={RouterLink}
        to={NavigationRoutes.Posts}
      />
      <BottomNavigationAction
        label={PageNames.Account}
        icon={<FaceIcon />}
        component={RouterLink}
        to={NavigationRoutes.Account}
      />
    </BottomNavigation>
  );
}
