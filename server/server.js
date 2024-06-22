const express = require("express");
const cors = require("cors");
const path = require("path");
const http = require("http");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true,
  },
});
const clientIO = require("socket.io-client");

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "../client/dist")));
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.get("/api", (req, res) => {
  res.send("Hello from the API");
});

// Catch-all route to serve index.html for any other requests
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist", "index.html"));
});

io.on("connection", (socket) => {
  try {
    const socket = clientIO(process.env.RMF_URL);

    function subscribeToRoom(roomName) {
      console.log(`Subscribing to room ${roomName}`);
      socket.emit("subscribe", { room: roomName });
    }

    function handleMapData(message) {
      io.emit("building_map", message);
    }

    subscribeToRoom("/building_map");
    socket.on("/building_map", handleMapData);
  } catch (err) {
    console.log(err.message);
  }

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
