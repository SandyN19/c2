--
-- SQL DDL to create tables
--

CREATE TABLE client
(
    clientid VARCHAR(120),
    name VARCHAR(120),
    version VARCHAR(120),
    uptime VARCHAR(120),
    location VARCHAR(200),
    watchlist BOOLEAN DEFAULT false,
    PRIMARY KEY (clientid)
);

CREATE TABLE apps
(
    clientid VARCHAR(120),
    name VARCHAR(120),
    version VARCHAR(120),

    FOREIGN KEY(clientid) REFERENCES client (clientid) 
);



/* VIEWS*/


CREATE VIEW list_view AS
SELECT
    clientid,
    name,
    version,
    location,
    CONCAT(
        FLOOR(uptime / 3600), 'h ', 
        FLOOR((uptime % 3600) / 60), 'm ', 
        ROUND(uptime % 60, 2), 's'
    ) AS time,
    watchlist
FROM client
WHERE watchlist = TRUE;
