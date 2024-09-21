import {
  IconButton,
  Grid,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  Button,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { alertMessage } from "../../../../redux/actions/alertsAction";
import DeleteIcon from "@mui/icons-material/Delete";
import apis from "../../../../redux/actions/apis";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CardModal from "../../../common/CardModal";

const BillingEdit = () => {
  const dispatch = useDispatch();
  const [cards, setCards] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

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

  const handleDelete = async (idx) => {
    try {
      setCards((prevState) => {
        const newState = [...prevState];
        newState[idx] = { ...prevState[idx], isDeleting: true };
        return newState;
      });
      await apis.deleteCard(cards[idx].uid);
      setCards((prevState) => {
        return prevState.filter((c) => c.uid !== cards[idx].uid);
      });
    } catch (error) {
      dispatch(
        alertMessage({
          message: "Error deleting the card!!",
          type: "error",
          open: true,
        })
      );
      setCards((prevState) => {
        const newState = [...prevState];
        newState[idx] = { ...prevState[idx], isDeleting: false };
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
        <div>
          <TableContainer>
            <Table sx={{ minWidth: 650 }}>
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
                <TableRow>
                  <TableCell className="text-center" colSpan={5}>
                    <Button fullWidth onClick={() => setOpen(true)}>
                      <AddCircleIcon className="me-2" />
                      Add Card
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          <CardModal
            open={open}
            setOpen={setOpen}
            saveCard={(card) => setCards([...cards, card])}
          />
        </div>
      )}
    </>
  );
};

export default BillingEdit;
