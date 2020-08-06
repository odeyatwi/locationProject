import {Category} from "../../data/types/Category";
import {CategoryActions} from "../actions/ActionsTypes";
import {
    EDIT_CATEGORY_FAILED, EDIT_CATEGORY_REQUEST, EDIT_CATEGORY_SUCCESS,
    UPDATE_CATEGORIES_ACTION,
    UPDATE_CATEGORIES_FAILED,
    UPDATE_CATEGORIES_REQUEST
} from "../actions/types";

export interface CategoryState {
    categories: Category[],
    selectedIndex: number,
    loadingCategories: boolean,
    editLoading: boolean,
    error?: string,
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
            return {...state, categories: action.payload, error: undefined, loadingCategories: false}
        case UPDATE_CATEGORIES_FAILED:
        case EDIT_CATEGORY_FAILED:
            return {
                ...state,
                error: action.payload.message,
                loadingCategories: false,
                editLoading: false,
                editSuccessMessage: undefined
            }
        case UPDATE_CATEGORIES_REQUEST:
            return {...state, error: undefined, loadingCategories: true}
        case EDIT_CATEGORY_REQUEST:
            return {...state, error: undefined, editLoading: true, editSuccessMessage: undefined}
        case EDIT_CATEGORY_SUCCESS:
            return {...state, editLoading: false, editSuccessMessage: action.payload}
        default:
            return state
    }
};
