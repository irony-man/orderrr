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
import {
  addressAction,
  cardAction,
  selectAddress,
  selectCard,
} from "../../../redux/actions/addressCardAction";
import { makeStyles } from "@mui/styles";
import Complete from "./Place Order/Complete";

const useStyles = makeStyles({
  card: {
    position: "relative",
    width: "100%",
    height: "200px",
    letterSpacing: "2px",
    cursor: "pointer",
    marginBottom: "30px",
    border: "1px solid",
    borderRadius: "5px",
  },
  middle: {
    position: "absolute",
    width: "100%",
    top: "80px",
    height: "40px",
  },
  middleText: {
    textAlign: "center",
    margin: "8px 10px 0",
  },
  cardNumber: {
    width: "100%",
    position: "absolute",
    textAlign: "center",
    top: "30px",
  },
  bottom: {
    width: "80%",
    position: "absolute",
    left: "10%",
    bottom: "30px",
    textAlign: "left",
  },
});

const steps = ["Select address", "Select Card", "Complete Order"];

export default function PlaceOrder() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [activeStep, setActiveStep] = useState(0);
  const addresses = useSelector((state) => state.address);
  const cards = useSelector((state) => state.cards);
  const loading = useSelector((state) => state.loading);

  window.addEventListener("beforeunload", (e) => {
    e.preventDefault();
    e.returnValue = "";
  });

  useEffect(() => {
    dispatch(addressAction());
    dispatch(cardAction());
  }, []);

  const handleAddressClick = (id) => {
    setActiveStep(activeStep + 1);
    dispatch(selectAddress(id));
  };
  const handleCardClick = (id) => {
    setActiveStep(activeStep + 1);
    dispatch(selectCard(id));
  };

  const AddressPage = (
    <>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Saved Addresses!!
      </Typography>
      <List>
        {addresses.all.map((address) => (
          <ListItem disablePadding key={address._id}>
            <ListItemButton
              onClick={() => handleAddressClick(address._id)}
              sx={{ p: 2 }}
            >
              <ListItemText
                primary={
                  <Typography variant="body1">
                    <b>Pin Code: </b>
                    {address.pincode}
                  </Typography>
                }
                secondary={
                  <Typography variant="body2">
                    <b>Full Address: </b>
                    {address.fullAddress}
                  </Typography>
                }
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </>
  );

  const CardPage = (
    <>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Saved Cards!!
      </Typography>
      {cards.all.map((card) => (
        <>
          <Box
            className={classes.card}
            key={card._id}
            sx={{ bgcolor: "background.default" }}
          >
            <Box
              component={Button}
              onClick={() => handleCardClick(card._id)}
              sx={{ width: "100%", height: "100%" }}
            >
              <Typography variant="h5" className={classes.cardNumber}>
                {"•••• •••• •••• " + card.cardNumber.toString().substr(12)}
              </Typography>
              <Box className={classes.middle} sx={{ bgcolor: "divider" }}>
                <Typography
                  className={classes.middleText}
                  variant="body1"
                  noWrap
                >
                  Card Name: {card.cardName}
                </Typography>
              </Box>
              <Typography variant="body1" noWrap className={classes.bottom}>
                {card.nameOnCard || "FULL NAME"}
              </Typography>
            </Box>
          </Box>
        </>
      ))}
      <Divider />
    </>
  );

  const page = [AddressPage, CardPage, <Complete />];
  return (
    <>
      <title>Place Order | Orderrr</title>
      {loading ? (
        <Box sx={{ mt: 3, textAlign: "center" }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box sx={{ margin: "20px 5vw 0" }}>
          <Stepper activeStep={activeStep}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <Box
            sx={{
              m: "25px auto 0",
              p: "30px",
              borderRadius: "5px",
              color: "text.primary",
              bgcolor: "background.paper",
              maxWidth: "500px",
              border: "1px solid",
            }}
          >
            {activeStep === steps.length ? (
              <>
                <Typography variant="h5">Thank you for your order.</Typography>
                <Typography variant="body1" sx={{ my: 2 }}>
                  Your order is complete. We have recieved your order
                  confirmation, and will send you an update when your order has
                  shipped.
                </Typography>
                <Button variant="contained">Download Receipt</Button>
              </>
            ) : (
              <>
                {page[activeStep]}
                <Box sx={{ mt: 2 }}>
                  <Grid container justifyContent={"space-between"}>
                    {activeStep !== 0 && (
                      <Button
                        variant="outlined"
                        onClick={() => setActiveStep(activeStep - 1)}
                      >
                        Back
                      </Button>
                    )}
                    {activeStep === 2 && (
                      <Button
                        variant="contained"
                        onClick={() => setActiveStep(activeStep + 1)}
                      >
                        Complete Payment
                      </Button>
                    )}
                  </Grid>
                </Box>
              </>
            )}
          </Box>
        </Box>
      )}
    </>
  );
}
