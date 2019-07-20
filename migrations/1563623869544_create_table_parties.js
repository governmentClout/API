module.exports = {
    "up": "CREATE TABLE IF NOT EXISTS parties ( id int NOT NULL AUTO_INCREMENT, name varchar(100) NOT NULL, motto TEXT NOT NULL, other_details TEXT NOT NULL, PRIMARY KEY (id) ) ENGINE=InnoDB ;",
    "down": "DROP TABLE parties"
}