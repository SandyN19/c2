/**
 * General routes.
 */
"use strict";

const express = require("express");
const router  = express.Router();

// Add a route for the path /
router.get("/", (req, res) => {
    res.send("Hello World");
});

// Add a route for the path /about
router.get("/about", (req, res) => {
    res.send("About something");
});


router.post('/connect', (req, res) => {
    const clientInfo = req.body;
    console.log('Received client info:', clientInfo);  // Log received data
    res.json({ message: 'Client info received successfully!' });
});



module.exports = router;
