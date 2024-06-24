const express = require("express");
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/get_fleets", async (req, res) => {
  let data = {};

  try {
    const fleetResponse = await fetch(`${process.env.RMF_URL}/fleets`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!fleetResponse.ok) {
      throw new Error("Network response was not ok");
    }

    const fleetData = await fleetResponse.json();

    data = {
      fleets: fleetData,
    };

    res.send(data);
  } catch (error) {
    console.error("Error getting fleet:", error.message);
    return;
  }
});

module.exports = app;
