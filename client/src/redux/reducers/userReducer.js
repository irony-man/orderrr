import {
  ActionTypes
} from "../constants/action-types";

const initialState = {
  designs: [],
  cart: [],
  wishlist: [],
  picture: {
    link:""
  },
  theme: localStorage.getItem('theme') || "system"
};

export const userLoggedReducer = (state = initialState, {
  type,
  payload
}) => {
  let update = state.designs.filter(design => design._id === payload.id);
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
    case ActionTypes.EDIT_DESIGN:
      update[0].title = payload.title;
      update[0].price = payload.price;
      update[0].description = payload.description;
      return {
        ...state,
        designs: [...state.designs, ...update],
      };
    case ActionTypes.DELETE_DESIGN:
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
    case ActionTypes.THEME:
      return {...state, theme: payload};
      case ActionTypes.EDIT_PROFILE:
        return {
          ...state, picture: {link: payload.picture}, email: payload.email, username: payload.name
        }
    case ActionTypes.REMOVE_USER:
      return {...initialState, theme: state.theme};
    default:
      return state;
  }
};