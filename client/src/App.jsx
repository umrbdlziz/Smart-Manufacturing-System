import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import {
  RealTimeMonitoring,
  JobAssignment,
  Dashboard,
  ProcessControl,
} from "./pages";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/real-time-monitoring" element={<RealTimeMonitoring />} />
        <Route path="/job-assignment" element={<JobAssignment />} />
        <Route path="/process-control" element={<ProcessControl />} />
      </Routes>
    </Router>
  );
}

export default App;
