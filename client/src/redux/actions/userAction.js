import {
 ActionTypes
} from "../constants/action-types";

export const userLogged = (user) => {
 return {
  type: ActionTypes.USER_LOGGED,
  payload: user,
 };
};

export const addProfileDesign = (design) => {
 return {
  type: ActionTypes.ADD_PROFILE_DESIGN,
  payload: design,
 };
};

export const editProfileDesign = (design) => {
 return {
  type: ActionTypes.EDIT_PROFILE_DESIGN,
  payload: design,
 };
};

export const deleteProfileDesign = (designid) => {
 return {
  type: ActionTypes.DELETE_PROFILE_DESIGN,
  payload: designid,
 };
};

export const addCart = (design) => {
 return {
  type: ActionTypes.ADD_CART,
  payload: design,
 };
};

export const removeCart = (designid) => {
 return {
  type: ActionTypes.REMOVE_CART,
  payload: designid,
 };
};

export const addWishlist = (design) => {
 return {
  type: ActionTypes.ADD_WISHLIST,
  payload: design,
 };
};
export const removeWishlist = (designid) => {
 return {
  type: ActionTypes.REMOVE_WISHLIST,
  payload: designid,
 };
};

export const removeUser = () => {
 return {
  type: ActionTypes.REMOVE_USER,
 };
};
