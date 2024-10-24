"use strict";

const mysql  = require("promise-mysql");
const config = require("../config/db/c2.json");
const fs = require('fs').promises;
const path = require('path');
const c2 = require('./c2');


const multer = require("multer");

let db;


module.exports = {
    displayList: displayList,
    changeWatchlist: changeWatchlist,
    updateClientData: updateClientData,
    updateClientOnline: updateClientOnline,
    updateClientOffline: updateClientOffline,
    displayListClient: displayListClient,
    checkWatchlist: checkWatchlist,
    logToClientFile: logToClientFile,
    addToPendingList: addToPendingList,
    displayPendingList: displayPendingList,
    removeFromPendingList: removeFromPendingList,
    saveInstalledApps: saveInstalledApps,
    getClientDetails: getClientDetails
    
};

function logToClientFile(message) {
  const logFilePath = path.join(__dirname, 'clientlogs.txt');
  const timestamp = new Date().toISOString();

  fs.appendFile(logFilePath, `${timestamp} - ${message}\n`, (err) => {
    if (err) {
      console.error('Error writing to log file:', err);
    }
  });
}




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
    c2.logToFile(`Displayed information: ${JSON.stringify(res[0], null, 2)}`, "admin")
    console.table(res[0]);
    return res[0];
}


async function changeWatchlist(arg1, arg2) {
    let sql = `CALL change_watchlist(?, ?);`;
    let res;
    const { clientid } = c2.getClientInfo();

    res = await db.query(sql,[arg1, arg2]);

    if (arg2 === true) {

      await removeFromPendingList(clientid);
  }

    c2.logToFile(`Changed watchlist status for ${(await c2.getClientInfo()).clientid}`, "admin")
    console.log('Watchlist has been updated.');
    return res[0];
}

async function updateClientData(clientInfo) {
    const { clientid, platform, release, location } = clientInfo;
    let sql = `
    INSERT INTO client (clientid, name, version, location)
    VALUES (?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      name = VALUES(name),
      version = VALUES(version),
      location = VALUES(location)
    `; 
    let res;

    res = await db.query(sql, [clientid, platform, release, location]);

    console.log('Client data has been updated');
    return res[0];
}


async function updateClientOnline(clientInfo) {
    const { clientid } = clientInfo;
    const online = new Date();


    let sql = `
      UPDATE client
      SET online = ?
      WHERE clientid = ?
    `;

    let res;
    res = await db.query(sql, [online, clientid]);

    console.log('Client online status updated');
    return res[0];
}

async function updateClientOffline(clientInfo) {
    const { clientid } = clientInfo;
    const offline = new Date();

    let sql = `
      UPDATE client
      SET offline = ?
      WHERE clientid = ?
    `;

    let res;
   
    try {
      res = await db.query(sql, [offline, clientid]);
      console.log('Client offline status updated');
    } catch (error) {
      console.error('Error updating offline status:', error);
    }

    return res[0];
}


async function displayListClient(clientInfo) {
  const { clientid } = clientInfo;
  let sql = `CALL display_list_client(?);`;
  let res;

  res = await db.query(sql,[clientid]);

  console.table(res[0]);
  logToClientFile(`Displayed client information: ${JSON.stringify(res[0], null, 2)}`)
  return res[0];
}

async function checkWatchlist(clientInfo) {
  const { clientid } = clientInfo;
    let sql = `
      SELECT watchlist
      FROM client
      WHERE clientid = ?
    `;

    let res = await db.query(sql, [clientid]);

    if (res[0] && res[0].watchlist === 1) {
        return true;
    } else {
      return false;
  }
}


async function addToPendingList(clientInfo) {
  const { clientid, platform, release, location } = clientInfo;

  let watchlistCheckSql = `SELECT watchlist FROM client WHERE clientid = ?`;
  let watchlistRes = await db.query(watchlistCheckSql, [clientid]);

  if (watchlistRes[0] && watchlistRes[0].watchlist === 0) {
    let sql = `
      INSERT INTO pending_clients (clientid, name, version, location)
      VALUES (?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        name = VALUES(name),
        version = VALUES(version),
        location = VALUES(location)
    `;
    
    let res = await db.query(sql, [clientid, platform, release, location]);
    logToClientFile(`Added client to pending list: ${clientid}`);
    console.log("You've been added to the waiting list.")
    return res[0];
  } else {
    logToClientFile(`Client ${clientid} is already on the watchlist, not added to pending list.`);
    console.log("You're already on the watchlist.")
    return null;
  }
}



async function displayPendingList() {
  let sql = `CALL display_pending_list();`;
  let res;

  res = await db.query(sql);
  c2.logToFile(`Displayed information pending list: ${JSON.stringify(res[0], null, 2)}`, "admin")
  console.table(res[0]);
  return res[0];
}

async function removeFromPendingList(clientid) {
  let sql = `CALL remove_from_pending_list(?);`;
  let res;

  res = await db.query(sql, [clientid]);
  c2.logToFile(`Removed a client from pending list: ${(await c2.getClientInfo()).clientid}`, "admin")
  return res[0];
}

async function saveInstalledApps(clientid, installedApps) {
  await db.query('DELETE FROM apps WHERE clientid = ?', [clientid]);

  for (const app of installedApps) {
    await db.query(`
      INSERT INTO apps (clientid, name)
      VALUES (?, ?)
    `, [clientid, path.basename(app)]);
  }
  
  c2.logToFile(`Saved ${installedApps.length} installed apps from client ${clientid}`, `${clientid}` )
}

async function getClientDetails(clientId) {
  try {
      const query = `SELECT * FROM admin_view WHERE clientid = ?`;
      const rows = await db.query(query, [clientId]);
      console.log('Client details:', rows[0]);
      return rows[0];
      
  } catch (err) {
      console.error('Error fetching client details:', err);
      throw err;
  }
}