import {CategoryState} from "./CategoryReducer";
import {ErrorState} from "./ErrorReducer";
import {NavigationState} from "./NavigationReducer";

export interface GlobalState {
    categoriesState: CategoryState,
    errors: ErrorState,
    navigation: NavigationState
}
