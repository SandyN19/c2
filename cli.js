
"use strict";

const c2 = require("./src/cli.js");
const functions = require("./src/c2.js");

const isAdmin = process.getuid && process.getuid() === 0;

// Read from commandline
const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Promisify rl.question to question
const util = require("util");

rl.question[util.promisify.custom] = (arg) => {
    return new Promise((resolve) => {
        rl.question(arg, resolve);
    });
};

/**
 * Main function.
 *
 * @returns void
 */
(function() {
    rl.on("close", exitProgram);
    rl.on("line", handleInput);
    menu();
    rl.setPrompt("Input: ");
    rl.prompt();
})();

function menu() {
    console.log(`You can choose from the following comands:
    exit, quit, ctrl-d - to exit the program.
    help, menu - to show this menu.
    about - Names of the group.
    display - Display the list of clients.
    request - sends a request to be readded to watchlist.
    `);
    if (isAdmin) {
        console.log(`Admin-only commands:
        add <clientID> - Add a client to the watchlist.
        remove <clientID> - Remove a client from the watchlist.
        pending - display pending list.`);
    }
}



/**
 * Close down program and exit with a status code.
 *
 * @param {number} code Exit with this value, defaults to 0.
 *
 * @returns {void}
 */
function exitProgram(code) {
    code = code || 0;

    console.info("Exiting with status code " + code);
    process.exit(code);
}



/**
 * Handle input as a command and send it to a function that deals with it.
 *
 * @param {string} line The input from the user.
 *
 * @returns {void}
 */
async function handleInput(line) {
    line = line.trim();
    const parts = line.split(' ');
    const part1 = parts[0];
    const part2 = parts.length > 1 ? parts[1] : null;

    switch (part1) {
        case "quit":
        case "exit":
            exitProgram();
            break;
        case "help":
        case "menu":
            menu();
            break;
        case "about":
            console.log("By: Sandy Nguyen, Sang22");
            break;
        case "display":
            if (isAdmin) {
            c2.displayList(); }
            else {
            c2.displayListClient( await functions.getClientInfo())
            }
            break;
        case "add":
            if (isAdmin) {
                c2.changeWatchlist(part2, true);
                c2.removeFromPendingList(part2)
            }
            break;
        case "remove":
            if (isAdmin) {
                c2.changeWatchlist(part2, false); 
            }
            break;
        case "pending":
            if (isAdmin) {
                c2.displayPendingList();
            }
            break;
        case "request":
                c2.addToPendingList( await functions.getClientInfo());
            break;
        default:
            menu();
    }

    rl.prompt();
}
