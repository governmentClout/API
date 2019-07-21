module.exports = {
    "up": "CREATE TABLE IF NOT EXISTS poll_responses ( id INT NOT NULL AUTO_INCREMENT , poll VARCHAR(255) NOT NULL , user VARCHAR(255) NOT NULL , status INT(1) NOT NULL DEFAULT '0', created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP , PRIMARY KEY (id)) ENGINE = InnoDB;",
    "down": "DROP TABLES poll_responses"
}