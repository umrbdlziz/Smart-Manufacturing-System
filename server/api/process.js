const express = require("express");
const app = express();
const db = require("../models/connectdb");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/process", async (req, res) => {
  try {
    const processSQL = "SELECT * FROM processes";
    const processResult = await db.executeAllSQL(processSQL, []);

    const processesWithArray = processResult.map((process) => ({
      ...process,
      process_sequence: JSON.parse(process.process_sequence),
    }));

    res.send(processesWithArray);
  } catch (error) {
    console.log("Error getting processes:", error.message);
  }
});

app.post("/process", async (req, res) => {
  const { processSeq } = req.body;
  try {
    // const processSeqJson = JSON.stringify(processSeq);

    const processSQL = "INSERT INTO processes (process_sequence) VALUES (?)";
    const processResult = await db.executeRunSQL(processSQL, [processSeq]);

    res.send(processResult);
  } catch (error) {
    console.log("Error adding process:", error.message);
  }
});

module.exports = app;
