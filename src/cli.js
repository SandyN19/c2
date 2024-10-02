"use strict";

const mysql  = require("promise-mysql");
const config = require("../config/db/c2.json");
let db;


module.exports = {
    displayList: displayList,
    changeWatchlist: changeWatchlist,
    
};


/**
 * Main function.
 * @async
 * @returns void
 */
(async function() {
    db = await mysql.createConnection(config);

    process.on("exit", () => {
        db.end();
    });
})();

async function displayList() {
    let sql = `CALL display_list();`;
    let res;

    res = await db.query(sql);

    console.table(res[0]);
    return res[0];
}


async function changeWatchlist(arg1, arg2) {
    let sql = `CALL change_watchlist(?, ?);`;
    let res;

    res = await db.query(sql,[arg1, arg2]);

    console.log('Watchlist has been updated.');
    return res[0];
}