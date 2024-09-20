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
} from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { alertMessage } from "../../../../redux/actions/alertsAction";
import DeleteIcon from "@mui/icons-material/Delete";
import apis from "../../../../redux/actions/apis";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { HttpBadRequestError } from "../../../../redux/network";
import dayjs from "dayjs";

const BillingEdit = () => {
  const initialInstance = {
    card_number: "",
    name_on_card: "",
    name: "",
    card_expiry: dayjs(new Date()).format("YYYY-MM-DD"),
  };
  const dispatch = useDispatch();
  const [cards, setCards] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [instance, setInstance] = useState({ ...initialInstance });

  useEffect(() => {
    async function initiate() {
      try {
        const response = await apis.listCard();
        setCards(response.results);
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
      const card = await apis.createCard(instance);
      setCards([...cards, card]);
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

  const handleDelete = async (idx) => {
    try {
      setCards(prevState => {
        const newState = [...prevState];
        newState[idx] = {...prevState[idx], isDeleting: true};
        return newState;
      });
      await apis.deleteCard(cards[idx].uid);
      setCards((prevState) => {
        return prevState.filter(c => c.uid !== cards[idx].uid);
      });
    } catch (error) {
      dispatch(
        alertMessage({
          message: "Error deleting the card!!",
          type: "error",
          open: true,
        })
      );
      setCards(prevState => {
        const newState = [...prevState];
        newState[idx] = {...prevState[idx], isDeleting: false};
        return newState;
      });
      console.error(error);
    }
  };

  return (
    <>
      <title>Edit Billing | Orderrr</title>
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
                <TableCell>Name</TableCell>
                <TableCell>Name on Card</TableCell>
                <TableCell>Card Number</TableCell>
                <TableCell align="right">Card Expiry</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {cards.map((card, idx) => (
                <TableRow
                  key={card.uid}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell>{card.name}</TableCell>
                  <TableCell>{card.name_on_card}</TableCell>
                  <TableCell>{card.card_number}</TableCell>
                  <TableCell align="right">{card.card_expiry}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      color="primary"
                      onClick={() => handleDelete(idx)}
                    >
                      {card.isDeleting ? (
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
                    label="Name"
                    value={instance.name}
                    onChange={handleChange("name")}
                    disabled={isSaving}
                    autoFocus
                    fullWidth
                    size="small"
                    required
                    error={errors.name}
                    helperText={errors.name}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    type="text"
                    label="Name on Card"
                    value={instance.name_on_card}
                    onChange={handleChange("name_on_card")}
                    disabled={isSaving}
                    fullWidth
                    size="small"
                    required
                    error={errors.name_on_card}
                    helperText={errors.name_on_card}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    type="text"
                    label="Card Number"
                    helperText={
                      errors.card_number ??
                      "Must be of 16 digits, you can put any number."
                    }
                    value={
                      instance.card_number > 0 ? instance.card_number : ""
                    }
                    onChange={handleChange("card_number")}
                    disabled={isSaving}
                    inputProps={{ maxLength: 16 }}
                    fullWidth
                    size="small"
                    required
                    error={errors.card_number}
                  />
                </TableCell>
                <TableCell align="right">
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
                        size="small"
                        {...params}
                        error={errors.card_expiry}
                      />
                    )}
                  />
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
      {/* <Box component="form" onSubmit={handleSubmit} className="row g-4 mt-5">
        <div className="col-12">
          <TextField
            type="number"
            label="Card Number"
            helperText="Must be of 16 digits, you can put any number."
            value={instance.card_number > 0 ? instance.card_number : ""}
            onChange={handleChange("card_number")}
            disabled={isSaving}
            autoFocus
            fullWidth
            required
          />
        </div>
        <div className="col-6">
          <TextField
            type="text"
            label="Name on Card"
            value={instance.name_on_card}
            onChange={handleChange("name_on_card")}
            disabled={isSaving}
            fullWidth
            required
          />
        </div>
        <div className="col-6">
          <TextField
            type="text"
            label="Name this Card"
            helperText="You will see this as Card Name"
            value={instance.name}
            onChange={handleChange("name")}
            disabled={isSaving}
            fullWidth
            required
          />
        </div>
        <div className="col-6">
          <Button
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            disabled={isSaving}
          >
            {loading ? "Loading..." : "Submit"}
          </Button>
        </div>
        <div className="col-6">
          <Button
            variant="outlined"
            size="large"
            fullWidth
            disabled={isSaving}
            onClick={() => setAdding(false)}
          >
            Cancel
          </Button>
        </div>
      </Box> */}
    </>
  );
};

export default BillingEdit;
