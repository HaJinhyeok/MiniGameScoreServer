"use strict"

const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const ctrl = require("./routes/home.ctrl");
const PORT = 3030;

const { json } = require("body-parser");

const db = require("./config/db");

app.use(express.json());

app.post("/top3", (req, res) => {
    const query = "SELECT * FROM users";
    db.query(query, [], (err, data) => {
        let users = data.sort((a, b) => {
            return b.score - a.score;
        });
        const result = users.slice(0, 3);
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
    const { id, password } = req.body;
    // select 쿼리문으로 정보를 가져와서 조회한다.
    const query = "SELECT * FROM users where id=?;";
    db.query(query, [id], (err, data) => {
        if (data[0] === undefined) {
            // 1. id가 없을 경우 - cmd 1201
            result.cmd = 1201;
            result.message = "ID가 없는데요";
        } else if (data[0].id === id && data[0].password !== password) {
            // 2. id는 존재하지만 password가 틀렸을 경우 - cmd 1202
            result.cmd = 1202;
            result.message = "비번 틀렸는데요";
        } else {
            // 3. id가 존재하고 password 또한 일치할 경우 - cmd 1203
            result.cmd = 1203;
            result.message = "로그인 성공";
        }
        res.send(result);
    });
})

app.post("/register", (req, res) => {
    let result = {
        cmd: -1,
        message: "",
    }
    const { id, password } = req.body;
    const query = "SELECT * FROM users where id=?;";
    db.query(query, [id], (err, data) => {
        if (data[0] === undefined) {
            // 1. id가 없는 신규 유저가 맞을 경우 - cmd 1301
            // 신규 유저 등록하기
            const registerQuery = "INSERT INTO users(id,password,score) VALUES(?,?,0);";
            db.query(registerQuery, [id, password], (err) => {
                if (err) console.log(`register error: ${err}`);
            })
            result.cmd = 1301;
            result.message = "신규 유저 등록";
        } else {
            // 2. id가 이미 존재하는 유저일 경우 - cmd 1302
            result.cmd = 1302;
            result.message = "이미 등록된 유저입니다";
        }
        res.send(result);
    })
})

// 회원가입과 점수 update post 요청을 분리해야 한다.
app.post("/update", (req, res) => {
    let result = {
        cmd: -1,
        message: "",
    };
    const { id, score } = req.body;
    let insertQuery;
    const selectQuery = "select * from users where id=?;";
    db.query(selectQuery, [id], (err, data) => {
        if (data[0] === undefined) {
            // 아직 등록이 한 번도 안 된 유저 신규 등록
            insertQuery = "INSERT INTO users(id,score) VALUES(?,?);";
            db.query(insertQuery, [id, score], (err) => {
                if (err) console.log(`register error: ${err}`);
                //else res.sendStatus(200);
            });
            result.cmd = 1001;
            result.message = "점수가 신규 등록 되었습니다.";
        }
        else if (data[0].id === id) {
            // 이미 등록된 유저 스코어 업데이트
            if (data[0].score < score) {
                insertQuery = "UPDATE users SET score=? where id=?;";
                db.query(insertQuery, [score, id], (err) => {
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