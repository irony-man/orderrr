import { ActionTypes } from "../constants/action-types";
import axios from "axios";

export const addressAction = () => {
  return (dispatch) => {
    dispatch({
      type: ActionTypes.LOADING,
      payload: true,
    });
    axios
      .get("/address")
      .then((response) => {
        dispatch({
          type: ActionTypes.LOADING,
          payload: false,
        });
        dispatch({
          type: ActionTypes.ADDRESS,
          payload: response.data,
        });
      })
      .catch((err) => {
        dispatch({
          type: ActionTypes.LOADING,
          payload: false,
        });
        dispatch({
          type: ActionTypes.ALERT,
          payload: {
            message: err.response.data.message,
            type: "error",
            open: true,
          },
        });
      });
  };
};

export const selectAddress = (id) =>{
  return {
    type: ActionTypes.SELECT_ADDRESS,
    payload: id,
  };
};

export const cardAction = () => {
  return (dispatch) => {
    dispatch({
      type: ActionTypes.LOADING,
      payload: true,
    });
    axios
      .get("/card")
      .then((response) => {
        dispatch({
          type: ActionTypes.LOADING,
          payload: false,
        });
        dispatch({
          type: ActionTypes.CARDS,
          payload: response.data,
        });
      })
      .catch((err) => {
        dispatch({
          type: ActionTypes.LOADING,
          payload: false,
        });
        dispatch({
          type: ActionTypes.ALERT,
          payload: {
            message: err.response.data.message,
            type: "error",
            open: true,
          },
        });
      });
  };
};

export const selectCard = (id) =>{
  return {
    type: ActionTypes.SELECT_CARD,
    payload: id,
  };
};
