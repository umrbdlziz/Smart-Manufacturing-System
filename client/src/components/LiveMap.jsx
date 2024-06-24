import { useEffect, useState } from "react";
import { Typography, Paper } from "@mui/material";
import io from "socket.io-client";
import axios from "axios";

import {
  MapContainer,
  ImageOverlay,
  Marker,
  Popup,
  Circle,
  Polyline,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-rotatedmarker";

import { CustomSnackbar } from "../utils";
import FleetIcon from "/FleetIcon.svg";

const LiveMap = () => {
  const [robotState, setRobotState] = useState([{}]);
  const [mapUrl, setMapUrl] = useState("");
  const [imgXY, setImgXY] = useState({ x: 0, y: 0 });
  const [bounds, setBounds] = useState([
    [0, 0],
    [0, 0],
  ]);
  const [waypoints, setWaypoints] = useState([]);
  const [edges, setEdges] = useState([]);
  const [scale, setScale] = useState([]);

  // state for snackbar
  const [snackbarMessage, setSnackbarMessage] = useState({
    message: "",
    severity: "",
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    // const socket = io("http://192.168.1.48:5003");
    const socket = io();

    // Fetch fleet names from the /fleet endpoint
    axios
      // .get("http://192.168.1.48:5003/api/rmf/get_fleets")
      .get("/api/rmf/get_fleets")
      .then((response) => {
        console.log(response.data);
        const fleetNames = response.data.fleets; // assuming the response data is an array of fleet names
        // Subscribe to each fleet's state
        fleetNames.forEach((fleetName) => {
          socket.on(`${fleetName.name}_state`, (data) => {
            setRobotState(data.robots);
          });
        });
      })
      .catch((err) => console.log(err.message));

    socket.on("building_map", (data) => {
      setMapUrl(data.levels[0].images[0].data);
      setWaypoints(data.levels[0].nav_graphs[0].vertices);
      setEdges(data.levels[0].nav_graphs[0].edges);
      setScale(data.levels[0].images[0].scale);
    });

    if (mapUrl === "") {
      setOpenSnackbar(true);
      setSnackbarMessage({
        message: "Map is not available",
        severity: "error",
      });
    }

    return () => {
      socket.disconnect();
    };
  }, [mapUrl]);

  useEffect(() => {
    const img = new Image();
    img.src = mapUrl;
    img.onload = () => {
      setImgXY({ x: img.width, y: img.height });
      setBounds([
        [0, 0],
        [img.height, img.width],
      ]);
    };
  }, [mapUrl]);

  // use for initialize robot icon in map
  const myIcon = L.icon({
    iconUrl: FleetIcon,
    iconSize: [30, 30],
  });

  const robotMarkers = Object.values(robotState).map((robot) => {
    if (!robot.location) return null;
    const { x, y, yaw } = robot.location;
    const scaledX = x / scale;
    const scaledY = imgXY.y - y / -scale;

    const { name, status } = robot;

    return (
      <Marker
        key={`${name}-${yaw}`}
        position={[scaledY, scaledX]}
        icon={myIcon}
        rotationAngle={yaw * (180 / Math.PI) + 180} // rotate the marker
        rotationOrigin={"center center"} // rotate around the center
      >
        <Popup>
          <strong>{name}</strong>
          <br />
          Status: {status}
          <br />
          Battery: {robot.battery * 100}%
        </Popup>
      </Marker>
    );
  });

  const waypointMarkers = waypoints.map((waypoint, index) => {
    const scaledX = waypoint.x / scale;
    const scaledY = imgXY.y - waypoint.y / -scale;
    return (
      <Circle
        key={index}
        center={[scaledY, scaledX]}
        radius={3000 * scale}
        fillColor="blue"
        fillOpacity={0.5}
        stroke={false}
      >
        <Popup>{waypoint.name || "Unnamed waypoint"}</Popup>
      </Circle>
    );
  });

  const edgeLines = edges.map((edge, index) => {
    const v1 = waypoints[edge.v1_idx];
    const v2 = waypoints[edge.v2_idx];

    const v1ScaledX = v1.x / scale;
    const v1ScaledY = imgXY.y - v1.y / -scale;
    const v2ScaledX = v2.x / scale;
    const v2ScaledY = imgXY.y - v2.y / -scale;

    return (
      <Polyline
        key={index}
        positions={[
          [v1ScaledY, v1ScaledX],
          [v2ScaledY, v2ScaledX],
        ]}
        color="green"
      >
        <Popup>{`Edge from ${edge.v1_idx} to ${edge.v2_idx}`}</Popup>
      </Polyline>
    );
  });

  return (
    <>
      <Paper sx={{ padding: "10px" }}>
        <Typography variant="h4">Live Map</Typography>
        <MapContainer
          center={{ lat: 1000, lng: 1500 }}
          zoom={-2}
          minZoom={-5}
          style={{ height: "75vh", width: "100%" }}
          crs={L.CRS.Simple}
        >
          <ImageOverlay url={mapUrl} bounds={bounds} />
          {robotMarkers}
          {waypointMarkers}
          {edgeLines}
        </MapContainer>
      </Paper>

      <CustomSnackbar
        open={openSnackbar}
        onClose={() => setOpenSnackbar(false)}
        message={snackbarMessage.message}
        severity={snackbarMessage.severity}
      />
    </>
  );
};

export default LiveMap;
