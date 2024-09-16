import { ActionTypes } from "../constants/action-types";

const initialState = {
  cart_length: 0,
  theme: localStorage.getItem("theme") || "system",
  is_logged: false,
};

export const userReducer = (state = initialState, { type, payload }) => {
  switch (type) {
  case ActionTypes.USER:
    return {
      ...state,
      ...payload,
    };
  case ActionTypes.ADD_CART:
    return {
      ...state,
      cart_length: state.cart_length + 1
    };
  case ActionTypes.REMOVE_CART:
    return {
      ...state,
      cart_length: state.cart_length - 1
    };
  case ActionTypes.THEME:
    return { ...state, theme: payload };
  case ActionTypes.REMOVE_USER:
    return { ...initialState, theme: state.theme };
  default:
    return state;
  }
};
