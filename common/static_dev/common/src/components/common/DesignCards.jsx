import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import { useDispatch } from "react-redux";
import { addCart, addOrDeleteWishlist } from "../../redux/actions/userAction";
import { CircularProgress, Typography } from "@mui/material";
import DesignCard from "./DesignCard";
import DesignLoading from "./DesignLoading";

const DesignCards = ({ query = {}, heading = "", fetchFunc }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [designs, setDesigns] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const limit = 9;

  useEffect(() => {
    async function initiate() {
      try {
        setLoading(true);
        const response = await fetchFunc({
          limit: limit,
          offset: limit * (page - 1),
          ...query,
        });
        setDesigns([...designs, ...response.results]);
        setHasMore(response.next !== null);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    initiate();
  }, [page]);

  const addToCart = async (idx) => {
    if (designs[idx].cart_uid) {
      navigate("/cart");
    } else {
      setDesigns((prevState) => {
        const newState = [...prevState];
        newState[idx] = { ...prevState[idx], cartLoading: true };
        return newState;
      });
      const response = await dispatch(addCart(designs[idx].uid));
      setDesigns((prevState) => {
        const newState = [...prevState];
        newState[idx] = {
          ...prevState[idx],
          ...response.design,
          cartLoading: false,
        };
        return newState;
      });
    }
  };

  const addremToWish = async (idx) => {
    setDesigns((prevState) => {
      const newState = [...prevState];
      newState[idx] = { ...prevState[idx], wishlistLoading: true };
      return newState;
    });
    const response = await dispatch(addOrDeleteWishlist(designs[idx]));
    setDesigns((prevState) => {
      const newState = [...prevState];
      newState[idx] = {
        ...prevState[idx],
        ...response,
        wishlistLoading: false,
      };
      return newState;
    });
  };

  return (
    <div>
      {heading && designs.length ? (
        <Typography
          sx={{ color: "text.primary" }}
          variant="h6"
          className="mb-4"
        >
          {heading}
        </Typography>
      ) : (
        <></>
      )}

      <InfiniteScroll
        style={{ overflow: "hidden" }}
        dataLength={designs.length}
        next={() => setPage(page + 1)}
        hasMore={hasMore}
        loader={
          <div className="text-center mt-5">
            <CircularProgress style={{ color: "text.primary" }} />
          </div>
        }
        endMessage={
          loading ? (
            <></>
          ) : (
            <Typography variant="h5" className="mt-5 text-center">
              That&apos;s all we have for you!!
            </Typography>
          )
        }
      >
        <div className="row gy-5">
          {loading
            ? Array(6)
              .fill()
              .map((_, idx) => (
                <div key={idx} className="col-xl-4 col-lg-4 col-md-6 col-12">
                  <DesignLoading />
                </div>
              ))
            : designs.map((design, idx) => (
              <div
                key={design.uid}
                className="col-xl-4 col-lg-4 col-md-6 col-12"
              >
                <DesignCard
                  design={design}
                  wishlistFunc={() => addremToWish(idx)}
                  cartFunc={() => addToCart(idx)}
                />
              </div>
            ))}
        </div>
      </InfiniteScroll>
    </div>
  );
};

export default DesignCards;
