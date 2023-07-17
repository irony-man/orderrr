import { combineReducers } from "redux";
import { userLoggedReducer } from "./userReducer";
import { allDesignsReducer } from "./allDesignsReducer";
import { designReducer } from "./designReducer";
import { alertReducer } from "./alertReducer";
import { loadingReducer } from "./loadingReducer";
import { profileReducer } from "./profileReducer";
import { addressReducer, cardReducer } from "./addressCardReducer";

const reducers = combineReducers({
  user: userLoggedReducer,
  allDesigns: allDesignsReducer,
  design: designReducer,
  profile: profileReducer,
  alert: alertReducer,
  loading: loadingReducer,
  address: addressReducer,
  cards: cardReducer
});

export default reducers;
