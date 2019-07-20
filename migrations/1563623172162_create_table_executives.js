module.exports = {
    "up": "CREATE TABLE IF NOT EXISTS executives (id INT NOT NULL AUTO_INCREMENT, uuid VARCHAR(255) NOT NULL, user VARCHAR(255) NOT NULL, party VARCHAR(255) NOT NULL, admin VARCHAR(255) NOT NULL, about_you TEXT NOT NULL, about_party TEXT NOT NULL, office VARCHAR(255) NOT NULL, created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP , updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, status INT(1) NOT NULL DEFAULT '0' , PRIMARY KEY (id)) ENGINE = InnoDB;",
    "down": "DROP TABLE executives"
}