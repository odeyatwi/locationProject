import {Action, AnyAction} from "redux";
import {ActionType} from "typesafe-actions";
import * as errorActions from "./ErrorActions";
import * as categoriesActions from "./CategoryActions";
import * as navigationActions from "./NavigationActions";
import {ThunkDispatch} from "redux-thunk";


export type ErrorActions = ActionType<typeof errorActions>;

export type CategoryActions = ActionType<typeof categoriesActions> | ErrorActions;

export type NavigationActions = ActionType<typeof navigationActions> | ErrorActions;

export type RootAction = CategoryActions | ErrorActions | NavigationActions | AnyAction;

export type anyDispatch = ThunkDispatch<{}, {}, Action>;
