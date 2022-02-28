import { ActionTypes } from "../constants/action-types";

const intialState = {
  designs: [],
  cart: [],
  wishlist: [],
};

export const userLoggedReducer = (state = intialState, { type, payload }) => {
  switch (type) {
    case ActionTypes.USER_LOGGED:
      return {
        ...state,
        ...payload,
      };
    case ActionTypes.ADD_PROFILE_DESIGN:
      return {
        ...state,
        designs: [...state.designs, ...payload],
      };
    case ActionTypes.EDIT_PROFILE_DESIGN:
      const update = state.designs.filter((design) => {
        return design._id === payload.id;
      });
      update[0].title = payload.title;
      update[0].price = payload.price;
      update[0].description = payload.description;
      return {
        ...state,
        designs: [...state.designs, ...update],
      };
    case ActionTypes.DELETE_PROFILE_DESIGN:
      return {
        ...state,
        designs: state.designs.filter((design) => {
          return design._id !== payload;
        }),
        cart: state.cart.filter((design) => {
          return design._id !== payload;
        }),
        wishlist: state.wishlist.filter((design) => {
          return design._id !== payload;
        }),
      };
    case ActionTypes.ADD_CART:
      return {
        ...state,
        cart: [...state.cart, ...payload],
      };
    case ActionTypes.REMOVE_CART:
      return {
        ...state,
        cart: state.cart.filter((design) => {
          return design._id !== payload;
        }),
      };
    case ActionTypes.ADD_WISHLIST:
      return {
        ...state,
        wishlist: [...state.wishlist, ...payload],
      };
    case ActionTypes.REMOVE_WISHLIST:
      return {
        ...state,
        wishlist: state.wishlist.filter((design) => {
          return design._id !== payload;
        }),
      };
    case ActionTypes.REMOVE_USER:
      return intialState;
    default:
      return state;
  }
};
