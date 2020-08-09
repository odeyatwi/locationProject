import {RootAction} from "./actions/ActionsTypes";
import {Dispatch, Middleware} from "redux";
import {GlobalState} from "./reducers/GlobalState";
import {handleError} from "./actions/ErrorActions";

export const errorHandler = (_:Middleware<{}, GlobalState>) => (next:Dispatch) => (action:RootAction) => {
    try {
        return next(action)
    } catch (err) {
        console.log('Caught an exception!', err)
        next(handleError(err.message))
    }
}
