const express = require("express");
const app = express();
const db = require("../models/connectdb");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.post("/fleet", async (req, res) => {
  const { task_type, station, rack, side } = req.body;

  try {
    const message = await fleet(task_type, station, rack, side);
    res.send(message);
  } catch (err) {
    console.error(err.message);
  }
});

async function fleet(task_type, pickup_station, dropoff_station, quantity) {
  console.log("Requesting Robot");
  console.log("Task type: ", task_type);
  console.log(
    "Pickup station: ",
    pickup_station,
    "Dropoff station: ",
    dropoff_station,
    "Quantity: ",
    quantity
  );
  // get the robot api to be sent
  const sql_robot = "SELECT * FROM constants WHERE constant = ?";
  const params_robot = "robot api";
  const result_robot = await db.executeGetSQL(sql_robot, params_robot);
  const robot_api = result_robot.value;

  if (!robot_api || robot_api === "") {
    console.log("Unable to get robot api");
    return { message: "Unable to get robot api" };
  }

  const data_send = {
    robot: "NanoBot_5",
    fleet: "NanoBot",
    task_type: "Tray_Transfer",
    start_time: 0,
    priority: 0,
    description: {
      picks_up_station: {
        station: pickup_station,
        task: { target_task: "PickUpFromStation", quantity: quantity },
      },
      drop_off_station: {
        station: dropoff_station,
        task: { target_task: "DeliverToStation", quantity: quantity },
      },
      parking_station: { station: "parking_station" },
    },
  };
  executeRobot(data_send, robot_api);
}

async function fleetAbort() {
  const sql_robot = "SELECT * FROM constants WHERE constant = ?";
  const params_robot = "robot api";
  const result_robot = await db.executeGetSQL(sql_robot, params_robot);
  robot_api = result_robot.value;
  if (robot_api == "") {
    throw new Error("Unable to get robot api");
  }

  const api_url = `http://${robot_api}/mission/${mission}/cancel`;

  try {
    const response = await fetch(api_url, {
      method: "POST",
      body: JSON.stringify(data_send),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
  } catch (err) {
    console.error(err.message);
    return;
  }

  console.log("Robot is abort");
}

async function executeRobot(data_send, robot_api) {
  const api_url = `http://${robot_api}/submit_task`;
  console.log(`API: ${api_url}`);
  console.log(data_send);

  return;

  try {
    const response = await fetch(api_url, {
      method: "POST",
      body: JSON.stringify(data_send),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
  } catch (err) {
    console.error(err.message);
    return;
  }

  console.log("Robot is called");
}

module.exports = { app, fleet, fleetAbort };
