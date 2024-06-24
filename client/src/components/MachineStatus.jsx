import { Paper, Typography, Box } from "@mui/material";

import machineData from "../data.json";

const MachineStatus = () => {
  return (
    <>
      <Paper
        sx={{
          padding: "15px",
          height: "80vh",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          overflowY: "scroll",
        }}
      >
        <Typography variant="h6">Machine Status</Typography>
        <Box display="flex" flexDirection="column" gap={5}>
          {machineData.length !== 0 ? (
            [...machineData].reverse().map((machine) => (
              <Box key={machine.machine}>
                <Box>
                  <Typography variant="body1" component="div">
                    Machine: {machine.machine}
                  </Typography>
                </Box>
                <Box>
                  <Typography color="textSecondary" variant="caption">
                    Job description: {machine.job_description}
                  </Typography>
                </Box>
                <Box>
                  <Typography color="textSecondary" variant="caption">
                    Quantity: {machine.quantity}
                  </Typography>
                </Box>
                <Box>
                  <Typography color="textSecondary" variant="caption">
                    Next process: {machine.next_process}
                  </Typography>
                </Box>
                <Box>
                  <Typography color="textSecondary" variant="caption">
                    Status: {machine.status[0]}
                  </Typography>
                </Box>
              </Box>
            ))
          ) : (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              height="50vh"
            >
              <Typography variant="body1">No tasks available</Typography>
            </Box>
          )}
        </Box>
      </Paper>
    </>
  );
};

export default MachineStatus;
