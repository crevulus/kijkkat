import { ReactElement } from "react";

import { Box, Container, Icon, Typography } from "@mui/material";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import { desktopStyles, StyledDesktopImg } from "./Pages.styles";

export function Desktop(): ReactElement {
  return (
    <Container sx={desktopStyles.container}>
      <Typography variant="h3">Kijkkat</Typography>
      <Box sx={desktopStyles.imgBox}>
        <StyledDesktopImg
          src="/assets/QR_Kijkkat_Desktop.png"
          alt="Scan this QR to view some cats!"
          style={{}}
        />
      </Box>
      <Box sx={desktopStyles.ctaBox}>
        <Icon sx={desktopStyles.icon}>
          <PhoneIphoneIcon />
        </Icon>
        <Typography variant="h6">
          Scan this code to see cats on your phone!
        </Typography>
      </Box>
    </Container>
  );
}
