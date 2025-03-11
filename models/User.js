"use strict"

const UserStorage = require("./UserStorage");

class User {
    constructor(body) {
        this.body = body;
    }

    async show() {
        const client = this.body;
        try {
            const user = await UserStorage.getUserInfo(client.id);

            if (user) {
                if (user.id === client.id)
                    return { success: true };
            }
            return { success: false, msg: "존재하지 않는 아이디입니다." };
        }
        catch (err) {
            return { success: false, err };
        }
    }

    async register(req, res) {
        const client = this.body;
        try {
            const response = await UserStorage.save(client);
            return response;
        } catch (err) {
            return { success: false, err };
        }
    }


}

module.exports = User;