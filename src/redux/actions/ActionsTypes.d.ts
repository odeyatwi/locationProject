import {Action, AnyAction} from 'redux';
import {ActionType} from 'typesafe-actions'
import * as categoriesActions from './CategoryActions'
import {ThunkDispatch} from "redux-thunk";


export type CategoryActions = ActionType<typeof categoriesActions>

export type RootAction = CategoryActions | AnyAction

export type anyDispatch = ThunkDispatch<{}, {}, Action>
