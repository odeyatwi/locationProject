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
    isLoadingEdit: boolean;
}

const INIT_STATE: LocationState = {
    locations: [],
    locationGroup: [],
    chosenLocationId: '',
    chosenLocationCategoryGroup: '',
    needUpdateLocation: true,
    isLoading: false,
    isLoadingEdit: false
}
export default (state: LocationState = INIT_STATE, action: LocationActions): LocationState => {
    switch (action.type) {
        case UPDATE_LOCATION_REGULAR:
            return {
                ...INIT_STATE,
                successMessage: state.successMessage,
                needUpdateLocation: false,
                locationGroup: state.locationGroup,
                locations: action.payload,
            };
        case UPDATE_LOCATION_GROUP_BY:
            return {
                ...INIT_STATE,
                successMessage: state.successMessage,
                needUpdateLocation: false,
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
            console.log('update/edit location success')
            return { ...state, isLoadingEdit: true,needUpdateLocation: false};
        case UPDATE_LOCATION_ACTION:
            return { ...state, isLoading: true,needUpdateLocation: false};
        case EDIT_LOCATION_SUCCESS:
            console.log('edit location success')
            return {...state, successMessage:action.payload, isLoadingEdit: false, needUpdateLocation: true};
        case DELETE_LOCATION_SUCCESS:
            console.log('delete location success')
            return {...state, isLoadingEdit: false, needUpdateLocation: true};
        case EDIT_LOCATION_SUCCESS_CLEAN:
            console.log('edit location success dismiss')
            return {...state,successMessage: undefined};
        default:
            return state;
    }
};
