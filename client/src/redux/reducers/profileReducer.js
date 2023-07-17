import { ActionTypes } from "../constants/action-types";

const initialState = {
  designs: [],
  picture: ""
};

export const profileReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case ActionTypes.SELECT_PROFILE:
      return payload;
    case ActionTypes.PROFILE_404:
      return {...state, notFound: true};
    case ActionTypes.DESELECT_PROFILE:
      return initialState;
    default:
      return state;
  }
};
