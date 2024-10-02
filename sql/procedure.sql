DELIMITER ;;
CREATE PROCEDURE display_list()
BEGIN
    SELECT * FROM list_view;
END
;;
DELIMITER ;

DELIMITER ;;
CREATE PROCEDURE change_watchlist(IN arg1 VARCHAR(120), IN arg2 BOOLEAN)
BEGIN
    UPDATE client
    SET watchlist = arg2
    WHERE clientid = arg1;
END
;;
DELIMITER ;

