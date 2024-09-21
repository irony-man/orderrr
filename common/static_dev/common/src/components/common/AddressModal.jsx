import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useState } from "react";
import apis from "../../redux/actions/apis";
import { useDispatch, useSelector } from "react-redux";
import { alertMessage } from "../../redux/actions/alertsAction";
import { HttpBadRequestError } from "../../redux/network";

export default function AddressModal({open, setOpen, saveAddress}) {
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
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [instance, setInstance] = useState({ ...initialInstance });

  const handleChange = (prop) => (event) => {
    setInstance({ ...instance, [prop]: event.target.value });
  };

  const handleSubmit = async (e) => {
    try {
      setIsSaving(true);
      e.preventDefault();
      const address = await apis.createAddress(instance);
      saveAddress(address);
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
      setOpen(false);
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
  return (
    <div>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          component: "form",
          onSubmit: handleSubmit
        }}
      >
        <DialogTitle>Add Address</DialogTitle>
        <DialogContent>
          <div className="my-4">
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
              required
              error={errors.address_line}
              helperText={errors.address_line}
            />
          </div>
          <div className="mb-4">
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
              required
              error={errors.postal_code}
            />
          </div>
          <div className="mb-4">
            <TextField
              type="text"
              label="City"
              value={instance.city}
              onChange={handleChange("city")}
              disabled={isSaving}
              fullWidth
              error={errors.city}
              helperText={errors.city}
            />
          </div>
          <div className="mb-4">
            <TextField
              type="text"
              label="State"
              value={instance.state}
              onChange={handleChange("state")}
              disabled={isSaving}
              inputProps={{ maxLength: 16 }}
              fullWidth
              error={errors.state}
              helperText={errors.state}
            />
          </div>
          <div className="mb-4">
            <FormControl fullWidth>
              <InputLabel htmlFor="type">Country *</InputLabel>
              <Select
                id="type"
                label="Country"
                color="primary"
                value={instance.country}
                onChange={handleChange("country")}
                disabled={isSaving}
                required
                fullWidth
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
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} disabled={isSaving}>Cancel</Button>
          <Button className="ms-3" variant="contained" type="submit" disabled={isSaving}>{isSaving ? "Adding": "Add"}</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
