import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../nav/Navbar";
import "./Home.css";
import { useDispatch, useSelector } from "react-redux";
import {
  addCart,
  addWishlist,
  removeWishlist,
} from "../../../redux/actions/userAction";
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  IconButton,
  Typography,
  Tooltip,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import AddCart from "../../../utils/AddCart";
import { AddWish, removeWish } from "../../../utils/AddRemoveWish";

const WishList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const addToCart = (id) => {
    if (user.cart.some((e) => e._id === id)) {
      navigate("/cart");
    } else {
      AddCart(id).then((res) => {
        if (res === false) {
        } else {
          dispatch(addCart([res]));
        }
      });
    }
  };

  const addremToWish = (id) => {
    if (user.wishlist.some((e) => e._id === id)) {
      removeWish(id).then((res) => {
        if (res) {
          dispatch(removeWishlist(id));
        }
      });
    }
  };
  const avatarLink = (id) => {
    alert(id);
  };
  return (
    <>
      <title>Wishlist | Orderrr</title>
      <Navbar />
      {user.wishlist.length === 0 ? (
        <>
          <Grid
            container
            justifyContent="center"
            alignItems="center"
            direction="column"
            sx={{ color: "#513D2B" }}
          >
            <Typography variant="h4">The wishlist is empty!!</Typography>
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
        <div className="row m-0">
          {user.wishlist.map((design) => (
            <div key={design._id} className="col-md-4 col-sm-6 col-12 p-2">
              <Card>
                <Link
                  to={`/design/${design._id}`}
                  style={{ textDecoration: "none" }}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={design.image.thumb}
                    alt={design.title}
                  />
                  <CardContent>
                    <Typography
                      variant="h4"
                      gutterBottom
                      noWrap={true}
                      sx={{ color: "#513D2B" }}
                    >
                      {design.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      noWrap={true}
                      color="text.secondary"
                    >
                      {design.description}
                    </Typography>
                  </CardContent>
                </Link>
                <CardActions
                  sx={{ justifyContent: "space-between" }}
                  disableSpacing
                >
                  <p
                    style={{
                      fontSize: "24px",
                      margin: "0 10px",
                      color: "#513D2B",
                    }}
                  >
                    <b>₹ {design.price}</b>
                  </p>
                  <div>
                    <IconButton
                      sx={{ color: "#513D2B" }}
                      onClick={() => addremToWish(design._id)}
                    >
                      <Tooltip title="Remove from wishlist!!">
                        <FavoriteIcon />
                      </Tooltip>
                    </IconButton>
                    <IconButton
                      sx={{ color: "#513D2B" }}
                      onClick={() => addToCart(design._id)}
                    >
                      {user.cart.some((e) => e._id === design._id) ? (
                        <Tooltip title="Go to cart!!">
                          <ShoppingCartOutlinedIcon />
                        </Tooltip>
                      ) : (
                        <Tooltip title="Add to cart!!">
                          <AddShoppingCartIcon />
                        </Tooltip>
                      )}
                    </IconButton>
                  </div>
                </CardActions>
              </Card>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default WishList;
