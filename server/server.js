const express = require("express");
const path = require("path");
require("dotenv").config();

const app = express();
const port = process.env.PORT;

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "../client/dist")));

app.get("/api", (req, res) => {
  res.send("Hello from the API");
});

// Catch-all route to serve index.html for any other requests
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist", "index.html"));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
