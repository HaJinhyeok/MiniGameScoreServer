"use strict"

const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const ctrl = require("./routes/home.ctrl");
const PORT = 3030;

const { json } = require("body-parser");

const db = require("./config/db");

let users = [];

app.use(express.json());

app.post("/top3", async (req, res) => {
    const query = "SELECT * FROM user";
    await db.query(query, [], (err, data) => {
        let users = data.sort((a, b) => {
            return b.score - a.score;
        });
        const result = users.slice(0, 3);
        console.log(users);
        res.send({
            cmd: 1101,
            message: "탑3 점수 반환",
            result,
        });
    });
});

app.post("/login", (req, res) => {
    let result = {
        cmd: -1,
        message: "",
    };
    // 필요한 UI: password input field, 회원가입 button, 로그인 button
    // input field에서 id와 password를 받아오고,
    // select 쿼리문으로 정보를 가져와서 조회한다.
    // 1. id가 없을 경우 - cmd 1201
    // 2. id는 존재하지만 password가 틀렸을 경우 - cmd 1202
    // 3. id가 존재하고 password 또한 일치할 경우 - cmd 1203
    const { id, password } = req.body;
})

// 회원가입과 점수 등록 post 요청을 분리해야 한다.
// 회원가입: id - password - confirm_password
app.post("/register", (req, res) => {
    let result = {
        cmd: -1,
        message: "",
    };
    const { id, score } = req.body;
    let insertQuery;
    const selectQuery = "select * from user where id=?;";
    db.query(selectQuery, [id], async (err, data) => {
        console.log("current id: " + id + " user info: " + JSON.stringify(data[0]));

        if (data[0] === undefined) {
            // 아직 등록이 한 번도 안 된 유저 신규 등록
            insertQuery = "INSERT INTO user(id,score) VALUES(?,?);";
            await db.query(insertQuery, [id, score], (err) => {
                if (err) console.log(`register error: ${err}`);
                //else res.sendStatus(200);
            });
            result.cmd = 1001;
            result.message = "점수가 신규 등록 되었습니다.";
        }
        else if (data[0].id === id) {
            // 이미 등록된 유저 스코어 업데이트
            if (data[0].score < score) {
                insertQuery = "UPDATE user SET score=? where id=?;";
                await db.query(insertQuery, [score, id], (err) => {
                    if (err) console.log(`register error: ${err}`);
                    //else res.sendStatus(200);
                });
                result.cmd = 1002;
                result.message = "점수가 갱신되었습니다.";
            }
            else {
                result.cmd = 1003;
            }
        }
        res.send(result);
    });

});

app.listen(PORT, () => {
    console.log("server is running at " + PORT + " port.");
});

module.exports = app;