const express = require("express");
const app = express();
const db = require("../models/connectdb");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/get_jobs", async (req, res) => {
  try {
    const jobSQL = "SELECT * FROM jobs";
    const jobResult = await db.executeAllSQL(jobSQL, []);

    res.send(jobResult);
  } catch (error) {
    console.log("Error getting jobs:", error.message);
  }
});

app.post("/add_job", async (req, res) => {
  const { jobName, description, status, processId } = req.body;
  try {
    const jobSQL =
      "INSERT INTO jobs (job_name, description, status, process_id, created_at) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)";
    const jobResult = await db.executeRunSQL(jobSQL, [
      jobName,
      description,
      status,
      processId,
    ]);

    res.send(jobResult);
  } catch (error) {
    console.log("Error adding job:", error.message);
  }
});

module.exports = app;
