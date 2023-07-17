import React, { useState, useEffect } from "react";
import {
  Box,
  Stepper,
  Paper,
  Step,
  StepLabel,
  Button,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  Divider,
  ListItemButton,
  ListItemText,
  Grid,
  Avatar,
  CircularProgress,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "@mui/styles";

const Complete = () => {
  const addresses = useSelector((state) => state.address);
  const user = useSelector((state) => state.user);
  const cards = useSelector((state) => state.cards);
  const loading = useSelector((state) => state.loading);
  const sum = user.cart.reduce((a, b) => {
    return a + b.price;
  }, 0);
  const price = sum < 500 ? sum + 40 : sum;
  return (
    <>
      <Typography variant="h5" sx={{ mb: 1 }}>
        Orederrr Details!!
      </Typography>
      <Divider />
      <Typography variant="body1" sx={{ mt: 2 }}>
        Product Details
      </Typography>
      <List sx={{ width: "100%", bgcolor: "background.paper" }}>
        {user.cart.map((design) => (
          <>
            <ListItem key={design._id} sx={{ mb: 1, color: "text.secondary" }}>
              <ListItemAvatar>
                <Avatar
                  src={design.image.thumb}
                  sx={{ width: 30, height: 30 }}
                />
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Grid container justifyContent="space-between">
                    <Typography noWrap>{design.title}</Typography>
                    <Typography noWrap>₹{design.price}</Typography>
                  </Grid>
                }
              />
            </ListItem>
          </>
        ))}
        <ListItem sx={{ mb: 1 }}>
          <ListItemText
            primary={
              <Grid container justifyContent="space-between">
                <Typography noWrap>Shipping</Typography>
                <Typography noWrap>{price===sum?<span style={{color: "green"}}>FREE</span>:"₹40"}</Typography>
              </Grid>
            }
          />
        </ListItem>
        <ListItem sx={{ mb: 1 }}>
          <ListItemText
            primary={
              <Grid container justifyContent="space-between">
                <Typography variant="h6" noWrap>Total</Typography>
                <Typography variant="h6" noWrap>₹{price}</Typography>
              </Grid>
            }
          />
        </ListItem>
      </List>
      <Divider />
      <Box sx={{ my: 2 }}>
        <Typography variant="body1">Address Details</Typography>
        <Box sx={{ ml: 2, mt: 1, color: "text.secondary" }}>
          <Typography variant="body2">
            Full Address: {addresses.selected[0].fullAddress}
          </Typography>
          <Typography variant="body2">
            Pincode: {addresses.selected[0].pincode}
          </Typography>
        </Box>
      </Box>
      <Divider />
      <Box sx={{ my: 2 }}>
        <Typography variant="body1">Payment Details</Typography>
        <Box sx={{ ml: 2, mt: 1, color: "text.secondary" }}>
          <Typography variant="body2">
            Card Name: {cards.selected[0].cardName}
          </Typography>
          <Typography variant="body2">
            card Number: {"•••• •••• •••• " + cards.selected[0].cardNumber.toString().substr(12)}
          </Typography>
        </Box>
      </Box>
      <Divider />
    </>
  );
};

export default Complete;
