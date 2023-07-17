import {
  ActionTypes
} from "../constants/action-types";

const initialState = {
  designs: [],
  hasMore: true,
};

export const allDesignsReducer = (state = initialState, {
  type,
  payload
}) => {
  switch (type) {
    case ActionTypes.ALL_DESIGNS:
      return {
        hasMore: payload.hasMore,
          designs: [...state.designs, ...payload.designs],
      };
    case ActionTypes.DELETE_DESIGN:
      return {
        ...state,
        designs: state.designs.filter((design) => {
          return design._id !== payload
        })
      };

    default:
      return state;
  }
};