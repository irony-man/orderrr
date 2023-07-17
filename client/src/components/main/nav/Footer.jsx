import React from "react";
import { Grid, Typography } from "@mui/material";

const Footer = () => {
  return (
    <>
      <Grid container justifyContent={"center"} sx={{ m: "20px 0", position: "absolute", bottom: 0 }}>
        <Typography variant="body1" sx={{ color: "text.primary" }}>
          © 2022 Orderrr
        </Typography>
      </Grid>
    </>
  );
};

export default Footer;
