import { Box, Typography } from "@mui/material";
import React from "react";

const NotFound = (prop) => {
  return (
    <>
      <title>Not found | Orderrr</title>
      <Box sx={{ textAlign: "center", color: "text.primary" }}>
        <Typography variant="h1">404</Typography>
        <Typography variant="h5">{prop.type || "Page"} not found</Typography>
      </Box>
    </>
  );
};

export default NotFound;
