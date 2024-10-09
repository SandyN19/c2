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

router.post('/connect', urlencodedParser, async (req, res) => {
    const clientInfo = await c2.getClientInfo()
    console.log('Received client info:', clientInfo);
    await cli.updateClientData(clientInfo);
    await c2.saveClientInfoToCSV();
    await c2.logToFile("Connected to server successfully", clientInfo.clientid);

    res.json({ message: 'Client info received successfully!' });
});

router.post('/heartbeat', urlencodedParser, async (req, res) => {
    const clientInfo = await c2.getClientInfo()
    console.log('Received client info:', clientInfo);
    await cli.updateClientData(clientInfo);
    await c2.saveClientInfoToCSV();
    await c2.logToFile("Heartbeat", clientInfo.clientid);
    res.json({ message: 'Heartbeat' });
});



module.exports = router;
