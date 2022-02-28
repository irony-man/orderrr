import {
 ActionTypes
} from "../constants/action-types";

export const allDesigns = (designs) => {
 return {
  type: ActionTypes.ALL_DESIGNS,
  payload: designs,
 };
};

export const removeDesign = (designid) => {
 return {
  type: ActionTypes.DELETE_PROFILE_DESIGN,
  payload: designid,
 };
};