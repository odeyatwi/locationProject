import {ErrorActions} from "../actions/ActionsTypes";
import {DISMISS_ERROR, HANDLE_ERROR} from "../actions/types";


export interface ErrorState {
    error?: string
}

const INIT_STATE: ErrorState = {}

export default (state: ErrorState = INIT_STATE, action: ErrorActions): ErrorState => {
    switch (action.type) {
        case HANDLE_ERROR:
            return {...state, error: action.payload};
        case DISMISS_ERROR:
            return INIT_STATE;
        default:
            return state;
    }
};
