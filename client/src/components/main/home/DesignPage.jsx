import {
  Box,
  Button,
  CircularProgress,
  Grid,
  Typography,
  Rating,
  Alert,
  IconButton,
  Tooltip,
  TextField,
  InputAdornment,
  DialogContent,
  Divider,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import ShoppingCartOutlined from "@mui/icons-material/ShoppingCartOutlined";
import { Link, useNavigate, useParams } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { isMobile } from "react-device-detect";
import {
  addCart,
  addremWishlist,
  deleteDesign,
  editDesign,
} from "../../../redux/actions/userAction";
import { setDesign } from "../../../redux/actions/designAction";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import { getDesign } from "../../../redux/actions/designAction";
import { alertMessage } from "../../../redux/actions/alertsAction";
import NotFound from "../NotFound";

const DesignPage = () => {
  const user = useSelector((state) => state.user);
  const designs = useSelector((state) => state.allDesigns.designs);
  const design = useSelector((state) => state.design);
  const loading = useSelector((state) => state.loading);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [readMore, setReadMore] = useState(false);
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [open, setOpen] = useState(false);
  const {id} = useParams();
  const ref = new URLSearchParams(window.location.search).get("ref");
  const found = "user";
  useEffect(() => {
    if (ref === "home") {
      dispatch(
        setDesign({ design: designs.filter((e) => e._id === id)[0], id: id })
      );
    } else if (ref === "profile") {
      dispatch(
        setDesign({
          design: user.designs.filter((e) => e._id === id)[0],
          id: id,
        })
      );
    } else if (ref === "cart") {
      dispatch(
        setDesign({
          design: user.cart.filter((e) => e._id === id)[0],
          id: id,
        })
      );
    } else if (ref === "wishlist") {
      dispatch(
        setDesign({
          design: user.wishlist.filter((e) => e._id === id)[0],
          id: id,
        })
      );
    } else {
      dispatch(getDesign(id));
    }
  }, []);
  const addToCart = () => {
    if (user.cart.some((e) => e._id === design._id)) {
      navigate("/cart");
    } else {
      dispatch(addCart(design._id));
    }
  };
  const addremToWish = () => {
    dispatch(addremWishlist(design._id));
  };
  const editProduct = () => {
    setEditing(true);
    setTitle(design.title);
    setPrice(design.price);
    setDescription(design.description);
  };
  const saveChanges = () => {
    if (title === "" || description === "" || price === "") {
      setEditing(true);
      dispatch(
        alertMessage({
          message: "Fill every field!!",
          type: "error",
          open: true,
        })
      );
    } else {
      dispatch(
        editDesign({
          id: design._id,
          title,
          description,
          price,
        })
      );
      setEditing(false);
    }
  };
  const deletePost = () => {
    dispatch(deleteDesign(design._id));
    setOpen(false);
    navigate("/");
  };
  return (
    <>
      <title>{design.title} | Orderrr</title>
      {loading ? (
        <Grid container justifyContent={"center"}>
          <CircularProgress sx={{ color: "text.primary" }} />
        </Grid>
      ) : design.notFound ? (
        <>
          <NotFound type="Product" />
        </>
      ) : (
        <>
          <div style={{ color: "primary", margin: "0 7vw" }}>
            <form>
              <Grid
                container
                spacing={3}
                justifyContent="center"
                alignItems="flex-start"
              >
                <Grid
                  lg={"auto"}
                  sm={12}
                  item
                  sx={{ color: "text.primary", textAlign: "center" }}
                  justifyContent="center"
                >
                  <img
                    src={design.image.full}
                    style={{
                      maxHeight: "calc(100vh - 150px)",
                      width: "fit",
                      maxWidth: "100%",
                      border: "2px solid",
                      borderRadius: "20px",
                    }}
                  />
                </Grid>
                <Grid
                  lg
                  sm={12}
                  item
                  flexGrow={1}
                  sx={{ color: "text.primary" }}
                >
                  <Typography variant="h4">Product Description</Typography>
                  {editing ? (
                    <TextField
                      label="Title"
                      variant="outlined"
                      margin="normal"
                      fullWidth
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  ) : (
                    <Typography variant="h5" sx={{ mt: "20" }} noWrap>
                      {design.title}
                    </Typography>
                  )}
                  <Grid
                    container
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography>
                      Design by:
                      <Typography
                        variant="h6"
                        component={Link}
                        to={`/profile${
                          design.owner._id === user._id ||
                          design.owner === user._id
                            ? ""
                            : "/" + design.owner._id
                        }`}
                        sx={{
                          color: "text.primary",
                          ":hover": { color: "text.primary" },
                          ml: 1,
                        }}
                      >
                        {design.owner.username || user.username}
                      </Typography>
                    </Typography>
                    <Typography color="text.primary">
                      <LocalOfferIcon fontSize="small" /> {design.type}
                    </Typography>
                  </Grid>
                  <Grid
                    container
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    {editing ? (
                      <TextField
                        label="Price"
                        type="number"
                        margin="normal"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">₹</InputAdornment>
                          ),
                        }}
                        size="small"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                      />
                    ) : (
                      <Typography variant="h4" color="text.primary">
                        ₹{design.price}
                      </Typography>
                    )}
                    <Rating
                      name="half-rating"
                      defaultValue={4.5}
                      precision={0.5}
                      readOnly
                    />
                  </Grid>
                  {editing ? (
                    <TextField
                      label="Description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={6}
                      margin="normal"
                      multiline
                      fullWidth
                      required
                    />
                  ) : (
                    <>
                      <Typography
                        className="cart-items"
                        variant="subtitle1"
                        sx={{
                          mt: 3,
                          color: "text.primary",
                          height:
                            design.description.length <= 800
                              ? "calc(100vh - 400px)"
                              : "0",
                        }}
                      >
                        {design.description.slice(0, 800)}
                        <span
                          onClick={() => setReadMore(true)}
                          style={{ cursor: "pointer" }}
                        >
                          <b>
                            {design.description.length >= 800
                              ? readMore
                                ? "...Read Less"
                                : "...Read More"
                              : ""}
                          </b>
                        </span>
                      </Typography>
                      <Dialog
                        open={readMore}
                        onClose={() => setReadMore(false)}
                        scroll="paper"
                        fullWidth
                      >
                        <Tooltip title={design.title}>
                          <DialogTitle noWrap>{design.title}</DialogTitle>
                        </Tooltip>
                        <DialogContent>{design.description}</DialogContent>
                        <Divider />
                        <DialogActions>
                          <Button
                            variant="contained"
                            onClick={() => setReadMore(false)}
                          >
                            Ok
                          </Button>
                        </DialogActions>
                      </Dialog>
                    </>
                  )}
                  {user._id ? (
                    <Grid container sx={{ m: "30px 0 10px" }}>
                      <Grid item xs={6}>
                        <Button
                          variant="outlined"
                          style={{
                            width: "98%",
                            padding: "10px 0",
                          }}
                          onClick={() =>
                            user.designs.some((e) => e._id === design._id)
                              ? editing
                                ? saveChanges()
                                : editProduct()
                              : addremToWish()
                          }
                        >
                          {user.designs.some((e) => e._id === design._id) ? (
                            editing ? (
                              <>
                                <CheckCircleIcon /> Save Changes
                              </>
                            ) : (
                              <>
                                <EditIcon /> Edit
                              </>
                            )
                          ) : user.wishlist.some(
                              (e) => e._id === design._id
                            ) ? (
                            <>
                              <FavoriteIcon /> In the Wishlist
                            </>
                          ) : (
                            <>
                              <FavoriteBorderOutlinedIcon />
                              Add to Wishlist
                            </>
                          )}
                        </Button>
                      </Grid>
                      <Grid item xs={6}>
                        <Dialog open={open} onClose={() => setOpen(false)}>
                          <DialogTitle>
                            Are you sure you want to delete this?
                          </DialogTitle>
                          <DialogActions>
                            <Button onClick={() => setOpen(false)}>No</Button>
                            <Button
                              variant="contained"
                              onClick={deletePost}
                              autoFocus
                            >
                              Yes
                            </Button>
                          </DialogActions>
                        </Dialog>
                        <Button
                          variant="contained"
                          sx={{
                            width: "98%",
                            padding: "10px 0",
                          }}
                          onClick={() =>
                            user.designs.some((e) => e._id === design._id)
                              ? editing
                                ? setEditing(false)
                                : setOpen(true)
                              : addToCart()
                          }
                        >
                          {user.designs.some((e) => e._id === design._id) ? (
                            editing ? (
                              <>
                                <CancelIcon />
                                Cancel
                              </>
                            ) : (
                              <>
                                <DeleteIcon /> Delete
                              </>
                            )
                          ) : user.cart.some((e) => e._id === design._id) ? (
                            <>
                              <ShoppingCartOutlined /> Go to Cart
                            </>
                          ) : (
                            <>
                              <AddShoppingCartIcon /> Add to Cart
                            </>
                          )}
                        </Button>
                      </Grid>
                    </Grid>
                  ) : (
                    ""
                  )}
                </Grid>
              </Grid>
            </form>
          </div>
        </>
      )}
    </>
  );
};

export default DesignPage;
