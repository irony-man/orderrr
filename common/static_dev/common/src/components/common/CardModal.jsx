import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import dayjs from "dayjs";
import { useState } from "react";
import { useDispatch } from "react-redux";
import apis from "../../redux/actions/apis";
import { alertMessage } from "../../redux/actions/alertsAction";
import { HttpBadRequestError } from "../../redux/network";
import { DatePicker } from "@mui/x-date-pickers";

export default function CardModal({open, setOpen, saveCard}) {
  const initialInstance = {
    card_number: "",
    name_on_card: "",
    name: "",
    card_expiry: dayjs(new Date()).format("YYYY-MM-DD"),
  };
  const dispatch = useDispatch();
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
      const card = await apis.createCard(instance);

      saveCard(card);
      dispatch(
        alertMessage({
          message: "Card Saved!!",
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
          message: "Error saving the card!!",
          type: "error",
          open: true,
        })
      );
    } finally {
      setIsSaving(false);
    }
  };
  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      PaperProps={{
        component: "form",
        onSubmit: handleSubmit,
      }}
    >
      <DialogTitle>Add Card</DialogTitle>
      <DialogContent>
        <div className="my-4">
          <TextField
            type="text"
            label="Name"
            value={instance.name}
            onChange={handleChange("name")}
            disabled={isSaving}
            autoFocus
            fullWidth
            required
            error={errors.name}
            helperText={errors.name}
          />
        </div>
        <div className="mb-4">
          <TextField
            type="text"
            label="Name on Card"
            value={instance.name_on_card}
            onChange={handleChange("name_on_card")}
            disabled={isSaving}
            fullWidth
            required
            error={errors.name_on_card}
            helperText={errors.name_on_card}
          />
        </div>
        <div className="mb-4">
          <TextField
            type="text"
            label="Card Number"
            helperText={
              errors.card_number ??
                "Must be of 16 digits, you can put any number."
            }
            value={instance.card_number > 0 ? instance.card_number : ""}
            onChange={handleChange("card_number")}
            disabled={isSaving}
            inputProps={{ maxLength: 16 }}
            fullWidth
            required
            error={errors.card_number}
          />
        </div>
        <div className="mb-4">
          <DatePicker
            views={["year", "month"]}
            label="Card Expiry"
            value={instance.card_expiry}
            minDate={new Date()}
            onChange={(newValue) => {
              setInstance({
                ...instance,
                card_expiry: dayjs(newValue).format("YYYY-MM-DD"),
              });
            }}
            disabled={isSaving}
            renderInput={(params) => (
              <TextField
                helperText={errors.card_expiry}
                fullWidth
                {...params}
                error={errors.card_expiry}
              />
            )}
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(false)} disabled={isSaving}>Cancel</Button>
        <Button className="ms-3" variant="contained" type="submit" disabled={isSaving}>{isSaving ? "Adding": "Add"}</Button>
      </DialogActions>
    </Dialog>
  );
}
