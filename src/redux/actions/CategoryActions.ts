import {Category} from "../../data/types/Category";
import {createAsyncAction} from "typesafe-actions";
import {
    EDIT_CATEGORY_FAILED,
    EDIT_CATEGORY_REQUEST, EDIT_CATEGORY_SUCCESS,
    UPDATE_CATEGORIES_ACTION,
    UPDATE_CATEGORIES_FAILED,
    UPDATE_CATEGORIES_REQUEST
} from "./types";
import {AnyAction} from "redux";
import {ThunkDispatch} from "redux-thunk";
import {deleteCategoryFromDB, getAllCategoriesFromDB, saveCategoryToDB, updateCategory} from "../../data/CategoryDB";

export const updateCategories =
    createAsyncAction(
    UPDATE_CATEGORIES_REQUEST,
    UPDATE_CATEGORIES_ACTION,
    UPDATE_CATEGORIES_FAILED
)<void, Category[], Error>();

export const editCategoryAction =
    createAsyncAction(
        EDIT_CATEGORY_REQUEST,
        EDIT_CATEGORY_SUCCESS,
        EDIT_CATEGORY_FAILED
    )<void, string, Error>();

export function getAllCategories() {
    return async (dispatch: ThunkDispatch<{},{},AnyAction>) => {
        dispatch(updateCategories.request());
        try {
            const categories: Category[] = await getAllCategoriesFromDB();
            dispatch(updateCategories.success(categories));
        } catch (e) {
            dispatch(updateCategories.failure(e))
        }
    }
}

export function addCategory(name:string){
    return async (dispatch: ThunkDispatch<{},{},AnyAction>) => {
        dispatch(editCategoryAction.request());
        try {
            await saveCategoryToDB(name);
            dispatch(editCategoryAction.success('Category added successfully'));
            dispatch(getAllCategories())
        } catch (e) {
            dispatch(updateCategories.failure(e))
        }
    }
}

export function deleteCategory(id:string){
    return async (dispatch: ThunkDispatch<{},{},AnyAction>) => {
        dispatch(editCategoryAction.request());
        try {
            await deleteCategoryFromDB(id);
            dispatch(editCategoryAction.success('Category deleted'));
            dispatch(getAllCategories())
        } catch (e) {
            dispatch(updateCategories.failure(e))
        }
    }
}

export function editCategory(id:string,newName:string){
    return async (dispatch: ThunkDispatch<{},{},AnyAction>) => {
        dispatch(editCategoryAction.request());
        try {
            await updateCategory(id,newName);
            dispatch(editCategoryAction.success('Category update successfully'));
            dispatch(getAllCategories())
        } catch (e) {
            dispatch(updateCategories.failure(e))
        }
    }
}
