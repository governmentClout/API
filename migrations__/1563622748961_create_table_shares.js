module.exports = {
    "up": "CREATE TABLE IF NOT EXISTS shares ( id INT NOT NULL AUTO_INCREMENT , uuid VARCHAR(255) NOT NULL , post VARCHAR(255) NOT NULL , created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP , status INT NOT NULL DEFAULT '1' , PRIMARY KEY (id)) ENGINE = InnoDB;",
    "down": "DROP TABLE shares"
}