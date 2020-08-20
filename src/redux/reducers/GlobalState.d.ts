import {CategoryState} from "./CategoryReducer";
import {ErrorState} from "./ErrorReducer";
import {NavigationState} from "./NavigationReducer";
import {LocationState} from "./LocationReducer";

export interface GlobalState {
    categoriesState: CategoryState,
    errors: ErrorState,
    navigation: NavigationState,
    locations: LocationState
}
