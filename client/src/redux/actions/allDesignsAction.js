import axios from "axios";
import {
  ActionTypes
} from "../constants/action-types";

export const fetchDesigns = (page) => {
  return (dispatch) => {
    axios
      .get(`/home?page=${page}&limit=8`)
      .then((response) => {
        dispatch({
          type: ActionTypes.ALL_DESIGNS,
          payload: response.data,
        });
      })
      .catch((err) => {
        dispatch({
          type: ActionTypes.ALERT,
          payload: {
            message: "Something went wrong!!",
            type: "error",
            open: true,
          }
        });
      });
  };
};

export const removeDesign = (id) => {
  return {
    type: ActionTypes.DELETE_DESIGN,
    payload: id,
  };
};