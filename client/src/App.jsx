import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import {
  RealTimeMonitoring,
  JobAssignment,
  Dashboard,
  ProcessControl,
} from "./pages";
import { TopBar } from "./utils";
import { ServerContext } from "./context";

const SERVER_URL = "http://192.168.1.48:5003";

function App() {
  return (
    <ServerContext.Provider value={{ SERVER_URL }}>
      <Router>
        <TopBar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route
            path="/real-time-monitoring"
            element={<RealTimeMonitoring />}
          />
          <Route path="/job-assignment" element={<JobAssignment />} />
          <Route path="/process-control" element={<ProcessControl />} />
        </Routes>
      </Router>
    </ServerContext.Provider>
  );
}

export default App;
