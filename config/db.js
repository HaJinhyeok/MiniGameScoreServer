"use strict"

const mysql = require("mysql");

const db = mysql.createConnection({
    host: "minigame.cj6kisee0yfg.ap-northeast-2.rds.amazonaws.com",
    user: "admin",
    password: "12345678",
    database: "minigame_db",
})

db.connect();

module.exports = db;