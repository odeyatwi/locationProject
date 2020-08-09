import {Category} from "../../data/types/Category";
import {action, createAsyncAction} from "typesafe-actions";
import {
    CHOSEN_CATEGORY,
    EDIT_CATEGORY_REQUEST,
    EDIT_CATEGORY_SUCCESS,
    EDIT_CATEGORY_SUCCESS_CLEAN,
    HANDLE_ERROR,
    UPDATE_CATEGORIES_ACTION,
    UPDATE_CATEGORIES_REQUEST
} from "./types";
import {AnyAction} from "redux";
import {ThunkDispatch} from "redux-thunk";
import {
    deleteCategoryFromDB,
    getAllCategoriesFromDB,
    openCategoryDB,
    saveCategoryToDB,
    updateCategory
} from "../../data/CategoryDB";

export const chosenIndex = (index: number) => action(CHOSEN_CATEGORY, index);

export const clearMessage = () => action(EDIT_CATEGORY_SUCCESS_CLEAN);

export const updateCategories =
    createAsyncAction(
        UPDATE_CATEGORIES_REQUEST,
        UPDATE_CATEGORIES_ACTION,
        HANDLE_ERROR
    )<void, Category[], string>();

export const editCategoryAction =
    createAsyncAction(
        EDIT_CATEGORY_REQUEST,
        EDIT_CATEGORY_SUCCESS,
        HANDLE_ERROR
    )<void, string, string>();

export function getAllCategories() {
    return async (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
        try {
            dispatch(updateCategories.request());
            await openCategoryDB();
            const categories: Category[] = await getAllCategoriesFromDB();
            dispatch(updateCategories.success(categories));
        } catch (e) {
            dispatch(updateCategories.failure(e.message))
        }
    }
}

export function addCategory(name: string) {
    return async (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
        try {
            dispatch(editCategoryAction.request());
            await openCategoryDB()
            await saveCategoryToDB(name);
            dispatch(editCategoryAction.success('Category added successfully'));
            dispatch(getAllCategories());
        } catch(e){
            dispatch(editCategoryAction.failure(e.message))
        }
    }
}

export function deleteCategory(id: string) {
    return async (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
        try {
            dispatch(updateCategories.request());
            await deleteCategoryFromDB(id);
            dispatch(getAllCategories());
        } catch(e){
            dispatch(updateCategories.failure(e.message))
        }
    }
}

export function editCategory(id: string, newName: string) {
    return async (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
        try {
            dispatch(editCategoryAction.request());
            await updateCategory(id, newName);
            dispatch(editCategoryAction.success('Category update successfully'));
            dispatch(getAllCategories());
        } catch (e) {
            dispatch(editCategoryAction.failure(e.message))
        }
    }
}
