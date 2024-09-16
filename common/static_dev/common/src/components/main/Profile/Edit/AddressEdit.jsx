import {
  TextField,
  IconButton,
  Grid,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { alertMessage } from "../../../../redux/actions/alertsAction";
import DeleteIcon from "@mui/icons-material/Delete";
import apis from "../../../../redux/actions/apis";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { HttpBadRequestError } from "../../../../redux/network";

const BillingEdit = () => {
  const initialInstance = {
    address_line: "",
    latitude: "",
    longitude: "",
    postal_code: "",
    city: "",
    state: "",
    country: "IN",
  };
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);
  const [addresses, setAddresses] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [instance, setInstance] = useState({ ...initialInstance });

  useEffect(() => {
    async function initiate() {
      try {
        const response = await apis.listAddress();
        setAddresses(response.results);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    initiate();
  }, []);

  const handleChange = (prop) => (event) => {
    setInstance({ ...instance, [prop]: event.target.value });
  };

  const handleSubmit = async (e) => {
    try {
      setIsSaving(true);
      e.preventDefault();
      const address = await apis.createAddress(instance);
      setAddresses([...addresses, address]);
      dispatch(
        alertMessage({
          message: "Address Saved!!",
          type: "success",
          open: true,
        })
      );
      setInstance(() => {
        return { ...initialInstance };
      });
      setErrors({});
    } catch (error) {
      console.error(error);
      if (error instanceof HttpBadRequestError) {
        setErrors({ ...error.data });
      }
      dispatch(
        alertMessage({
          message: "Error saving the address!!",
          type: "error",
          open: true,
        })
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (idx) => {
    try {
      setAddresses(prevState => {
        const newState = [...prevState];
        newState[idx] = {...prevState[idx], isDeleting: true};
        return newState;
      });
      await apis.deleteAddress(addresses[idx].uid);
      setAddresses((prevState) => {
        return prevState.filter(c => c.uid !== addresses[idx].uid);
      });
    } catch (error) {
      dispatch(
        alertMessage({
          message: "Error deleting the address!!",
          type: "error",
          open: true,
        })
      );
      setAddresses(prevState => {
        const newState = [...prevState];
        newState[idx] = {...prevState[idx], isDeleting: false};
        return newState;
      });
      console.error(error);
    }
  };

  return (
    <>
      <title>Edit Address | Orderrr</title>
      {loading ? (
        <Grid sx={{ p: 5 }} container justifyContent={"center"}>
          <CircularProgress sx={{ color: "text.primary" }} />
        </Grid>
      ) : (
        <TableContainer>
          <Table
            component="form"
            onSubmit={handleSubmit}
            sx={{ minWidth: 650 }}
            aria-label="simple table"
          >
            <TableHead>
              <TableRow>
                <TableCell>Address</TableCell>
                <TableCell>Postal Code</TableCell>
                <TableCell>City</TableCell>
                <TableCell>State</TableCell>
                <TableCell>Country</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {addresses.map((address, idx) => (
                <TableRow
                  key={address.uid}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell>{address.address_line}</TableCell>
                  <TableCell>{address.postal_code}</TableCell>
                  <TableCell>{address.city}</TableCell>
                  <TableCell>{address.state}</TableCell>
                  <TableCell>{address.country_display}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      color="primary"
                      onClick={() => handleDelete(idx)}
                    >
                      {address.isDeleting ? (
                        <CircularProgress size={20} />
                      ) : (
                        <DeleteIcon />
                      )}
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              <TableRow
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  verticalAlign: "top",
                }}
              >
                <TableCell>
                  <TextField
                    type="text"
                    label="Address Line"
                    value={instance.address_line}
                    onChange={handleChange("address_line")}
                    disabled={isSaving}
                    autoFocus
                    fullWidth
                    multiline
                    rows={3}
                    size="small"
                    required
                    error={errors.address_line}
                    helperText={errors.address_line}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    type="text"
                    label="Postal Code"
                    helperText={
                      errors.postal_code ??
                      "You can just enter postal code to autofill city and state on save."
                    }
                    value={instance.postal_code}
                    onChange={handleChange("postal_code")}
                    disabled={isSaving}
                    fullWidth
                    size="small"
                    required
                    error={errors.postal_code}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    type="text"
                    label="City"
                    value={instance.city}
                    onChange={handleChange("city")}
                    disabled={isSaving}
                    fullWidth
                    size="small"
                    error={errors.city}
                    helperText={errors.city}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    type="text"
                    label="State"
                    value={instance.state}
                    onChange={handleChange("state")}
                    disabled={isSaving}
                    inputProps={{ maxLength: 16 }}
                    fullWidth
                    size="small"
                    error={errors.state}
                    helperText={errors.state}
                  />
                </TableCell>
                <TableCell>
                  <FormControl fullWidth>
                    <InputLabel htmlFor="type">Country *</InputLabel>
                    <Select
                      id="type"
                      label="Country"
                      color="primary"
                      value={instance.country}
                      onChange={handleChange("country")}
                      disabled={loading}
                      required
                      fullWidth
                      size="small"
                      error={errors.country}
                      helperText={errors.country}
                    >
                      {user.choices?.country.map((t) => (
                        <MenuItem key={t.value} value={t.value}>
                          {t.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </TableCell>
                <TableCell align="right">
                  <IconButton color="primary" type="submit">
                    {isSaving ? (
                      <CircularProgress size={20} />
                    ) : (
                      <AddCircleIcon />
                    )}
                  </IconButton>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </>
  );
};

export default BillingEdit;
