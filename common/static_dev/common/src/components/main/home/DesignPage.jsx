import {
  Button,
  CircularProgress,
  Grid,
  Typography,
  Box,
  IconButton,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import ShoppingCartOutlined from "@mui/icons-material/ShoppingCartOutlined";
import { Link, useNavigate, useParams } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  addCart,
  addOrDeleteWishlist,
} from "../../../redux/actions/userAction";
import FavoriteIcon from "@mui/icons-material/Favorite";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import NotFound from "../NotFound";
import apis from "../../../redux/actions/apis";
import formatLib from "../../../utils/formatLib";
import DesignCards from "../../common/DesignCards";
import { HttpNotFound } from "../../../redux/network";
import { alertMessage } from "../../../redux/actions/alertsAction";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const DesignPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [design, setDesign] = useState({});
  const [loading, setLoading] = useState(true);
  const [cartLoading, setCartLoading] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { uid } = useParams();

  useEffect(() => {
    async function initiate() {
      try {
        const response = await apis.getDesign(uid);
        setDesign(response);
      } catch (err) {
        console.error(err);
        if (err instanceof HttpNotFound) {
          setDesign({ ...design, not_found: true });
        }
      } finally {
        setLoading(false);
      }
    }
    initiate();
  }, [uid]);

  const addToCart = async () => {
    if (design.cart_uid) {
      navigate("/cart");
    } else {
      setCartLoading(true);
      const response = await dispatch(addCart(design.uid));
      if (response) {
        setDesign({ ...response.design });
      }
      setCartLoading(false);
    }
  };

  const addremToWish = async () => {
    setWishlistLoading(true);
    const response = await dispatch(addOrDeleteWishlist(design));
    if (response) {
      setDesign({ ...response });
    }
    setWishlistLoading(false);
  };

  const deletePost = async () => {
    try {
      setDeleteLoading(true);
      await apis.deleteDesign(uid);
      setOpen(false);
      navigate("/profile");
    } catch (error) {
      dispatch(
        alertMessage({
          message: "Error deleting the design!!",
          type: "error",
          open: true,
        })
      );
      console.error(error);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <>
      <title>{design.title} | Orderrr</title>
      {loading ? (
        <Grid container justifyContent={"center"}>
          <CircularProgress sx={{ color: "text.primary" }} />
        </Grid>
      ) : design.not_found ? (
        <>
          <NotFound type="Product" />
        </>
      ) : (
        <div className="container">
          <form className="mb-5">
            <Grid
              container
              spacing={5}
              justifyContent="center"
              alignItems="flex-start"
            >
              <Grid
                lg
                sm={12}
                item
                sx={{ color: "text.primary", textAlign: "center" }}
                justifyContent="center"
              >
                <Box
                  className="design-img-container"
                  sx={{ bgcolor: "background.paper" }}
                >
                  <img src={design.image} alt={design.title} />
                </Box>
                <Grid
                  container
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ mb: 5 }}
                >
                  <Typography>
                    Design by:
                    <Typography
                      variant="h6"
                      component={Link}
                      to={`/profile/${design.user?.uid}`}
                      sx={{
                        color: "text.primary",
                        ":hover": { color: "text.primary" },
                        ml: 1,
                      }}
                    >
                      {design.user.username}
                    </Typography>
                  </Typography>
                  <Typography variant="body2">Uploaded: <strong>{dayjs((formatLib.formatDateTime(design.created))).fromNow()}</strong></Typography>
                  {/* <Rating
                    name="half-rating"
                    defaultValue={4.5}
                    precision={0.5}
                    readOnly
                  /> */}
                </Grid>
                {!design.is_yours ? (
                  <div className="row g-4">
                    <div className="col">
                      <Button
                        variant="outlined"
                        fullWidth
                        style={{
                          padding: "10px 0",
                        }}
                        startIcon={
                          design.wishlist_uid ? (
                            <FavoriteIcon />
                          ) : (
                            <FavoriteBorderOutlinedIcon />
                          )
                        }
                        onClick={addremToWish}
                        disabled={wishlistLoading}
                      >
                        {design.wishlist_uid
                          ? wishlistLoading
                            ? "Removing from"
                            : "In the"
                          : wishlistLoading
                            ? "Adding to"
                            : "Add to "}{" "}
                        Wishlist
                      </Button>
                    </div>
                    <div className="col">
                      <Button
                        fullWidth
                        variant="contained"
                        sx={{
                          padding: "10px 0",
                        }}
                        startIcon={
                          design.cart_uid ? (
                            <ShoppingCartOutlined />
                          ) : (
                            <AddShoppingCartIcon />
                          )
                        }
                        onClick={addToCart}
                        disabled={cartLoading}
                      >
                        {cartLoading
                          ? "Adding"
                          : design.cart_uid
                            ? "Go"
                            : "Add"}{" "}
                        to Cart
                      </Button>
                    </div>
                  </div>
                ) : (
                  ""
                )}
              </Grid>
              <Grid
                lg
                sm={12}
                item
                flexGrow={1}
                sx={{ color: "text.primary" }}
              >
                <div className="row g-3 align-items-center">
                  <div className="col-12">
                    <Typography variant="h5" noWrap>
                      {design.title}
                    </Typography>
                  </div>
                  <div className="col d-flex align-items-end">
                    <Typography
                      variant="h5"
                      noWrap={true}
                      color="text.primary"
                    >
                      {formatLib.formatCurrency(design.final_price)}
                    </Typography>
                    {design.discount ? (
                      <>
                        <Typography
                          variant="body2"
                          sx={{ ml: 1, mb: "3px" }}
                          noWrap={true}
                          color="text.primary"
                        >
                          <strike>
                            {formatLib.formatCurrency(design.base_price)}
                          </strike>
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ ml: 1 }}
                          noWrap={true}
                          className="text-uppercase text-success"
                        >
                          Off: {formatLib.formatPercentage(design.discount)}
                        </Typography>
                      </>
                    ) : (
                      <></>
                    )}
                  </div>
                  <div className="col text-end">
                    <Typography color="text.primary">
                      <LocalOfferIcon fontSize="small" /> {design.design_type}
                    </Typography>
                  </div>
                  <div className="col-12">
                    <Typography
                      className="cart-items"
                      variant="body1"
                      sx={{
                        fontWeight: "light",
                        color: "text.primary",
                      }}
                    >
                      {design.description}
                    </Typography>
                  </div>
                </div>

                {design.is_yours ? (
                  <div className="row mt-3 g-4">
                    <div className="col">
                      <Button
                        variant="outlined"
                        fullWidth
                        sx={{
                          p: "10px 0",
                          ":hover": { color: "text.primary" },
                        }}
                        startIcon={<EditIcon />}
                        component={Link}
                        to={`/design/${uid}/edit`}
                      >
                        Edit
                      </Button>
                    </div>
                    <div className="col">
                      <Button
                        fullWidth
                        variant="contained"
                        sx={{
                          padding: "10px 0",
                        }}
                        startIcon={<DeleteIcon />}
                        onClick={() => setOpen(true)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ) : (
                  ""
                )}
              </Grid>
            </Grid>
          </form>
          <div className="">
            <Typography variant="h6" className="mb-4">
              More like this
            </Typography>
            <DesignCards
              query={{ exclude_design: uid }}
              fetchFunc={apis.listDesign}
            />
          </div>
          <Dialog open={open} onClose={() => setOpen(false)}>
            <DialogTitle>Are you sure you want to delete this?</DialogTitle>
            <DialogActions>
              {deleteLoading ? (
                <IconButton>
                  <CircularProgress />
                </IconButton>
              ) : (
                <>
                  <Button onClick={() => setOpen(false)}>No</Button>
                  <Button variant="contained" onClick={deletePost} autoFocus>
                    Yes
                  </Button>
                </>
              )}
            </DialogActions>
          </Dialog>
        </div>
      )}
    </>
  );
};

export default DesignPage;
