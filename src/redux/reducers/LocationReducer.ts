import {LocationActions} from "../actions/ActionsTypes";
import {Location} from "../../data/types/Location";
import {GroupList} from "../../data/types/GroupList";
import {
    DELETE_LOCATION_REQUEST, DELETE_LOCATION_SUCCESS,
    EDIT_LOCATION_REQUEST, EDIT_LOCATION_SUCCESS, EDIT_LOCATION_SUCCESS_CLEAN,
    UPDATE_CHOSEN_LOCATION, UPDATE_LOCATION_ACTION,
    UPDATE_LOCATION_GROUP_BY,
    UPDATE_LOCATION_REGULAR
} from "../actions/types";


export interface LocationState {
    locations: Location[];
    locationGroup: GroupList[];
    chosenLocationId: string;
    chosenLocationCategoryGroup: string;
    needUpdateLocation: boolean;
    successMessage?: string;
    isLoading: boolean;
}

const INIT_STATE: LocationState = {
    locations: [],
    locationGroup: [],
    chosenLocationId: '',
    chosenLocationCategoryGroup: '',
    needUpdateLocation: true,
    isLoading: false,
}
/*export const UPDATE_LOCATION_REGULAR = 'update location regular';
export const UPDATE_LOCATION_ACTION = 'update location action';
export const UPDATE_LOCATION_GROUP_BY = 'update location group by';
export const UPDATE_CHOSEN_LOCATION = 'update chosen location';
export const EDIT_LOCATION_SUCCESS_CLEAN = 'edit location success clear';
export const EDIT_LOCATION_REQUEST = 'edit location request';
export const EDIT_LOCATION_SUCCESS = 'edit location success';
export const DELETE_LOCATION_REQUEST = 'delete location request';
export const DELETE_LOCATION_SUCCESS = 'delete location success';*/
export default (state: LocationState = INIT_STATE, action: LocationActions): LocationState => {
    switch (action.type) {
        case UPDATE_LOCATION_REGULAR:
            return {
                ...INIT_STATE,
                locationGroup: state.locationGroup,
                locations: action.payload,
            };
        case UPDATE_LOCATION_GROUP_BY:
            return {
                ...INIT_STATE,
                locations: state.locations,
                locationGroup: action.payload,
            };
        case UPDATE_CHOSEN_LOCATION:
            return {
                ...state,
                chosenLocationCategoryGroup: action.payload.categoryId,
                chosenLocationId: action.payload.id
            };
        case EDIT_LOCATION_REQUEST:
        case DELETE_LOCATION_REQUEST:
        case UPDATE_LOCATION_ACTION:
            return { ...state, isLoading: true,needUpdateLocation: false};
        case EDIT_LOCATION_SUCCESS:
            return {...state, successMessage:action.payload, isLoading: false, needUpdateLocation: true};
        case DELETE_LOCATION_SUCCESS:
            return {...state, isLoading: false, needUpdateLocation: true};
        case EDIT_LOCATION_SUCCESS_CLEAN:
            return {...state,successMessage: undefined};
        default:
            return state;
    }
};
