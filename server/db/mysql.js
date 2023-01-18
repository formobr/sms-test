const mysql = require('mysql2');
const fs = require("fs");
const config = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: {
    rejectUnauthorized: false,
    ca: fs.readFileSync("server/ssl.crt").toString(),
  },
}
const pool  = mysql.createPool(config);
const promisePool = pool.promise()

module.exports = promisePool