import {
  Button,
  Box,
  TextField,
  Typography,
  IconButton,
  CircularProgress,
  Grid,
} from "@mui/material";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { alertMessage } from "../../../../redux/actions/alertsAction";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const AddressEdit = () => {
  const dispatch = useDispatch();

  const [address, setAddress] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [values, setValues] = useState({
    pincode: 0,
    fullAddress: "",
    id: undefined,
  });

  useEffect(() => {
    axios
      .get("/address")
      .then((response) => {
        setLoading(false);
        setAddress(response.data);
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
  

  const handleChange = (prop) => (event) => {
    if (prop === "pincode") {
      if (event.target.value.toString().length > 6) return;
    }
    setValues({...values, [prop]: event.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    if (values.pincode.toString().length !== 6) {
      dispatch(
        alertMessage({
          message: "Pincode must be of 6 digits.",
          type: "error",
          open: true,
        })
      );
      return;
    }
    setDisabled(true);
    const { pincode, fullAddress } = values;
    axios
      .post("/address", values)
      .then((response) => {
        setLoading(false);
        setAdding(false);
        if (response.data.id) {
          setAddress([
            ...address,
            { pincode, fullAddress, _id: response.data.id },
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
  const handleValues = (i) => {
    setValues({
      pincode: address[i].pincode,
      fullAddress: address[i].fullAddress,
      id: address[i]._id,
    });
    setDisabled(false);
    setAdding(true);
  };

  const resetValues = () => {
    setAdding(true);
    setDisabled(false);
    setValues({
      pincode: 0,
      fullAddress: "",
      id: undefined,
    });
  };

  const handleDelete = (id) => {
    axios
      .delete("/address", { data: { id } })
      .then((response) => {
        if (response.data.deleted) {
          setAddress(address.filter((e) => e._id !== id));
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
  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition, showError);
    }
  };

  function showPosition(position) {
    console.log(position.coords);
    axios
      .get(
        `http://api.positionstack.com/v1/reverse?access_key=bcfd487ad2a8b2e356dbd275c88bb925&query=${position.coords.latitude},${position.coords.longitude}`
      )
      .then((response) => {
        const { data } = response.data;
        if (!data[0].postal_code) {
          dispatch(
            alertMessage({
              message: "Couldn't fetch Pin Code, fill it manually!!",
              type: "error",
              open: true,
            })
          );
        }
        setValues({
          ...address,
          pincode: data[0].postal_code,
          fullAddress: `${data[0].name ? data[0].name + ", " : ""}${
            data[0].street ? data[0].street + ", " : ""
          }${data[0].county ? data[0].county + ", " : ""}${
            data[0].region ? data[0].region : ""
          }`,
        });
      });
  }

  function showError(error) {
    dispatch(
      alertMessage({ message: error.message, type: "error", open: true })
    );
  }
  const AddressForm = () => {
    return (
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
        autoComplete="off"
      >
        <Button
          onClick={getLocation}
          fullWidth
          variant="contained"
          size="large"
          disabled={disabled}
        >
          <MyLocationIcon sx={{ mr: 1 }} />
          Get current location!!
        </Button>
        <TextField
          type="number"
          label="Pin Code"
          helperText="Must be of 6 digits, you can put any number."
          value={values.pincode > 0 ? values.pincode : ""}
          onChange={handleChange("pincode")}
          disabled={disabled}
          autoFocus
          fullWidth
          required
        />
        <TextField
          type="text"
          label="Full Address"
          value={values.fullAddress}
          onChange={handleChange("fullAddress")}
          disabled={disabled}
          fullWidth
          required
        />
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
    );
  };

  return (
    <>
      <title>Edit Address | Orderrr</title>
      {adding ? (
        AddressForm()
      ) : (
        <>
          <Button
            onClick={resetValues}
            variant="contained"
            fullWidth
            sx={{ mb: 3 }}
            size="large"
          >
            Add new address
          </Button>
          {loading ? (
            <Box textAlign="center">
              <CircularProgress />
            </Box>
          ) : (
            address.length===0?
              (<Typography variant="h5" textAlign='center'>No saved addresses!!</Typography>)
              :
              (address.map((add, index) => (
                <Box sx={{ border: "1px solid", mt: 1, p: 2 }} key={index}>
                  <Typography variant="h6">Pincode: {add.pincode}</Typography>
                  <Typography variant="body">
                  Full Address: {add.fullAddress}
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    <IconButton onClick={() => handleValues(index)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      sx={{ ml: 1, color: "red" }}
                      onClick={() => handleDelete(add._id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
              )))
          )}
        </>
      )}
    </>
  );
};

export default AddressEdit;
