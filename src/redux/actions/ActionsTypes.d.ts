import {Action, AnyAction} from 'redux';
import {ActionType} from 'typesafe-actions'
import * as errorActions from './ErrorActions'
import * as categoriesActions from './CategoryActions'
import {ThunkDispatch} from "redux-thunk";


export type CategoryActions = ActionType<typeof categoriesActions>

export type ErrorActions = ActionType<typeof errorActions>

export type RootAction = CategoryActions | ErrorActions |AnyAction

export type anyDispatch = ThunkDispatch<{}, {}, Action>
