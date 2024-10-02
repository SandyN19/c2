

LOAD DATA LOCAL INFILE 'client_info.csv'
INTO TABLE client
CHARSET utf8
FIELDS
    TERMINATED BY ',' 
LINES
    TERMINATED BY '\n'
IGNORE 1 LINES
(@id, @name, @version, @uptime, @location)
SET 
clientid = @id,
name = @name,
version = @version,
uptime = @uptime,
location = @location,
watchlist = TRUE
