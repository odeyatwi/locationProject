import {getAllCategoriesFromDB} from "./CategoryDB";
import {getAllLocationsFromDB} from "./LocationDB";
import {GroupList} from "./types/GroupList";

export async function getLocationGroupByCategory(filter: string[]) {
    const categories = await getAllCategoriesFromDB();
    const locations = await getAllLocationsFromDB();
    if (filter.length == 0) {
        return categories.map<GroupList>(category => ({
            category,
            locations: locations.filter(loc => loc.categories.includes(category.id))
        }));
    } else {
        return categories
            .filter(cat => filter.includes(cat.id))
            .map<GroupList>(category => ({
                category,
                locations: locations.filter(loc => loc.categories.includes(category.id))
            }));
    }
}