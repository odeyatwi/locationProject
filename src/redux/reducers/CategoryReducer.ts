import {Category} from "../../data/types/Category";
import {CategoryActions} from "../actions/ActionsTypes";
import {
    CHOSEN_CATEGORY,
    EDIT_CATEGORY_REQUEST,
    EDIT_CATEGORY_SUCCESS,
    UPDATE_CATEGORIES_ACTION,
    UPDATE_CATEGORIES_REQUEST
} from "../actions/types";

export interface CategoryState {
    categories: Category[],
    selectedIndex: number,
    loadingCategories: boolean,
    editLoading: boolean,
    editSuccessMessage?: string
}

const INIT_STATE: CategoryState = {
    categories: [],
    selectedIndex: -1,
    loadingCategories: false,
    editLoading: false,
}

export default (state: CategoryState = INIT_STATE, action: CategoryActions): CategoryState => {
    switch (action.type) {
        case UPDATE_CATEGORIES_ACTION:
            return {...state, categories: action.payload, loadingCategories: false, selectedIndex: -1}
        case UPDATE_CATEGORIES_REQUEST:
            return {...state, loadingCategories: true}
        case EDIT_CATEGORY_REQUEST:
            return {...state, editLoading: true, editSuccessMessage: undefined}
        case EDIT_CATEGORY_SUCCESS:
            return {...state, editLoading: false, editSuccessMessage: action.payload}
        case CHOSEN_CATEGORY:
            return {...state, selectedIndex: action.payload}
        default:
            return state
    }
};
