import {
  Box,
  Button,
  CircularProgress,
  Grid,
  Typography,
  Rating,
  IconButton,
  Tooltip,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../nav/Navbar";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import ShoppingCartOutlined from "@mui/icons-material/ShoppingCartOutlined";
import { Link, useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { isMobile } from "react-device-detect";
import AddCart from "../../../utils/AddCart";
import {
  addCart,
  addWishlist,
  deleteProfileDesign,
  editProfileDesign,
  removeWishlist,
} from "../../../redux/actions/userAction";
import { AddWish, removeWish } from "../../../utils/AddRemoveWish";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";

const DesignPage = () => {
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [design, setDesign] = useState({});
  const [loading, setLoading] = useState(true);
  const [isMore, setIsMore] = useState(false);
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const id = window.location.pathname.split("/").pop();
    axios
      .get(`/product/${id}`)
      .then((response) => {
        setDesign(response.data);
        setLoading(false);
      })
      .catch((err) => {
        if (err.response.status === 500) {
          alert("rrrr");
        }
      });
  }, []);
  const toggleMore = () => {
    setIsMore(!isMore);
  };
  const addToCart = () => {
    if (user.cart.some((e) => e._id === design._id)) {
      navigate("/cart");
    } else {
      AddCart(design._id).then((res) => {
        if (res === false) {
        } else {
          dispatch(addCart([res]));
        }
      });
    }
  };
  const addremToWish = () => {
    if (user.wishlist.some((e) => e._id === design._id)) {
      removeWish(design._id).then((res) => {
        if (res) {
          dispatch(removeWishlist(design._id));
        }
      });
    } else {
      AddWish(design._id).then((res) => {
        if (res === false) {
        } else {
          dispatch(addWishlist([res]));
        }
      });
    }
  };
  const editProduct = () => {
    setEditing(true);
    setTitle(design.title);
    setPrice(design.price);
    setDescription(design.description);
  };
  const saveChanges = () => {
    axios
      .patch("/designadd", { title, price, description, id: design._id })
      .then((response) => {
        if (response.data === 1) {
          setEditing(false);
          design.title = title;
          design.description = description;
          design.price = price;
          dispatch(
            editProfileDesign({ title, price, description, id: design._id })
          );
        } else {
          alert(response.data.message);
        }
      });
  };
  const deletePost = () => {
    setOpen(false);
    axios
      .delete("/designadd", { data: { id: design._id } })
      .then((response) => {
        if(response.data===1) {
          dispatch(deleteProfileDesign(design._id));
          navigate("/");
        }
      });
  };
  return (
    <>
      <title>{design.title} | Orderrr</title>
      <Navbar />
      {loading ? (
        <Grid container justifyContent={"center"}>
          <CircularProgress sx={{ color: "#513d2b" }} />
        </Grid>
      ) : (
        <>
          <div
            className="design-page"
            style={{ color: "#513d2b", margin: "0 7vw" }}
          >
            <Grid container spacing={3} alignItems="flex-start">
              <Grid lg={"auto"} sm={12} item container justifyContent="center">
                <img
                  src={design.image.full}
                  style={{
                    maxHeight: "calc(100vh - 150px)",
                    width: "fit",
                    maxWidth: "100%",
                    border: "2px solid #513d2b",
                    borderRadius: "20px",
                  }}
                />
              </Grid>
              <Grid lg sm={12} item flexGrow={1}>
                <Typography variant="h4">
                  <b>Product Description</b>
                </Typography>

                {editing ? (
                  <textarea
                    style={{ margin: "20px 0 10px" }}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    rows="1"
                  />
                ) : (
                  <Typography variant="h5" sx={{ mt: "20" }}>
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
                    {
                      //<Link style={{ color: "#513d2b", marginLeft: 5 }} to={`/profile/${design.owner._id}`} >
                    }
                    <b style={{ marginLeft: 5 }}>{design.owner.username}</b>
                    {
                      //</Link>
                    }
                  </Typography>
                  <Typography>
                    <LocalOfferIcon fontSize="small" /> {design.type}
                  </Typography>
                </Grid>
                <Grid
                  container
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ mt: 3 }}
                >
                  {editing ? (
                    <input
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="Price"
                    ></input>
                  ) : (
                    <Typography variant="h4">₹{design.price}</Typography>
                  )}
                  <Rating
                    name="half-rating"
                    defaultValue={4.5}
                    precision={0.5}
                    readOnly
                    sx={{ color: "#513d2b" }}
                  />
                </Grid>
                {editing ? (
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Description"
                    rows={7}
                  ></textarea>
                ) : (
                  <Typography
                    className="cart-items"
                    variant="subtitle1"
                    sx={{
                      mt: 3,
                      height: isMobile
                        ? "calc(100vh - 150px)"
                        : "calc(100vh - 370px)",
                      overflowY: "scroll",
                    }}
                  >
                    {isMore
                      ? design.description
                      : design.description.slice(0, 700)}
                    <span onClick={toggleMore} style={{ cursor: "pointer" }}>
                      <b>
                        {design.description.length >= 700
                          ? isMore
                            ? "...Read Less"
                            : "...Read More"
                          : ""}
                      </b>
                    </span>
                  </Typography>
                )}
                {user._id ? (
                  <Grid container sx={{ m: "30px 0 10px" }}>
                    <Grid item xs={6}>
                      <Button
                        style={{
                          color: "#513d2b",
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
                        ) : user.wishlist.some((e) => e._id === design._id) ? (
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
                        <DialogTitle
                          id="alert-dialog-title"
                          sx={{ color: "#513d2b" }}
                        >
                          Are you sure you want to delete this?
                        </DialogTitle>
                        <DialogActions>
                          <Button
                            style={{ color: "#513d2b", marginRight: "10px" }}
                            onClick={() => setOpen(false)}
                          >
                            No
                          </Button>
                          <Button
                            style={{ color: "#fff", background: "#513d2b" }}
                            onClick={deletePost}
                            autoFocus
                          >
                            Yes
                          </Button>
                        </DialogActions>
                      </Dialog>
                      <Button
                        style={{
                          color: "white",
                          background: "#513d2b",
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
          </div>
        </>
      )}
    </>
  );
};

export default DesignPage;
