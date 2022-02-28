import {
 combineReducers
} from "redux";
import {
 userLoggedReducer
} from "./userReducer";
import {
 allDesignsReducer
} from "./allDesignsReducer";

const reducers = combineReducers({
 user: userLoggedReducer,
 designs: allDesignsReducer,
});

export default reducers;