import axios from "axios";
import { ActionTypes } from "../constants/action-types";

export const getProfile = (id) => {
  return (dispatch) => {
    dispatch({
      type: ActionTypes.LOADING,
      payload: true,
    });
    axios
      .get(`/account/${id}`)
      .then((response) => {
        dispatch({
          type: ActionTypes.LOADING,
          payload: false,
        });
        dispatch({
          type: ActionTypes.SELECT_PROFILE,
          payload: response.data,
        });
      })
      .catch((err) => {
        dispatch({
          type: ActionTypes.LOADING,
          payload: false,
        });
        dispatch({
          type: ActionTypes.PROFILE_404,
          payload: err.response.data,
        });
      });
  };
};

export const removeProfile = (profile) => {
  return (dispatch) => {
    dispatch({
      type: ActionTypes.DESELECT_PROFILE,
      payload: profile,
    });
  };
};
