const express = require("express");
const app = express();
const db = require("../models/connectdb");
const { fleet } = require("./fleet");

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
  const { jobName, jobDescription, machine, batchNumber, process } = req.body;
  try {
    const jobSQL =
      "INSERT INTO jobs (job_name, job_description, machine, batch_number, process_id) VALUES (?, ?, ?, ?, ?)";
    const jobValues = [
      jobName,
      jobDescription,
      machine,
      batchNumber,
      JSON.stringify(process),
    ];
    const jobResult = await db.executeRunSQL(jobSQL, jobValues);

    process.forEach(async (process_id) => {
      const processSQL = "SELECT * FROM processes WHERE process_id = ?";
      const processResult = await db.executeGetSQL(processSQL, process_id);

      // console.log(JSON.parse(processResult.process_sequence));
      const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

      (async () => {
        const actions = JSON.parse(processResult.process_sequence);
        for (const action of actions) {
          if (action.startsWith("deliver")) {
            const jsonPart = action
              .substring(action.indexOf("{"))
              .replace(/'/g, '"')
              .replace(/([a-zA-Z0-9]+):/g, '"$1":')
              .replace(/: ([a-zA-Z0-9]+)/g, ': "$1"');
            const actionObj = JSON.parse(jsonPart);
            await fleet(
              "deliver",
              actionObj.from,
              actionObj.to,
              actionObj.quantity
            );
          } else if (action.startsWith("grind") || action.startsWith("clean")) {
            console.log(action.startsWith("grind") ? "grind" : "clean");
            await sleep(30000); // Wait for 30 sec
          }
        }
      })();
    });

    res.send(jobResult);
  } catch (error) {
    console.log("Error adding job:", error.message);
  }
});

module.exports = app;
