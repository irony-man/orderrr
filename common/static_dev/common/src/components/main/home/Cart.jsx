import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  Grid,
  Paper,
  Typography,
  Stack,
  IconButton,
  Tooltip,
  Button,
  CircularProgress,
} from "@mui/material";
import RemoveShoppingCartIcon from "@mui/icons-material/RemoveShoppingCart";
import {
  removeCart,
  addOrDeleteWishlist,
} from "../../../redux/actions/userAction";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import apis from "../../../redux/actions/apis";
import formatLib from "../../../utils/formatLib";
import { alertMessage } from "../../../redux/actions/alertsAction";
import PriceDetails from "../../common/PriceDetails";

const Cart = () => {
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [summary, setSummary] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const placeOrder = () => {
    navigate("/place");
  };

  useEffect(() => {
    async function initiate() {
      try {
        setLoading(true);
        const response = await apis.getCartSummary();
        setCart([...response.items]);
        setSummary({ ...response.summary });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    initiate();
  }, []);

  const remove = async (uid) => {
    try {
      setLoading(true);
      await apis.deleteCart(uid);
      dispatch(removeCart());
      const response = await apis.getCartSummary();
      setCart([...response.items]);
      setSummary({ ...response.summary });
    } catch (error) {
      alertMessage({
        message: "Error removing design from Cart.",
        type: "error",
        open: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const addremToWish = async (idx) => {
    setCart((prevState) => {
      const newState = [...prevState];
      newState[idx].design = {
        ...prevState[idx].design,
        wishlistLoading: true,
      };
      return newState;
    });
    const response = await dispatch(addOrDeleteWishlist(cart[idx].design));
    setCart((prevState) => {
      const newState = [...prevState];
      newState[idx].design = {
        ...prevState[idx].design,
        ...response,
        wishlistLoading: false,
      };
      return newState;
    });
  };

  return loading ? (
    <Grid container justifyContent={"center"}>
      <CircularProgress sx={{ color: "text.primary" }} />
    </Grid>
  ) : (
    <>
      <title>
        Cart {cart.length === 0 ? "" : `(${cart.length})`} | Orderrr
      </title>
      <div className="container">
        {cart.length === 0 ? (
          <>
            <Grid
              container
              justifyContent="center"
              alignItems="center"
              direction="column"
            >
              <Typography variant="h4" color="text.primary">
                The cart is empty!!
              </Typography>
              <Button
                variant="contained"
                sx={{
                  mt: "30px",
                  p: "10px",
                  textDecoration: "none",
                }}
                onClick={() => navigate("/")}
              >
                Continue Shopping!!
              </Button>
            </Grid>
          </>
        ) : (
          <>
            <Grid container justifyContent="center" spacing={2}>
              <Grid item xs={12} md={6}>
                <div className="cart-items" style={{ height: "80vh" }}>
                  {cart.map(({ design, uid }, idx) => (
                    <Grid key={design.uid} sx={{ mb: 2 }}>
                      <Paper sx={{ p: 2 }}>
                        <Grid
                          container
                          justifyContent="space-between"
                          spacing={0}
                        >
                          <Grid
                            xs={4}
                            sm={2.5}
                            item
                            component={Link}
                            to={"/design/" + design.uid}
                          >
                            <img
                              className="profile-designs"
                              src={design.image_thumbnail_url}
                              alt={design.title}
                            />
                          </Grid>
                          <Grid xs={7.5} sm={9} item>
                            <Stack
                              height="100%"
                              justifyContent="space-between"
                            >
                              <div>
                                <Typography variant="h6" noWrap={true}>
                                  {design.title}
                                </Typography>
                              </div>
                              <Grid
                                container
                                alignItems="center"
                                justifyContent="space-between"
                              >
                                <div className="d-flex align-items-end">
                                  <Typography
                                    variant="h6"
                                    noWrap={true}
                                    color="text.primary"
                                  >
                                    {formatLib.formatCurrency(
                                      design.final_price
                                    )}
                                  </Typography>
                                  {design.discount ? (
                                    <Typography
                                      variant="body2"
                                      sx={{ ml: 1, mb: "3px" }}
                                      noWrap={true}
                                      color="text.primary"
                                    >
                                      <strike>
                                        {formatLib.formatCurrency(
                                          design.base_price
                                        )}
                                      </strike>
                                    </Typography>
                                  ) : (
                                    <></>
                                  )}
                                </div>
                                <div>
                                  <IconButton
                                    sx={{ color: "text.primary" }}
                                    onClick={() => addremToWish(idx)}
                                  >
                                    {design.wishlistLoading ? (
                                      <CircularProgress size={20} />
                                    ) : (
                                      <Tooltip
                                        title={
                                          design.cart_uid
                                            ? "Remove from wishlist!!"
                                            : "Add to wishlist!!"
                                        }
                                      >
                                        {design.wishlist_uid ? (
                                          <FavoriteIcon />
                                        ) : (
                                          <FavoriteBorderOutlinedIcon />
                                        )}
                                      </Tooltip>
                                    )}
                                  </IconButton>
                                  <Tooltip title="Remove from cart!!">
                                    <IconButton
                                      sx={{ color: "text.primary" }}
                                      onClick={() => remove(uid)}
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
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2, mb: 2 }}>
                  <PriceDetails summary={summary} />

                  <Grid container justifyContent={"right"}>
                    <Button
                      variant="contained"
                      style={{
                        marginTop: "30px",
                        padding: "10px 50px",
                      }}
                      onClick={placeOrder}
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
