"use strict"

const { json } = require("body-parser");

const db = require("../config/db");

class UserStorage {

    static getUserInfo(id) {
        return new Promise((resolve, reject) => {
            const query = "selct * from user where id= ?;";
            db.query(query, [id], (err, data) => {
                if (err) reject(`${err}`);
                else resolve(data[0]);
            });
        });
    }

    static async save(userInfo) {
        return new Promise((resolve, reject) => {
            const query = "insert into user(id,score) values(?,?);";
            db.query(query, [userInfo.id, userInfo.score], (err) => {
                if (err) reject(`${err}`);
                else resolve({ success: true });
            });

        });
    }
}

module.exports = UserStorage;