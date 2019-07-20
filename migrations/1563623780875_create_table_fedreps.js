module.exports = {
    "up": "CREATE TABLE IF NOT EXISTS fedreps ( id int NOT NULL AUTO_INCREMENT, name varchar(100) NOT NULL, district_id int(11) NOT NULL, PRIMARY KEY (id) ) ENGINE=InnoDB ;",
    "down": "DROP TABLE fedreps"
}