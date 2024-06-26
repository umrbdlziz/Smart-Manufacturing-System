const express = require("express");
const db = require("../models/connectdb");
const OPCUAClientManager = require("../opcua_client");
const app = express();
const opcuaClientManager = new OPCUAClientManager();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const nodes = {
  "machine-type": "ns=2;s=Rollomatic/Identification/Type",
  "grinding-temperature":
    "ns=2;s=Rollomatic/Monitoring/Temperatures/GrindingZone",
  "outside-above-temperature":
    "ns=2;s=Rollomatic/Monitoring/Temperatures/OutsideAbove",
  "coolant-temperature": "ns=2;s=Rollomatic/Monitoring/Temperatures/Coolant",
  "outside-below-temperature":
    "ns=2;s=Rollomatic/Monitoring/Temperatures/OutsideBelow",
  "running-cycle-time":
    "ns=2;s=Rollomatic/Production/ProductionPlan/Job 1/RunningCycleTime",
  "end-of-production":
    "ns=2;s=Rollomatic/Production/ProductionPlan/Job 1/EndOfProduction",
  "machine-status": "ns=2;s=Rollomatic/Production/MachineStatus",
};

// Fetch machines from the database
async function getMachines() {
  const machinesSQL = "SELECT * FROM machines";
  try {
    const machinesResult = await db.executeAllSQL(machinesSQL, []);
    return machinesResult;
  } catch (error) {
    console.error("Error fetching machines from database:", error.message);
    return [];
  }
}

// Connect to each machine and setup routes for each node
// async function setupMachineRoutes() {
//   const machines = await getMachines();
//   machines.forEach((machine) => {
//     opcuaClientManager.connectToServer(
//       machine.machine_name,
//       machine.machine_url
//     );
//     Object.keys(nodes).forEach((nodeKey) => {
//       app.get(`/${machine.machine_name}/${nodeKey}`, async (req, res) => {
//         try {
//           const value = await opcuaClientManager.readNodeValue(
//             machine.machine_name,
//             nodes[nodeKey]
//           );
//           res.json({
//             machineId: machine.machine_name,
//             nodeId: nodes[nodeKey],
//             value,
//           });
//         } catch (error) {
//           res.status(500).json({ error: error.message });
//         }
//       });
//     });
//   });
// }

async function setupMachineRoutes() {
  const machines = await getMachines();
  machines.forEach((machine) => {
    opcuaClientManager.connectToServer(
      machine.machine_name,
      machine.machine_url
    );
    app.get(`/${machine.machine_name}`, async (req, res) => {
      try {
        const machineData = {
          machineId: machine.machine_name,
          nodes: {},
        };
        for (const nodeKey of Object.keys(nodes)) {
          machineData.nodes[nodeKey] = await opcuaClientManager.readNodeValue(
            machine.machine_name,
            nodes[nodeKey]
          );
          if (nodeKey === "end-of-production") {
            const dateObj = new Date(machineData.nodes[nodeKey]);
            machineData.nodes[nodeKey] = dateObj.toLocaleString();
          } else if (nodeKey === "machine-status") {
            switch (machineData.nodes[nodeKey]) {
              case 0:
                machineData.nodes[nodeKey] = "Settings";
                break;
              case 1:
                machineData.nodes[nodeKey] = "Production";
                break;
              case 2:
                machineData.nodes[nodeKey] = "Shutdown";
                break;
              case 3:
                machineData.nodes[nodeKey] = "Alarm";
                break;
              case 4:
                machineData.nodes[nodeKey] = "Warmup";
                break;
              case 5:
                machineData.nodes[nodeKey] = "WarningStop";
                break;

              default:
                break;
            }
          }
        }
        res.json(machineData);
      } catch (error) {
        console.log("Error get machine data: ", error.message);
      }
    });
  });
}

// Connect to each machine and setup a single route for all nodes
async function setupMachineInfoRoute() {
  app.get("/machine-info", async (req, res) => {
    const machines = await getMachines();
    machines.forEach((machine) => {
      opcuaClientManager.connectToServer(
        machine.machine_name,
        machine.machine_url
      );
    });
    try {
      const machineInfo = await Promise.all(
        machines.map(async (machine) => {
          const machineData = {
            machineId: machine.machine_name,
            nodes: {},
          };
          for (const nodeKey of Object.keys(nodes)) {
            machineData.nodes[nodeKey] = await opcuaClientManager.readNodeValue(
              machine.machine_name,
              nodes[nodeKey]
            );
            if (nodeKey === "end-of-production") {
              const dateObj = new Date(machineData.nodes[nodeKey]);
              machineData.nodes[nodeKey] = dateObj.toLocaleString();
            } else if (nodeKey === "machine-status") {
              switch (machineData.nodes[nodeKey]) {
                case 0:
                  machineData.nodes[nodeKey] = "Settings";
                  break;
                case 1:
                  machineData.nodes[nodeKey] = "Production";
                  break;
                case 2:
                  machineData.nodes[nodeKey] = "Shutdown";
                  break;
                case 3:
                  machineData.nodes[nodeKey] = "Alarm";
                  break;
                case 4:
                  machineData.nodes[nodeKey] = "Warmup";
                  break;
                case 5:
                  machineData.nodes[nodeKey] = "WarningStop";
                  break;

                default:
                  break;
              }
            }
          }
          return machineData;
        })
      );
      res.json(machineInfo);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
}

app.get("/machines", async (req, res) => {
  try {
    setupMachineInfoRoute();
    setupMachineRoutes();
    const machines = await getMachines();
    res.json(machines);
  } catch (error) {
    console.error("Error getting machines:", error.message);
    res.status(500).json({ error: error.message });
  }
});

app.post("/machines", async (req, res) => {
  const { machineName, machinePort, machineUrl, machineWaypoint } = req.body;
  try {
    const machineSQL =
      "INSERT INTO machines (machine_name, machine_port, machine_url, waypoint) VALUES (?, ?, ?, ?)";
    const machineValues = [
      machineName,
      machinePort,
      machineUrl,
      machineWaypoint,
    ];
    const machineResult = await db.executeRunSQL(machineSQL, machineValues);
    setupMachineInfoRoute();
    setupMachineRoutes();

    res.send(machineResult);
  } catch (error) {
    console.error("Error adding machine:", error.message);
    res.status(500).json({ error: error.message });
  }
});

process.on("SIGINT", async () => {
  await opcuaClientManager.disconnectFromServer();
  // Do not call process.exit() here to allow other SIGINT handlers to run
});

module.exports = app;
