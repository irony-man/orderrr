import {
  Button,
  FormControl,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  InputLabel,
  FormControlLabel,
  Switch,
  CircularProgress,
  Paper,
  Grid,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "@mui/styles";
import { alertMessage } from "../../../../redux/actions/alertsAction";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";

const useStyles = makeStyles({
  card: {
    position: "relative",
    width: "100%",
    height: "200px",
    letterSpacing: "2px",
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
    justifyContent: "space-between",
    alignItems: "center",
  },
});

const BillingEdit = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [cards, setCards] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [values, setValues] = useState({
    cardNumber: "",
    nameOnCard: "",
    cardName: "",
    id: undefined,
  });

  useEffect(() => {
    axios
      .get("/card")
      .then((response) => {
        setLoading(false);
        setCards(response.data);
      })
      .catch((err) => {
        setLoading(false);
        dispatch(
          alertMessage({
            message: err.response.data.message,
            type: "error",
            open: true,
          })
        );
      });
  }, []);

  const handleValues = (i) => {
    setValues({
      cardNumber: cards[i].cardNumber,
      nameOnCard: cards[i].nameOnCard,
      cardName: cards[i].cardName,
      id: cards[i]._id,
    });
    setDisabled(false);
    setAdding(true);
  };

  const handleChange = (prop) => (event) => {
    if (prop === "cardNumber") {
      if (event.target.value.toString().length > 16) return;
    }
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    if (values.cardNumber.toString().length !== 16) {
      dispatch(
        alertMessage({
          message: "Card number must be of 16 digits.",
          type: "error",
          open: true,
        })
      );
      return;
    }
    setDisabled(true);
    const { cardNumber, nameOnCard, cardName } = values;
    axios
      .post("/card", values)
      .then((response) => {
        setLoading(false);
        setAdding(false);
        if (response.data.id) {
          setCards([
            ...cards,
            { cardNumber, nameOnCard, cardName, _id: response.data.id },
          ]);
          dispatch(
            alertMessage({
              message: response.data.message,
              type: "success",
              open: true,
            })
          );
        } else {
          dispatch(
            alertMessage({
              message: response.data.message,
              type: "error",
              open: true,
            })
          );
        }
      })
      .catch((err) => {
        setLoading(false);
        dispatch(
          alertMessage({
            message: err.response.data.message,
            type: "error",
            open: true,
          })
        );
      });
  };

  const resetValues = () => {
    setAdding(true);
    setDisabled(false);
    setValues({
      cardNumber: "",
      nameOnCard: "",
      cardName: "",
      id: undefined,
    });
  };

  const handleDelete = (id) => {
    axios
      .delete("/card", { data: { id } })
      .then((response) => {
        if (response.data.deleted) {
          setCards(cards.filter((e) => e._id !== id));
        }
        dispatch(
          alertMessage({
            message: response.data.message,
            type: "success",
            open: true,
          })
        );
      })
      .catch((err) =>
        alertMessage({
          message: err.response.data.message,
          type: "error",
          open: true,
        })
      );
  };

  const cardBox = (prop, index) => {
    return (
      <Grid key={index} item sm={6} xs={12}>
        <Box component={Paper} className={classes.card}>
          <Typography variant="h5" className={classes.cardNumber}>
            {prop.cardNumber
              .toString()
              .replace(/(\d{4})/g, "$1 ")
              .replace(/(^\s+|\s+$)/, "") || "•••• •••• •••• ••••"}
          </Typography>
          <Box className={classes.middle} sx={{ bgcolor: "divider" }}>
            <Typography className={classes.middleText} variant="body1" noWrap>
              Card Name: {prop.cardName}
            </Typography>
          </Box>
          <Grid container className={classes.bottom}>
            <Typography variant="body1" noWrap>
              {prop.nameOnCard || "FULL NAME"}
            </Typography>
            <Box>
              <IconButton onClick={() => handleValues(index)}>
                <EditIcon />
              </IconButton>
              <IconButton
                sx={{ ml: 1, color: "red" }}
                onClick={() => handleDelete(prop._id)}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          </Grid>
        </Box>
      </Grid>
    );
  };
  const addButton = () => {
    return (
      <>
        <Grid item sm={6} xs={12}>
          <Box component={Paper} className={classes.card} onClick={resetValues}>
            <Button sx={{ height: "100%" }} fullWidth>
              Add new card
            </Button>
          </Box>
        </Grid>
      </>
    );
  };
  return (
    <>
      <title>Edit Billing | Orderrr</title>
      {!adding && (
        <Typography variant="h4" sx={{ mb: 2 }}>
          Saved cards
        </Typography>
      )}
      {cards.length === 0 && (
        <Typography variant="h5" sx={{ mb: 2 }}>
          No saved cards!!
        </Typography>
      )}
      <Grid container spacing={2}>
        {!adding && addButton()}
        {adding
          ? cardBox(values, 100)
          : cards.map((card, i) => cardBox(card, i))}
      </Grid>
      {adding && (
        <>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              "& .MuiTextField-root": {
                m: "20px 0 0px",
                bgcolor: "background.paper",
              },
              textAlign: "center",
            }}
          >
            <Grid container justifyContent="space-between">
              <TextField
                type="number"
                label="Card Number"
                helperText="Must be of 16 digits, you can put any number."
                value={values.cardNumber > 0 ? values.cardNumber : ""}
                onChange={handleChange("cardNumber")}
                disabled={disabled}
                autoFocus
                fullWidth
                required
              />
            </Grid>
            <Grid container justifyContent="space-between">
              <Grid md={5.9} xs={12} item>
                <TextField
                  type="text"
                  label="Name on Card"
                  value={values.nameOnCard}
                  onChange={handleChange("nameOnCard")}
                  disabled={disabled}
                  fullWidth
                  required
                />
              </Grid>
              <Grid md={5.9} xs={12} item>
                <TextField
                  type="text"
                  label="Name this Card"
                  helperText="You will see this as Card Name"
                  value={values.cardName}
                  onChange={handleChange("cardName")}
                  disabled={disabled}
                  fullWidth
                  required
                />
              </Grid>
            </Grid>
            <Grid container justifyContent="space-between">
              <Grid xs={5.9} item sx={{ mt: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  disabled={disabled}
                >
                  {loading ? "Loading..." : "Submit"}
                </Button>
              </Grid>
              <Grid xs={5.9} item sx={{ margin: "16px 0" }}>
                <Button
                  variant="outlined"
                  size="large"
                  fullWidth
                  disabled={disabled}
                  onClick={() => setAdding(false)}
                >
                  Calcel
                </Button>
              </Grid>
            </Grid>
          </Box>
        </>
      )}
    </>
  );
};

export default BillingEdit;
