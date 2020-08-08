import {NavigationActions} from "../actions/ActionsTypes";
import {SCREEN_NAME, UPDATE_TOP_BAR_ACTIONS} from "../actions/types";

export interface TopBarAction {
    icon: string,
    onPress: () => void
}

export interface NavigationState {
    currentScreenName: string,
    topBarTitle: string,
    rightActions: TopBarAction[],
    leftActions: TopBarAction[]
}

const INIT_STATE: NavigationState = {
    currentScreenName:'',
    topBarTitle: '',
    rightActions: [],
    leftActions: []
}

export default (state: NavigationState = INIT_STATE, action: NavigationActions): NavigationState => {
    switch (action.type) {
        case SCREEN_NAME:
            return {...state, currentScreenName: action.payload}
        case UPDATE_TOP_BAR_ACTIONS:
            return { ...state,
                topBarTitle: action.payload.name,
                rightActions: action.payload.rightActions,
                leftActions: action.payload.leftActions
            }
        default:
            return state
    }
};
