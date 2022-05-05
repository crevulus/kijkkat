import { ReactElement } from "react";

import { Box, Icon, Typography } from "@mui/material";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import {
  desktopStyles,
  StyledContainer,
  StyledDesktopCTAContainer,
  StyledDesktopImgPrimary,
  StyledDesktopImgSecondary,
  StyledDesktopQRCode,
} from "./Pages.styles";

export function Desktop(): ReactElement {
  return (
    <StyledContainer>
      <StyledDesktopImgPrimary
        src="/assets/device_screenshot.png"
        alt="Find cats nearby on Kijkkat!"
      />
      <StyledDesktopImgSecondary
        src="/assets/device_screenshot_2.png"
        alt="Find cats nearby on Kijkkat!"
      />
      <StyledDesktopCTAContainer sx={desktopStyles.container} disableGutters>
        <Typography variant="h3">Kijkkat</Typography>
        <Box sx={desktopStyles.imgBox}>
          <StyledDesktopQRCode
            src="/assets/QR_Kijkkat_Desktop.png"
            alt="Scan this QR to view some cats!"
          />
        </Box>
        <Box sx={desktopStyles.ctaBox}>
          <Icon sx={desktopStyles.icon}>
            <PhoneIphoneIcon />
          </Icon>
          <Typography variant="h6">
            Scan this code to see cats nearby!
          </Typography>
        </Box>
      </StyledDesktopCTAContainer>
    </StyledContainer>
  );
}
