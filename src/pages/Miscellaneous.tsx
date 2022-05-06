import {
  Container,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { miscellaneousStyles } from "./Pages.styles";

export function Miscellaneous() {
  return (
    <Container sx={miscellaneousStyles.container}>
      <Typography variant="h6" color="primary" gutterBottom>
        Attributions
      </Typography>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>Device Mockup</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography align="left">
            Device Mockup created from{" "}
            <a href="https://deviceframes.com/templates/iphone-13">
              iPhone mockups
            </a>
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Typography
        variant="h6"
        color="primary"
        gutterBottom
        sx={miscellaneousStyles.header}
      >
        Privacy Notice
      </Typography>
    </Container>
  );
}
