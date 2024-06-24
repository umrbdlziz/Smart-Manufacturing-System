import { Paper, Typography, Grid, Box } from "@mui/material";
import jobData from "../JobData.json";

const JobDetails = () => {
  return (
    <Box m={2}>
      <Typography variant="h5" align="center" gutterBottom>
        Job Details
      </Typography>
      <Grid container spacing={2}>
        {jobData &&
          jobData.map((job, index) => (
            <Grid item xs={12} md={6} xl={4} key={index}>
              <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  <strong>Job Name:</strong> {job["Job name"]}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  <strong>Job Description:</strong> {job["Job description"]}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  <strong>Quantity:</strong> {job.Qty}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  <strong>Batch Number:</strong> {job["Batch number"]}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  <strong>Process:</strong> {job.Process}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  <strong>Machine:</strong> {job.Machine}
                </Typography>
              </Paper>
            </Grid>
          ))}
      </Grid>
    </Box>
  );
};

export default JobDetails;
