const Pool = require("pg").Pool;
const fs = require("fs");
const { env } = require("process");
const config = {
  connectionString: process.env.DB_CONNECTION,
  ssl: {
    rejectUnauthorized: false,
    ca: fs.readFileSync("server/ssl.crt").toString(),
  },
  max: 20,
  port: 5432,
  connectionTimeoutMillis: 0,
  idleTimeoutMillis: 10000,
};
const pool = new Pool(config);

pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err)
  process.exit(-1)
})

pool.connect((err, client, release) => {
  if (err) {
    return console.error("Error acquiring client", err.stack);
  }
  client.query("SELECT NOW()", (err, result) => {
    release();
    if (err) {
      return console.error("Error executing query", err.stack);
    }
    console.log("Connected to Database !");
  });
});

module.exports = pool