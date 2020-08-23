import {Category} from "./types/Category";
import {db} from "./index";
import {Location} from "./types/Location";

const ARRAY_SEPARATOR = ','

export async function openLocationTable() {
    return new Promise<void>((resolve, reject) => {
        db.transaction(function (txn) {
            txn.executeSql(
                "SELECT name FROM sqlite_master WHERE type='table' AND name='table_location'",
                [],
                function (tx, res) {
                    if (res.rows.length == 0) {
                        txn.executeSql('DROP TABLE IF EXISTS table_location', [])
                        txn.executeSql(
                            'CREATE TABLE IF NOT EXISTS table_location (name TEXT, categories TEXT, lat REAL, long REAL)',
                            [])
                    }
                    resolve()
                },
                (_, error) => reject(error)
            );
        });
    });
}

export async function saveLocationToDB(name: string, categories: string[], lat: number, long: number) {
    return new Promise<void>(async (resolve, reject) => {
        const categoriesString = categories.join(ARRAY_SEPARATOR)
        db.transaction(function (tx) {
            tx.executeSql(
                'INSERT INTO table_location (name,categories,lat,long) VALUES (?,?,?,?)',
                [name, categoriesString, lat, long],
                (tx, results) => {
                    if (results.rowsAffected == 0) reject('Can`t save this Location');
                    else resolve();
                },
                (_, error) => reject(error)
            );
        });
    });
}

export async function getAllLocationsFromDB() {
    return new Promise<Location[]>((resolve, reject) => {
        db.transaction(tx => {
            return tx.executeSql(
                'SELECT rowid,name,categories,lat,long FROM table_location',
                [],
                (tx, results) => {
                    let temp: Location[] = [];
                    for (let i = 0; i < results.rows.length; ++i) {
                        temp.push({
                            name: results.rows.item(i).name,
                            id: results.rows.item(i).rowid.toString(),
                            lat: results.rows.item(i).lat,
                            long: results.rows.item(i).long,
                            categories: results.rows.item(i).categories.split(ARRAY_SEPARATOR)
                        });
                    }
                    resolve(temp);
                },
                (_, error) => reject(error)
            );
        });
    });
}

export async function deleteLocationFromDB(location_id: string) {
    return new Promise<void>((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                'DELETE FROM table_location where rowid=?',
                [location_id],
                (tx, results) => {
                    if (results.rowsAffected == 0) reject(new Error('Can`t delete this Location'));
                    else resolve();
                },
                (_, error) => reject(error)
            );
        });
    });
}

export async function updateLocation(id: string, name: string, categories: string[], lat: number, long: number) {
    const categoriesString = categories.join(ARRAY_SEPARATOR)
    return new Promise<void>((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                'UPDATE table_location SET name = ?,categories = ?, lat = ?, long = ? WHERE rowid=?',
                [name, categoriesString, lat, long, id],
                (tx, results) => {
                    if (results.rowsAffected == 0) reject(new Error('Can`t update this Location'));
                    else resolve();
                },
                (_, error) => reject(error)
            );
        });
    });
}

export async function getLocationsFromCategory(category_id: string) {
    return new Promise<Category[]>((resolve, reject) => {
        db.transaction(tx => {
            return tx.executeSql(
                'SELECT rowid,name,categories,lat,long FROM table_location',
                [],
                (tx, results) => {
                    let temp: Location[] = [];
                    for (let i = 0; i < results.rows.length; ++i) {
                        const categories: string[] = results.rows.item(i).categories.split(ARRAY_SEPARATOR)
                        if(categories.includes(category_id)) {
                            temp.push({
                                name: results.rows.item(i).name,
                                id: results.rows.item(i).rowid.toString(),
                                lat: results.rows.item(i).lat,
                                long: results.rows.item(i).long,
                                categories: results.rows.item(i).categories.split(ARRAY_SEPARATOR)
                            });
                        }
                    }
                    resolve(temp);
                },
                (_, error) => reject(error)
            );
        });
    });
}
