const express = require("express");
const app = express();
const db = require("../models/connectdb");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/jobs", async (req, res) => {
  try {
    const jobSQL = "SELECT * FROM jobs";
    const jobResult = await db.executeAllSQL(jobSQL, []);

    res.send(jobResult);
  } catch (error) {
    console.log("Error getting jobs:", error.message);
  }
});

app.post("/jobs", async (req, res) => {
  const { jobName, jobDescription, machine, qty, batchNumber, process } =
    req.body;
  try {
    const jobSQL =
      "INSERT INTO jobs (job_name, job_description, machine, qty, batch_number, process_id) VALUES (?, ?, ?, ?, ?, ?)";
    const jobValues = [
      jobName,
      jobDescription,
      machine,
      qty,
      batchNumber,
      JSON.stringify(process),
    ];
    const jobResult = await db.executeRunSQL(jobSQL, jobValues);

    res.send(jobResult);
  } catch (error) {
    console.log("Error adding job:", error.message);
  }
});

module.exports = app;
