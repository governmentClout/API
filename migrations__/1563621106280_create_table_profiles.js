module.exports = {
    "up": "CREATE TABLE IF NOT EXISTS profiles ( id INT(11) NOT NULL AUTO_INCREMENT , uuid VARCHAR(255) NOT NULL , nationality_origin VARCHAR(255) NOT NULL, nationality_residence VARCHAR(255) NOT NULL , state VARCHAR(255) NOT NULL , lga VARCHAR(255) NOT NULL , firstName VARCHAR(255) NOT NULL , lastName VARCHAR(255) NOT NULL , photo VARCHAR(255) NOT NULL, background TEXT , created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP , updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP , PRIMARY KEY (id)) ENGINE = InnoDB;",
    "down": "DROP TABLE users"
}