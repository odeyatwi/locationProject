import {Category} from "../../data/types/Category";
import {action, createAsyncAction} from "typesafe-actions";
import {
    UPDATE_CHOSEN_LOCATION,
    EDIT_LOCATION_REQUEST,
    EDIT_LOCATION_SUCCESS,
    EDIT_LOCATION_SUCCESS_CLEAN,
    UPDATE_LOCATION_GROUP_BY,
    UPDATE_LOCATION_REGULAR, UPDATE_LOCATION_ACTION, DELETE_LOCATION_REQUEST, DELETE_LOCATION_SUCCESS
} from "./types";
import {AnyAction} from "redux";
import {ThunkDispatch} from "redux-thunk";
import {Location} from "../../data/types/Location";
import {GroupList} from "../../data/types/GroupList";
import {
    deleteLocationFromDB,
    getAllLocationsFromDB,
    openLocationTable,
    saveLocationToDB,
    updateLocation
} from "../../data/LocationDB";

export const locationChosenIndex = (id: string, categoryId: string) => action(UPDATE_CHOSEN_LOCATION, {id, categoryId});

export const clearLocationMessage = () => action(EDIT_LOCATION_SUCCESS_CLEAN);

export const updateLocationsRegular =
    createAsyncAction(
        UPDATE_LOCATION_ACTION,
        UPDATE_LOCATION_REGULAR,
        ''
    )<void, Location[], string>();

export const updateLocationsGroup =
    createAsyncAction(
        UPDATE_LOCATION_ACTION,
        UPDATE_LOCATION_GROUP_BY,
        ''
    )<void, GroupList[], string>();

export const editLocationAction =
    createAsyncAction(
        EDIT_LOCATION_REQUEST,
        EDIT_LOCATION_SUCCESS,
        ''
    )<void, string, string>();

export const deleteLocationAction =
    createAsyncAction(
        DELETE_LOCATION_REQUEST,
        DELETE_LOCATION_SUCCESS,
        ''
    )<void, string, string>();

export function getAllLocations(filter: Category[],sort: boolean = false) {
    return async (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
        dispatch(updateLocationsRegular.request());
        await openLocationTable();
        let locations: Location[] = await getAllLocationsFromDB();
        if(filter.length > 0) {
            locations = locations.filter(location => location.categories.some(category => filter.map(c => c.id).includes(category)))
        }
        if (sort) {
            locations = locations.sort(sortNames)
        }
        dispatch(updateLocationsRegular.success(locations));
    }
}

export function getAllLocationsGroup(filter: Category[], sort: boolean = false) {
    return async (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
        dispatch(updateLocationsGroup.request());
        await openLocationTable();
        let locations: Location[] = await getAllLocationsFromDB();
        let group: GroupList[] = filter.map(c => ({
            category: c,
            locations: locations.filter(location => location.categories.includes(c.id))
        }))
        group = group.filter(g=> g.locations.length > 0)
        if (sort) {
            group = group.map(g => ({
                ...g,
                locations: g.locations.sort(sortNames)
            })).sort((a, b) => sortNames(a.category, b.category))
        }
        dispatch(updateLocationsGroup.success(group));
    }
}

export function addLocation(name: string, location: { lat: number, long: number }, categories: string[]) {
    return async (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
        console.log('add location',name,categories,location)
        dispatch(editLocationAction.request());
        await openLocationTable()
        await saveLocationToDB(name, categories, location.lat, location.long);
        dispatch(editLocationAction.success('Location added successfully'));
    }
}

export function deleteLocation(id: string) {
    return async (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
        dispatch(deleteLocationAction.request());
        await deleteLocationFromDB(id);
        dispatch(deleteLocationAction.success(''))
    }
}

export function editLocation(id: string, newName: string,newLocation:{lat:number,long:number},newCategories: string[]) {
    return async (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
        console.log('edit location',newName,newCategories,newLocation)

        dispatch(editLocationAction.request());
        await updateLocation(id, newName,newCategories,newLocation.lat,newLocation.long);
        dispatch(editLocationAction.success('Location update successfully'));
    }
}

function sortNames<P extends { name: string }>(item1: P, item2: P): number {
    if (item1.name < item2.name) {
        return -1
    }
    return 1
}
