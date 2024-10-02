/**
 * General routes.
 */
"use strict";

const express = require("express");
const router  = express.Router();
const c2 = require("../src/c2.js");
const bodyParser = require("body-parser");
const urlencodedParser = bodyParser.urlencoded({ extended: false });

// Add a route for the path /

router.post('/connect', urlencodedParser, async (req, res) => {
    console.log('Received client info:', await c2.getClientInfo());  // Log received data
    res.json({ message: 'Client info received successfully!' });
});



module.exports = router;
