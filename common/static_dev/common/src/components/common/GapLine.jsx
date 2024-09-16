import { Grid, Typography } from '@mui/material';
import React from 'react';

export default function GapLine({heading, value}) {
  return (
    <Grid container justifyContent={"space-between"} m={"15px 0"}>
      <Typography>{heading}</Typography>
      <Typography>{value}</Typography>
    </Grid>
  );
}
