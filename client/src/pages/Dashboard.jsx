import { useState, useEffect, useContext } from "react";
import axios from "axios";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  MenuItem,
  Grid,
} from "@mui/material";
import {
  PrecisionManufacturing,
  Thermostat,
  ThermostatAuto,
  AccessTime,
  Schedule,
  Engineering,
} from "@mui/icons-material";

import { AddMachineBtn } from "../components";
import { ServerContext } from "../context";

const Dashboard = () => {
  const { SERVER_URL } = useContext(ServerContext);
  const [machines, setMachines] = useState([]);
  const [open, setOpen] = useState(false);
  const [waypoints, setWaypoints] = useState([]);
  const [formData, setFormData] = useState({
    machineName: "",
    machinePort: "",
    waypoint: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    axios
      .get(`${SERVER_URL}/api/machine-info`)
      .then((response) => {
        // console.log(response.data);
        setMachines(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [machines, SERVER_URL]);

  // get the waypoint from building map rmf endpoint
  useEffect(() => {
    const findWaypoints = (waypoints) => {
      return waypoints.filter((waypoint) => waypoint.name !== "");
    };

    axios
      .get(`${SERVER_URL}/api/rmf/building-map`)
      .then((response) => {
        setWaypoints(
          findWaypoints(response.data.map.levels[0].nav_graphs[0].vertices)
        );
      })
      .catch((error) => {
        console.log(error);
      });
  }, [SERVER_URL]);

  useEffect(() => {
    axios
      .get(`${SERVER_URL}/api/machines`)
      .then((response) => {
        // console.log(response.data);
      })
      .catch((err) => {
        console.log("Error get machines: ", err.message);
      });
  });

  const handleAddMachine = () => {
    axios
      .post(`${SERVER_URL}/api/machines`, {
        machineName: formData.machineName,
        machinePort: formData.machinePort,
        machineUrl: `opc.tcp://${formData.machineName}:${formData.machinePort}/`,
        machineWaypoint: formData.waypoint,
      })
      .then((response) => {
        console.log(response.data);
        setFormData({
          machineName: "",
          machinePort: "",
          waypoint: "",
        });
        setOpen(false);
        setMachines([]);
      })
      .catch((error) => {
        console.error("Error adding machine:", error.message);
      });
  };

  return (
    <Box display="flex" flexDirection="row" flexWrap="wrap" m={2} gap={2}>
      {machines.map((machine, index) => (
        <Card
          key={index}
          variant="outlined"
          sx={{ width: "350px", height: "350px", mb: 2 }}
        >
          <CardContent>
            <Typography variant="h5" component="div" sx={{ mb: 2 }}>
              {machine.machineId}
            </Typography>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <Box display="flex" alignItems="center">
                  <Engineering sx={{ mr: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    <strong>Machine Status</strong>:{" "}
                    {machine.nodes["machine-status"]}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box display="flex" alignItems="center">
                  <PrecisionManufacturing sx={{ mr: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    <strong>Machine Type</strong>:{" "}
                    {machine.nodes["machine-type"]}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box display="flex" alignItems="center">
                  <Thermostat sx={{ mr: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    <strong>Grinding Temperature</strong>:{" "}
                    {machine.nodes["grinding-temperature"]} °C
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box display="flex" alignItems="center">
                  <ThermostatAuto sx={{ mr: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    <strong>Coolant Temperature</strong>:{" "}
                    {machine.nodes["coolant-temperature"]} °C
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box display="flex" alignItems="center">
                  <Thermostat sx={{ mr: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    <strong>Outside Above Temperature</strong>:{" "}
                    {machine.nodes["outside-above-temperature"]} °C
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box display="flex" alignItems="center">
                  <Thermostat sx={{ mr: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    <strong>Outside Below Temperature</strong>:{" "}
                    {machine.nodes["outside-below-temperature"]} °C
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box display="flex" alignItems="center">
                  <AccessTime sx={{ mr: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    <strong>Running Cycle Time</strong>:{" "}
                    {machine.nodes["running-cycle-time"]} sec
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box display="flex" alignItems="center">
                  <Schedule sx={{ mr: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    <strong>End of Production</strong>:{" "}
                    {machine.nodes["end-of-production"]}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      ))}
      <AddMachineBtn onClick={() => setOpen(true)} />
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          style: {
            backgroundColor: "#2D465A", // Replace '#yourColor' with your desired color code
          },
        }}
      >
        <DialogTitle>Add New Machine</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To add a new machine, please enter the machine ID and its OPC UA
            server URL.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="machineId"
            label="Machine ID"
            type="text"
            fullWidth
            variant="outlined"
            name="machineName"
            value={formData.machineName}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            id="machinePort"
            label="Machine Port"
            type="text"
            fullWidth
            variant="outlined"
            name="machinePort"
            value={formData.machinePort}
            onChange={handleChange}
          />
          <TextField
            select
            margin="dense"
            id="waypoint"
            label="Waypoint"
            type="text"
            fullWidth
            variant="outlined"
            name="waypoint"
            value={formData.waypoint}
            onChange={handleChange}
          >
            {waypoints.map((waypoint, index) => (
              <MenuItem key={index} value={waypoint.name}>
                {waypoint.name}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleAddMachine} color="secondary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Dashboard;
