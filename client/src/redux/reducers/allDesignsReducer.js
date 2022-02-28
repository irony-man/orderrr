import { ActionTypes } from "../constants/action-types";

export const allDesignsReducer = (state = [], { type, payload }) => {
  switch (type) {
    case ActionTypes.ALL_DESIGNS:
      return [...state, ...payload];
    case ActionTypes.DELETE_PROFILE_DESIGN:
      return state.filter((design) => {
        return design._id !== payload;
      });
    default:
      return state;
  }
};
