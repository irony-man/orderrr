import {
  Grid,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  Box,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import apis from "../../../redux/actions/apis";
import { Link } from "react-router-dom";
import formatLib from "../../../utils/formatLib";

const ProfileOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function initiate() {
      try {
        const response = await apis.listOrder();
        setOrders(response.results);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    initiate();
  }, []);

  return (
    <>
      <title>Edit Address | Orderrr</title>
      {loading ? (
        <Grid sx={{ p: 5 }} container justifyContent={"center"}>
          <CircularProgress sx={{ color: "text.primary" }} />
        </Grid>
      ) : (
        <Box
          className="container"
          sx={{ color: "text.primary", py: 2, px: 3, bgcolor: "background.paper" }}
        >
          <Typography variant="h6" className="mb-3">Your Orderrrs</Typography>
          <TableContainer>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell align="right">Placed On</TableCell>
                  <TableCell>Address</TableCell>
                  <TableCell>Card</TableCell>
                  <TableCell align="right">Item Total</TableCell>
                  <TableCell align="right">Delivery Fees</TableCell>
                  <TableCell align="right">Price Paid</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.length ? (
                  orders.map((order) => (
                    <TableRow
                      key={order.uid}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
                    >
                      <TableCell>{order.uid}</TableCell>
                      <TableCell align="right">
                        {formatLib.formatDateTimeAsString(order.created)}
                      </TableCell>
                      <TableCell component={Link} to="/profile/edit/address">
                        {order.address.address_line}
                      </TableCell>
                      <TableCell component={Link} to="/profile/edit/billing">
                        {order.card.name} / {order.card.card_number}
                      </TableCell>
                      <TableCell align="right">
                        {formatLib.formatCurrency(order.final_price)}
                      </TableCell>
                      <TableCell align="right">
                        {formatLib.formatCurrency(order.delivery_fee)}
                      </TableCell>
                      <TableCell align="right">
                        {formatLib.formatCurrency(order.price_paid)}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell align="center" colspan={7}>No orderrrs yet</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
    </>
  );
};

export default ProfileOrders;
