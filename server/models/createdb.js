const sqlite3 = require("sqlite3").verbose();

// database name
const DBSOURCE = process.env.DB_NAME;

let db = new sqlite3.Database(DBSOURCE, (err) => {
  if (err) {
    // Cannot open database
    console.error(err.message);
    throw err;
  } else {
    console.log("Connected to the SQlite database.");

    db.run(
      `CREATE TABLE "constants" (
        "constant"	TEXT NOT NULL PRIMARY KEY,
        "value"	TEXT NOT NULL,
        "description"	TEXT
    );`,
      (err) => {
        if (err) {
          // console.log("Table already exist");
        } else {
          // Table just created, can creating some rows
          console.log("constants table has been created");
          let sql =
            "INSERT INTO constants (constant, value, description) VALUES (?, ?, ?)";
          db.run(sql, [
            "server address",
            "192.168.1.0",
            "IP address of ASRS server",
          ]);
          db.run(sql, [
            "robot api",
            "192.168.1.0:0",
            "IP address of robot server",
          ]);
          db.run(sql, [
            "fleet address",
            "192.168.1.90:8000",
            "IP address of RMF web server",
          ]);
        }
      }
    );
    db.run(
      `CREATE TABLE "processes" (      
        "process_id"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        "process_sequence"	TEXT NOT NULL
        );`,
      (err) => {
        if (err) {
          // console.log(err.message);
          // console.log("Table already exist");
        } else {
          console.log("processes table has been created");
        }
      }
    );
    db.run(
      `CREATE TABLE "jobs" (
        "job_id"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        "job_name"	TEXT NOT NULL,
        "job_description"	TEXT NOT NULL,
        "machine"	TEXT NOT NULL,
        "batch_number"	TEXT NOT NULL,
        "process_id"	INTEGER NOT NULL,
        FOREIGN KEY("process_id") REFERENCES "processes"("process_id")
        );`,
      (err) => {
        if (err) {
          // console.log(err.message);
          // console.log("Table already exist");
        } else {
          console.log("jobs table has been created");
        }
      }
    );
    db.run(
      `CREATE TABLE "machines" (
      "machine_name"  TEXT NOT NULL PRIMARY KEY,
      "machine_port"  INTEGER NOT NULL,
      "machine_url"    TEXT NOT NULL,
      "waypoint" TEXT NOT NULL
      );`,
      (err) => {
        if (err) {
          // console.log(err.message);
          // console.log("Table already exist");
        } else {
          console.log("machines table has been created");
        }
      }
    );
  }
});

module.exports = db;
