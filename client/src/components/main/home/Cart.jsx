import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../nav/Navbar";
import {
  Grid,
  Paper,
  Typography,
  Stack,
  IconButton,
  Tooltip,
  Button,
} from "@mui/material";
import RemoveShoppingCartIcon from "@mui/icons-material/RemoveShoppingCart";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import {
  removeCart,
  addWishlist,
  removeWishlist,
} from "../../../redux/actions/userAction";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import axios from "axios";
import { AddWish, removeWish } from "../../../utils/AddRemoveWish";

const Cart = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const remove = (id) => {
    axios
      .post("/cart/remove", { id })
      .then((result) => {
        if (result.data.modifiedCount === 1) {
          dispatch(removeCart(id));
        }
      })
      .catch((err) => {});
  };
  const addremToWish = (id) => {
    if (user.wishlist.some((e) => e._id === id)) {
      removeWish(id).then((res) => {
        if (res) {
          dispatch(removeWishlist(id));
        }
      });
    } else {
      AddWish(id).then((res) => {
        if (res === false) {
        } else {
          dispatch(addWishlist([res]));
        }
      });
    }
  };
  const sum = user.cart.reduce((a, b) => {
    return a + b.price;
  }, 0);
  return (
    <>
      <title>
        Cart {user.cart.length === 0 ? "" : `(${user.cart.length})`} | Orderrr
      </title>
      <Navbar />
      <div style={{ margin: "0 1vw" }}>
        {user.cart.length === 0 ? (
          <>
            <Grid
              container
              justifyContent="center"
              alignItems="center"
              direction="column"
              sx={{ color: "#513D2B" }}
            >
              <Typography variant="h4">The cart is empty!!</Typography>
              <Link
                style={{
                  color: "#fff",
                  background: "#513D2B",
                  marginTop: "30px",
                  padding: "10px",
                  textDecoration: "none",
                }}
                to="/"
              >
                Continue Shopping!!
              </Link>
            </Grid>
          </>
        ) : (
          <>
            <Grid container justifyContent="center" spacing={2}>
              <Grid item xs={12} md={8}>
                <div className="cart-items" style={{ height: "80vh" }}>
                  {user.cart
                    .slice(0)
                    .reverse()
                    .map((design) => (
                      <Grid key={design._id} sx={{ mb: 2 }}>
                        <Paper sx={{ p: 2 }}>
                          <Grid
                            container
                            justifyContent="space-between"
                            spacing={0}
                          >
                            <Grid xs={4} sm={2.5} item>
                              <img
                                className="rounded img-fluid"
                                src={design.image.thumb}
                                alt={design.title}
                              />
                            </Grid>
                            <Grid
                              xs={7.5}
                              sm={9}
                              sx={{ color: "#513D2B" }}
                              item
                            >
                              <Stack
                                height="100%"
                                justifyContent="space-between"
                              >
                                <div>
                                  <Typography variant="h6" noWrap={true}>
                                    {design.title}
                                  </Typography>
                                  <Typography noWrap={true}>
                                    {design.description}
                                  </Typography>
                                </div>
                                <Grid
                                  container
                                  alignItems="center"
                                  justifyContent="space-between"
                                >
                                  <Typography variant="h6">
                                    ₹{design.price}
                                  </Typography>
                                  <div>
                                    <IconButton
                                      sx={{ color: "#513D2B" }}
                                      onClick={() => addremToWish(design._id)}
                                    >
                                      {user.wishlist.some(
                                        (e) => e._id === design._id
                                      ) ? (
                                        <Tooltip title="Remove from wishlist!!">
                                          <FavoriteIcon />
                                        </Tooltip>
                                      ) : (
                                        <Tooltip title="Add to wishlist!!">
                                          <FavoriteBorderOutlinedIcon />
                                        </Tooltip>
                                      )}
                                    </IconButton>
                                    <Tooltip title="Remove from cart!!">
                                      <IconButton
                                        sx={{ color: "#513D2B" }}
                                        onClick={() => remove(design._id)}
                                      >
                                        <RemoveShoppingCartIcon />
                                      </IconButton>
                                    </Tooltip>
                                  </div>
                                </Grid>
                              </Stack>
                            </Grid>
                          </Grid>
                        </Paper>
                      </Grid>
                    ))}
                </div>
              </Grid>
              <Grid item xs={12} md={4}>
                <Paper sx={{ p: 2, color: "#513d2b", mb: 2 }}>
                  <Typography variant="h6">Price Details</Typography>
                  <hr />
                  <Grid container justifyContent={"space-between"} m={"15px 0"}>
                    <Typography>Total items in the cart</Typography>
                    <Typography>{user.cart.length}</Typography>
                  </Grid>
                  <Grid container justifyContent={"space-between"} m={"15px 0"}>
                    <Typography>Total price of items</Typography>
                    <Typography>₹{sum}</Typography>
                  </Grid>
                  <Grid container justifyContent={"space-between"} m={"15px 0"}>
                    <Typography>
                      Delivery Charges{" "}
                      <Tooltip title="Order items of more than ₹500 for free delivery!!">
                        <InfoOutlinedIcon />
                      </Tooltip>
                    </Typography>
                    {sum >= 500 ? (
                      <Typography color={"green"}>FREE</Typography>
                    ) : (
                      <Typography>₹40</Typography>
                    )}
                  </Grid>
                  <hr />
                  <Grid container justifyContent={"space-between"} m={"15px 0"}>
                    <Typography>Total Amount</Typography>
                    {sum >= 500 ? (
                      <Typography>₹{sum}</Typography>
                    ) : (
                      <Typography>₹{sum + 40}</Typography>
                    )}
                  </Grid>
                  <Grid container justifyContent={"right"}>
                    <Button
                      style={{
                        color: "#fff",
                        background: "#513D2B",
                        marginTop: "30px",
                        padding: "10px 50px",
                      }}
                    >
                      Place Orderrr
                    </Button>
                  </Grid>
                </Paper>
              </Grid>
            </Grid>
          </>
        )}
      </div>
    </>
  );
};

export default Cart;
