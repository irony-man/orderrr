import axios from "axios";
import { ActionTypes } from "../constants/action-types";

export const getDesign = (id) => {
  return (dispatch) => {
    dispatch({
      type: ActionTypes.LOADING,
      payload: true,
    });
    axios
      .get(`/design/${id}`)
      .then((response) => {
        dispatch({
          type: ActionTypes.LOADING,
          payload: false,
        });
        dispatch({
          type: ActionTypes.SELECT_DESIGN,
          payload: response.data,
        });
      })
      .catch((err) => {
        dispatch({
          type: ActionTypes.LOADING,
          payload: false,
        });
        dispatch({
          type: ActionTypes.DESIGN_404,
          payload: err.response.data,
        });
      });
  };
};

export const setDesign = ({ design, id }) => {
  return (dispatch) => {
    if (!design) {
      dispatch(getDesign(id));
    } else {
      dispatch({
        type: ActionTypes.LOADING,
        payload: true,
      });
      dispatch({
        type: ActionTypes.SELECT_DESIGN,
        payload: design,
      });
      dispatch({
        type: ActionTypes.LOADING,
        payload: false,
      });
    }
  };
};
