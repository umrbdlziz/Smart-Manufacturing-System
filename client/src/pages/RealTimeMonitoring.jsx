import { useEffect } from "react";
import io from "socket.io-client";

const RealTimeMonitoring = () => {
  useEffect(() => {
    const socket = io();
    socket.on("connect", () => {
      console.log("Connected to server");
    });

    socket.on("building_map", (data) => {
      console.log("Building Map Data: ", data);
    });

    socket.on("connect_error", (error) => {
      console.log(error);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return <div>RealTimeMonitoring</div>;
};

export default RealTimeMonitoring;
