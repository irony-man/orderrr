import React, {  } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  addCart,
  addremWishlist
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
  Button} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";

const WishList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const addToCart = (id) => {
    if (user.cart.some((e) => e._id === id)) {
      navigate("/cart");
    } else {
      dispatch(addCart(id));
    }
  };

  const addremToWish = (id) => {
    dispatch(addremWishlist(id));
  };
  return (
    <>
      <title>Wishlist | Orderrr</title>
      {user.wishlist.length === 0 ? (
        <>
          <Grid
            container
            justifyContent="center"
            alignItems="center"
            direction="column"
          >
            <Typography variant="h4" color="text.primary">
                The wishlist is empty!!
            </Typography>
            <Button
              variant="contained"
              style={{
                marginTop: "30px",
                padding: "10px",
                textDecoration: "none",
              }}
              onClick={() => navigate("/")}
            >
                Continue Shopping!!
            </Button>
          </Grid>
        </>
      ) : (
        <div className="row m-0">
          {user.wishlist.map((design) => (
            <div key={design._id} className="col-xl-3 col-md-4 col-sm-6 col-12 p-2">
              <Card>
                <Link
                  to={`/product/${design._id}?ref=wishlist`}
                  style={{ textDecoration: "none" }}
                >
                  <CardMedia
                    component="img"
                    height="300"
                    image={design.image.thumb}
                    alt={design.title}
                  />
                  <CardContent>
                    <Typography
                      variant="h4"
                      gutterBottom
                      noWrap={true}
                      sx={{ color: "text.primary" }}
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
                      color: "text.primary",
                    }}
                  >
                    <b>₹ {design.price}</b>
                  </p>
                  <div>
                    <IconButton
                      sx={{ color: "text.primary" }}
                      onClick={() => addremToWish(design._id)}
                    >
                      <Tooltip title="Remove from wishlist!!">
                        <FavoriteIcon />
                      </Tooltip>
                    </IconButton>
                    <IconButton
                      sx={{ color: "text.primary" }}
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
