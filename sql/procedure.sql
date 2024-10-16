DELIMITER ;;
CREATE PROCEDURE display_list()
BEGIN
    SELECT * FROM admin_view;
END
;;
DELIMITER ;


DELIMITER ;;
CREATE PROCEDURE display_pending_list()
BEGIN
    SELECT * FROM pending_clients;
END
;;
DELIMITER ;


DELIMITER ;;
CREATE PROCEDURE remove_from_pending_list(IN arg1 VARCHAR(120))
BEGIN
    DELETE FROM pending_clients WHERE clientid = arg1;
END
;;
DELIMITER ;




DELIMITER ;;
CREATE PROCEDURE display_list_client(IN arg1 VARCHAR(120))
BEGIN
    SELECT * FROM client WHERE clientid = arg1;
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

