import { ActionTypes } from "../constants/action-types";

const initialState ={
}

export const loadingReducer = (state = false, { type, payload }) => {
  switch (type) {
    case ActionTypes.LOADING:
      return payload;
    default:
      return state;
  }
};
