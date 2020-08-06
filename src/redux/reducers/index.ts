import {GlobalState} from "./GlobalState";
import {combineReducers} from "redux";
import CategoryReducer from "./CategoryReducer";

export default combineReducers<GlobalState>({
    categoriesState: CategoryReducer
})
