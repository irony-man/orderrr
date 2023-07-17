import {
 ActionTypes
} from "../constants/action-types";

export const alertMessage = (message) => {
 return {
  type: ActionTypes.ALERT,
  payload: message,
 };
};
