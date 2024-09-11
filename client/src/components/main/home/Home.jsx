import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import { useDispatch, useSelector } from "react-redux";
import { addCart, addremWishlist } from "../../../redux/actions/userAction";
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
import { fetchDesigns } from "../../../redux/actions/allDesignsAction";

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const designs = useSelector((state) => state.allDesigns.designs);
  const hasMore = useSelector((state) => state.allDesigns.hasMore);
  const [page, setPage] = useState(Math.ceil(designs.length / 8) + 1);
  useEffect(() => {
    if (hasMore === true) {
      dispatch(fetchDesigns(page));
    }
  }, [page]);

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
      <title>Orderrr</title>
      <div style={{ margin: "0 1vw" }}>
        <InfiniteScroll
          style={{ overflow: "hidden" }}
          dataLength={designs.length}
          next={() => setPage(page + 1)}
          hasMore={hasMore}
          loader={
            <div className="text-center mt-3">
              <CircularProgress style={{ color: "text.primary" }} />
            </div>
          }
        >
          <div className="row m-0">
            {designs.map((design) => (
              <div key={design._id} className="col-xl-3 col-md-4 col-sm-6 col-12 p-2">
                <Card>
                  <CardHeader
                    avatar={
                      <Avatar
                        src={design.owner.picture.link}
                        component={Link}
                        to={`/profile${
                          design.owner._id === user._id ||
                          design.owner === user._id
                            ? ""
                            : "/" + design.owner._id
                        }`}
                        sx={{
                          ":hover": { color: "background.paper" },
                        }}
                      />
                    }
                    title={
                      <Typography
                        variant="body1"
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
                        }}
                      >
                        {design.owner.username}
                      </Typography>
                    }
                    subheader={design.created}
                  />
                  <Link
                    to={`/product/${design._id}?ref=home`}
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
                        variant="h5"
                        gutterBottom
                        noWrap={true}
                        color="text.primary"
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
                      <b>₹{design.price}</b>
                    </p>
                    {!user._id || user._id === design.owner._id ? (
                      <></>
                    ) : (
                      <div>
                        <IconButton
                          sx={{ color: "text.primary" }}
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
