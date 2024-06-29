// src/Dashboard.js

import { Container, Grid, Paper, Typography } from "@mui/material";
import { BarChart, LineChart, PieChart } from "@mui/x-charts";
import { machineData } from "../machineInfo";

const Dashboard = () => {
  const jobCompletedData = machineData.map((machine) => machine.jobsCompleted);
  const totalQtyData = machineData.map((machine) => machine.totalQty);
  const upTimeData = machineData.map((machine) => machine.upTime);
  const downTimeData = machineData.map((machine) => machine.downTime);
  const energyUsedData = machineData.map((machine, index) => ({
    id: index,
    value: machine.energyUsed,
    label: machine.name,
  }));
  const categories = machineData.map((machine) => machine.name);

  return (
    <Container maxWidth="lg" style={{ marginTop: "20px" }}>
      <Typography variant="h4" gutterBottom>
        Machine Performance
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper style={{ padding: "20px" }}>
            <Typography variant="h6" gutterBottom>
              Jobs Completed
            </Typography>
            <BarChart
              xAxis={[{ scaleType: "band", data: categories }]}
              series={[{ data: jobCompletedData }]}
              width={500}
              height={300}
            />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper style={{ padding: "20px" }}>
            <Typography variant="h6" gutterBottom>
              Total Quantity
            </Typography>
            <LineChart
              xAxis={[{ scaleType: "band", data: categories }]}
              series={[
                {
                  data: totalQtyData,
                },
              ]}
              width={500}
              height={300}
            />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper style={{ padding: "20px" }}>
            <Typography variant="h6" gutterBottom>
              Up Time vs Down Time
            </Typography>
            <BarChart
              xAxis={[{ scaleType: "band", data: categories }]}
              series={[{ data: upTimeData }, { data: downTimeData }]}
              width={500}
              height={300}
            />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper style={{ padding: "20px", height: "380px" }}>
            <Typography variant="h6" gutterBottom>
              Energy Used
            </Typography>
            <PieChart
              x
              series={[
                {
                  data: energyUsedData,
                },
              ]}
              width={500}
              height={220}
            />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
