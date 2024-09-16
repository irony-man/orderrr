import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addCart } from "../../../redux/actions/userAction";
import { Grid, Typography, Button, CircularProgress } from "@mui/material";
import apis from "../../../redux/actions/apis";
import { alertMessage } from "../../../redux/actions/alertsAction";
import DesignCard from "../../common/DesignCard";

const WishList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    async function initiate() {
      try {
        setLoading(true);
        const response = await apis.listWishlist();
        setWishlist([...response.results]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    initiate();
  }, []);

  const addToCart = async (idx) => {
    const design = wishlist[idx].design;
    if (design.cart_uid) {
      navigate("/cart");
    } else {
      setWishlist((prevState) => {
        const newState = [...prevState];
        newState[idx].design = { ...prevState[idx].design, cartLoading: true };
        return newState;
      });
      const response = await dispatch(addCart(design.uid));
      setWishlist((prevState) => {
        const newState = [...prevState];
        newState[idx].design = {
          ...prevState[idx].design,
          ...response.design,
          cartLoading: false,
        };
        return newState;
      });
    }
  };

  const remove = async (uid) => {
    try {
      setLoading(true);
      await apis.deleteWishlist(uid);

      setWishlist((prevState) => {
        return prevState.filter(w => w.uid !== uid);
      });
      // const response = await apis.listWishlist();
      // setWishlist([...response.results]);
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

  return loading ? (
    <Grid container justifyContent={"center"}>
      <CircularProgress sx={{ color: "text.primary" }} />
    </Grid>
  ) : (
    <>
      <title>
        Cart {wishlist.length === 0 ? "" : `(${wishlist.length})`} | Orderrr
      </title>
      <div className="container">
        {wishlist.length === 0 ? (
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
        ) : (
          <div className="row m-0">
            {wishlist.map(({ design, uid }, idx) => (
              <div key={uid} className="col-xl-4 col-lg-4 col-md-6 col-12">
                <DesignCard
                  design={design}
                  wishlistFunc={() => remove(uid)}
                  cartFunc={() => addToCart(idx)}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default WishList;
