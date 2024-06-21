import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Typography } from "@mui/material";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Typography>Dashboard</Typography>} />
        <Route
          path="/real-time-monitoring"
          element={<Typography>Real Time Monitoring</Typography>}
        />
        <Route
          path="/job-assignment"
          element={<Typography>Job Assignment</Typography>}
        />
        <Route
          path="/process-control"
          element={<Typography>process control</Typography>}
        />
      </Routes>
    </Router>
  );
}

export default App;
