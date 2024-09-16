import {
  ActionTypes
} from "../constants/action-types";
import { HttpBadRequestError } from "../network";
import apis from "./apis";

export const setUser = (user) => {
  return (dispatch) => {
    dispatch({
      type: ActionTypes.USER,
      payload: {...user, is_logged: true},
    });
  };
};

export const userLogged = () => {
  return async (dispatch) => {
    dispatch({
      type: ActionTypes.LOADING,
      payload: true,
    });
    const user = await apis.getUser();
    dispatch(setUser(user));
    localStorage.setItem('isLogged', true);
    dispatch({
      type: ActionTypes.LOADING,
      payload: false,
    });
  };
};


export const addCart = (uid) => {
  return async (dispatch) => {
    try {
      const response = await apis.createCart({design: uid});
      dispatch({
        type: ActionTypes.ADD_CART,
      });
      dispatch({
        type: ActionTypes.ALERT,
        payload: {
          message: "Design added to cart.",
          type: "success",
          open: true
        }
      });
      return response;
    } catch (error) {
      console.error(error);
      let message = "Error adding design to cart.";
      if(error instanceof HttpBadRequestError) {
        message = error.data?.design;
      }
      dispatch({
        type: ActionTypes.ALERT,
        payload: {
          message: message,
          type: "error",
          open: true
        }
      });
    }
  };
};

export const removeCart = () => {
  return (dispatch) => {
    dispatch({
      type: ActionTypes.REMOVE_CART,
    });
  };
};

export const addOrDeleteWishlist = (design) => {
  return async (dispatch) => {
    try {
      const response = await apis.createOrDeleteWishlist({uid: design.wishlist_uid, formData: {design: design.uid}});
      dispatch({
        type: ActionTypes.ALERT,
        payload: {
          message: design.wishlist_uid ? "Design removed from Wishlist.": "Design wishlisted.",
          type: "success",
          open: true
        }
      });
      if (design.wishlist_uid) {
        return {...design, wishlist_uid: null};
      } else {
        return {...response.design};
      }
    } catch (error) {
      console.error(error);
      let message = design.wishlist_uid ? "Error removing desing from wishlist.": "Error adding design to wishlist.";
      if(error instanceof HttpBadRequestError) {
        message = error.data?.design;
      }
      dispatch({
        type: ActionTypes.ALERT,
        payload: {
          message: message,
          type: "error",
          open: true
        }
      });
    }
  };
};

export const changeTheme = (theme) => {
  localStorage.setItem('theme', theme);
  return (dispatch) => {
    dispatch({
      type: ActionTypes.THEME,
      payload: theme
    });
  };
};

export const removeUser = () => {
  return {
    type: ActionTypes.REMOVE_USER,
  };
};
