"use strict"

const User = require("../models/User");

const process = {
    show: async (req, res) => {
        const user = new User(req.body);
        const response = await user.show();
        const url = {
            method: "POST",
            path: "/show",
            status: response.err ? 400 : 200,
        };

        return res.status(url.status).json(response);
    },

    register: async (req, res) => {
        const user = new User(req.body);
        const response = await user.register();
        const url = {
            method: "POST",
            path: "/register",
            status: response.err ? 409 : 201,
        };

        return res.status(url.status).json(response);
    },
};

module.exports = {
    process,
};