import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import "./Home.css";
import { useDispatch, useSelector } from "react-redux";
import {
  addCart,
  addWishlist,
  removeWishlist,
} from "../../../redux/actions/userAction";
import {
  CircularProgress,
  Avatar,
  Card,
  CardHeader,
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
import { allDesigns } from "../../../redux/actions/allDesignsAction";
import AddCart from "../../../utils/AddCart";
import { AddWish, removeWish } from "../../../utils/AddRemoveWish";
import Navbar from "../nav/Navbar";

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const designs = useSelector((state) => state.designs);
  const [page, setPage] = useState(Math.ceil(designs.length / 6) + 1);
  const [hasMore, setHasMore] = useState(false);
  useEffect(() => {
    axios
      .get(`/home?page=${page}`)
      .then((response) => {
        setHasMore(response.data.hasMore);
        dispatch(allDesigns(response.data.designs));
      })
      .catch((err) => {
        console.log(err);
      });
  }, [page]);
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
    } else {
      AddWish(id).then((res) => {
        if (res === false) {
        } else {
          dispatch(addWishlist([res]));
        }
      });
    }
  };
  const avatarLink = (id) => {
    //alert(id);
  };
  return (
    <>
      <title>Orderrr</title>
      <Navbar />
      <div style={{ margin: "0 1vw" }}>
        <InfiniteScroll
          style={{ overflow: "hidden" }}
          dataLength={designs.length}
          next={() => setPage(designs.length / 6 + 1)}
          hasMore={hasMore}
          loader={
            <div className="text-center mt-3">
              <CircularProgress style={{ color: "#513D2B" }} />
            </div>
          }
        >
          <div className="row m-0">
            {designs.map((design) => (
              <div key={design._id} className="col-md-4 col-sm-6 col-12 p-2">
                <Card>
                  <CardHeader
                    avatar={
                      <Avatar
                        onClick={() => avatarLink(design.owner._id)}
                        sx={{
                          ":hover": { cursor: "pointer" },
                          bgcolor: "#513D2B",
                        }}
                      >
                        {design.owner.username.charAt(0).toUpperCase()}
                      </Avatar>
                    }
                    title={design.owner.username}
                    subheader={design.created}
                  />
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
                      <b>₹{design.price}</b>
                    </p>
                    {(!user._id || user._id === design.owner._id) ? (
                      <></>
                    ) : (
                      <div>
                        <IconButton
                          sx={{ color: "#513D2B" }}
                          onClick={() => addremToWish(design._id)}
                        >
                          {user.wishlist.some((e) => e._id === design._id) ? (
                            <Tooltip title="Remove from wishlist!!">
                              <FavoriteIcon />
                            </Tooltip>
                          ) : (
                            <Tooltip title="Add to wishlist!!">
                              <FavoriteBorderOutlinedIcon />
                            </Tooltip>
                          )}
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
                    )}
                  </CardActions>
                </Card>
              </div>
            ))}
          </div>
        </InfiniteScroll>
      </div>
    </>
  );
};

export default Home;
