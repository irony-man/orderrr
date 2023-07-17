import { ActionTypes } from "../constants/action-types";

const initialState = {
  image: {
    full: "",
  },
  notFound: false,
  owner: {
    _id: "",
    username: "",
  },
  description: "",
  _id: "",
  type: "",
  title: "",
  price: 0,
  created: "",
};

export const designReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case ActionTypes.SELECT_DESIGN:
      return payload;
    case ActionTypes.DESIGN_404:
      return {...state, notFound: true};
    case ActionTypes.EDIT_DESIGN:
      return {
        ...state,
        title: payload.title,
        description: payload.description,
        price: payload.price,
      };
    default:
      return state;
  }
};
