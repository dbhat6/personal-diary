import { Typography } from "@mui/material";
import { Box } from "@mui/system";

const AboutPage = () => (
  <Box sx={{ width: "100%", maxWidth: 5000 }}>
    <Typography variant="h2" gutterBottom component="div" sx={{ mx: 15 }}>
      Made by yours truly
    </Typography>
    <Typography variant="h3" gutterBottom component="div" sx={{ mx: 25 }}>
      Deepak Bhat
    </Typography>
  </Box>
);

export default AboutPage;
