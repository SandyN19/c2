--
-- SQL DDL to create tables
--

CREATE TABLE client
(
    clientid VARCHAR(120),
    name VARCHAR(120),
    version VARCHAR(120),
    online TIMESTAMP DEFAULT NULL,
    offline TIMESTAMP DEFAULT NULL,
    location VARCHAR(200),
    watchlist BOOLEAN DEFAULT TRUE,
    PRIMARY KEY (clientid)
);

CREATE TABLE apps
(
    clientid VARCHAR(120),
    name VARCHAR(120),
    version VARCHAR(120),

    FOREIGN KEY(clientid) REFERENCES client (clientid) 
);

CREATE TABLE pending_clients
(
    clientid VARCHAR(120),
    name VARCHAR(120),
    version VARCHAR(120),
    location VARCHAR(200),
    date_added TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (clientid)
);


/* VIEWS*/


CREATE VIEW list_view AS
SELECT
    clientid,
    name,
    version,
    location,
    online,
    offline,
    watchlist
FROM client
WHERE watchlist = TRUE;


CREATE VIEW admin_view AS
SELECT 
    c.clientid,
    c.name AS client_name,
    c.location,
    c.online,
    c.offline,
    c.watchlist,
    a.name AS app_name,
    a.version AS app_version
FROM client c
LEFT JOIN apps a ON c.clientid = a.clientid;
