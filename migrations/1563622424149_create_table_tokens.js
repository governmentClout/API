module.exports = {
    "up": "CREATE TABLE IF NOT EXISTS tokens ( id INT(11) NOT NULL AUTO_INCREMENT , uuid VARCHAR(255) NULL DEFAULT NULL , token VARCHAR(255) NULL DEFAULT NULL , created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP , updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP , status INT(1) NULL DEFAULT NULL , PRIMARY KEY (id)) ENGINE = InnoDB;",
    "down": "DROP TABLE tokens"
}