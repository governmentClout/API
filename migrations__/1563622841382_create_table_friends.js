module.exports = {
    "up": "CREATE TABLE IF NOT EXISTS friends ( id INT NOT NULL AUTO_INCREMENT , uuid VARCHAR(255) NOT NULL, friend VARCHAR(255) NOT NULL , user VARCHAR(255) NOT NULL , created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP , updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP , status INT(1) NOT NULL DEFAULT '0' , PRIMARY KEY (id)) ENGINE = InnoDB;",
    "down": "DROP TABLE friends"
}