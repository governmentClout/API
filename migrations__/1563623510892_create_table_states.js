module.exports = {
    "up": "CREATE TABLE IF NOT EXISTS states ( id int NOT NULL AUTO_INCREMENT, name varchar(100) NOT NULL, PRIMARY KEY (id) ) ENGINE=InnoDB;",
    "down": "DROP TABLE states"
}