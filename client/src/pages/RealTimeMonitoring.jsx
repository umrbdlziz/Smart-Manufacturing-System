import { Box, Grid } from "@mui/material";
import { LiveMap, MachineStatus } from "../components";

const RealTimeMonitoring = () => {
  return (
    <>
      <Box m={2}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={9}>
            <LiveMap />
          </Grid>
          <Grid item xs={12} md={3}>
            <MachineStatus />
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default RealTimeMonitoring;
