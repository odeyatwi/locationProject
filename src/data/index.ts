import {openDatabase, SQLError} from "react-native-sqlite-storage";

function errorDB(err: SQLError) {
    console.log("SQL Error: " + err);
}

function openDB() {
}

export var db = openDatabase({name: "CategoryDB.db", location: "default"}, openDB, errorDB);