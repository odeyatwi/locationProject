import {GlobalState} from "./GlobalState";
import {combineReducers} from "redux";
import CategoryReducer from "./CategoryReducer";
import ErrorReducer from "./ErrorReducer";
import NavigationReducer from "./NavigationReducer";

export default combineReducers<GlobalState>({
    categoriesState: CategoryReducer,
    errors: ErrorReducer,
    navigation: NavigationReducer
});
