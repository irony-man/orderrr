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
import AddressModal from "../../../common/AddressModal";

const BillingEdit = () => {
  const dispatch = useDispatch();
  const [addresses, setAddresses] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

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

  const handleDelete = async (idx) => {
    try {
      setAddresses((prevState) => {
        const newState = [...prevState];
        newState[idx] = { ...prevState[idx], isDeleting: true };
        return newState;
      });
      await apis.deleteAddress(addresses[idx].uid);
      setAddresses((prevState) => {
        return prevState.filter((c) => c.uid !== addresses[idx].uid);
      });
    } catch (error) {
      dispatch(
        alertMessage({
          message: "Error deleting the address!!",
          type: "error",
          open: true,
        })
      );
      setAddresses((prevState) => {
        const newState = [...prevState];
        newState[idx] = { ...prevState[idx], isDeleting: false };
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
        <div>
          <TableContainer>
            <Table sx={{ minWidth: 650 }}>
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
                <TableRow>
                  <TableCell className="text-center" colSpan={6}>
                    <Button fullWidth onClick={() => setOpen(true)}>
                      <AddCircleIcon className="me-2" />
                      Add Address
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          <AddressModal
            open={open}
            setOpen={setOpen}
            saveAddress={(address) => setAddresses([...addresses, address])}
          />
        </div>
      )}
    </>
  );
};

export default BillingEdit;
