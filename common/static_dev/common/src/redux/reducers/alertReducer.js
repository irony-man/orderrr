import { ActionTypes } from "../constants/action-types";

export const alertReducer = (state = {}, { type, payload }) => {
  switch (type) {
  case ActionTypes.ALERT:
    return payload;
  default:
    return state;
  }
};
