module.exports = {
    "up": "CREATE TABLE IF NOT EXISTS districts ( id int NOT NULL AUTO_INCREMENT, state_id int(11) NOT NULL,  name varchar(100) NOT NULL, code varchar(100) NOT NULL, PRIMARY KEY (id) ) ENGINE=InnoDB ;",
    "down": "DROP TABLE districts"
}