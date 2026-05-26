const mysql = require("mysql2");

const dbConf = {
  host: "mysql",
  user: "admin",
  port: "3306",
  database: "article1",
  password: "12345678",
}

let db

function handleDisconnect() {
  db = mysql.createConnection(dbConf);

  db.connect((err) => {
    if (err) {
      console.error("Error connecting to MySQL:", err);
      setTimeout(handleDisconnect, 5000); // 5초 후에 다시 연결 시도
    }
  });

  db.on("error", (err) => {
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
      handleDisconnect();
    } else {
      throw err;
    }
  });
}

handleDisconnect();

db.query("drop database if exists article1");
db.query(`create database article1`);
db.query(`use article1`);
db.query(`CREATE TABLE articles (
_id INT AUTO_INCREMENT PRIMARY KEY,
title VARCHAR(64),
body VARCHAR(64),
updatetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)`);
db.query(`INSERT INTO articles (title, body, updatetime) VALUES
('제목1', '내용1', CURRENT_TIMESTAMP),
('제목2', '내용2', CURRENT_TIMESTAMP),
('제목3', '내용3', CURRENT_TIMESTAMP);
`);

module.exports = db;
