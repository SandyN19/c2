"use strict";

const port    = process.env.DBWEBB_PORT || 1337;
const path    = require("path");
const express = require("express");
const cors    = require("cors");
const app     = express();
const routeIndex = require("./route/index.js");
const middleware = require("./middleware/index.js");

// Add JSON parsing middleware before routes
app.use(express.json());

// Enable CORS
app.use(cors());

app.set("view engine", "ejs");

// Middleware for logging incoming requests
app.use(middleware.logIncomingToConsole);

// Serve static resources
app.use(express.static(path.join(__dirname, "public")));

// Route handling
app.use("/", routeIndex);

app.listen(port, logStartUpDetailsToConsole);


/**
* Log app details to console when starting up.
*
* @return {void}
*/
function logStartUpDetailsToConsole() {
   let routes = [];

   // Find what routes are supported
   app._router.stack.forEach((middleware) => {
       if (middleware.route) {
           // Routes registered directly on the app
           routes.push(middleware.route);
       } else if (middleware.name === "router") {
           // Routes added as router middleware
           middleware.handle.stack.forEach((handler) => {
               let route;

               route = handler.route;
               route && routes.push(route);
           });
       }
   });

   console.info(`Server is listening on port ${port}.`);
   console.info("Available routes are:");
   console.info(routes);
}
