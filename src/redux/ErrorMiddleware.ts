import {RootAction} from "./actions/ActionsTypes";
import {Dispatch, MiddlewareAPI} from "redux";
import {GlobalState} from "./reducers/GlobalState";
import {handleError} from "./actions/ErrorActions";

export const errorHandler = (store:MiddlewareAPI<Dispatch,GlobalState>) => (next:Dispatch) => (action:RootAction) => {
    try {
        return next(action)
    } catch (err) {
        console.error('Caught an exception!', err)
        store.dispatch(handleError(err.message))
    }
}
