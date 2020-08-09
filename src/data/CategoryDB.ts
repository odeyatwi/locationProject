import {openDatabase, SQLError} from "react-native-sqlite-storage";
import {Category} from "./types/Category";

function errorDB(err: SQLError) {
    console.log("SQL Error: " + err);
}

function openDB() {
}

export var db = openDatabase({name: "CategoryDB.db", location: "default"}, openDB, errorDB);

export async function openCategoryDB() {
    return new Promise<void>((resolve, reject) => {
        db.transaction(function (txn) {
            txn.executeSql(
                "SELECT name FROM sqlite_master WHERE type='table' AND name='table_category'",
                [],
                function (tx, res) {
                    if (res.rows.length == 0) {
                        txn.executeSql('DROP TABLE IF EXISTS table_category', [])
                        txn.executeSql(
                            'CREATE TABLE IF NOT EXISTS table_category (name VARCHAR(50))',
                            [])
                    }
                    resolve()
                },
                (_, error) => reject(error)
            );
        });
    });
}

export async function saveCategoryToDB(name: string) {
    return new Promise<void>(async (resolve, reject) => {
        console.log('save',name)
        db.transaction(function (tx) {
            tx.executeSql(
                'INSERT INTO table_category (name) VALUES (?)',
                [name],
                (tx, results) => {
                    console.log('save category',results.rowsAffected)
                    if (results.rowsAffected == 0) reject('Can`t save this Category');
                    else resolve();
                },
                (_, error) => reject(error)
            );
        });
    })
}

export async function getAllCategoriesFromDB() {
    return new Promise<Category[]>((resolve, reject) => {
        db.transaction(tx => {
            return tx.executeSql(
                'SELECT rowid,name FROM table_category',
                [],
                (tx, results) => {
                    let temp: Category[] = [];
                    for (let i = 0; i < results.rows.length; ++i) {
                        temp.push({
                            name: results.rows.item(i).name,
                            id: results.rows.item(i).rowid.toString()
                        });
                    }
                    resolve(temp);
                },
                (_, error) => reject(error)
            );
        });
    });
}

export async function deleteCategoryFromDB(category_id: string) {
    return new Promise<void>((resolve, reject) => {
        console.log('delete', category_id)
        db.transaction(tx => {
            tx.executeSql(
                'DELETE FROM table_category where rowid=?',
                [category_id],
                (tx, results) => {
                    if (results.rowsAffected == 0) reject(new Error('Can`t delete this Category'));
                    else resolve();
                },
                (_, error) => reject(error)
            );
        });
    });
}

export async function updateCategory(id: string, name: string) {
    return new Promise<void>((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                'UPDATE table_category SET name = ? WHERE rowid=?',
                [name, id],
                (tx, results) => {
                    if (results.rowsAffected == 0) reject(new Error('Can`t update this Category'));
                    else resolve();
                },
                (_, error) => reject(error)
            );
        });
    });
}
