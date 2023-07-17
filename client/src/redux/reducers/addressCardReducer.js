import { ActionTypes } from "../constants/action-types";

const initialState = {
 all: [],
 selected: {}
}

export const addressReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case ActionTypes.ADDRESS:
      return {...state , all:payload};
    case ActionTypes.SELECT_ADDRESS:
      return {...state, selected: state.all.filter((e) => e._id === payload)};
    default:
      return state;
  }
};

export const cardReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case ActionTypes.CARDS:
     return {...state , all: payload};
    case ActionTypes.SELECT_CARD:
     return {...state, selected: state.all.filter((e) => e._id === payload)};
    default:
      return state;
  }
};
