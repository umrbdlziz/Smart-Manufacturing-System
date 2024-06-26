import { useEffect, useState, useContext } from "react";
import { Paper, Typography, Grid, Box } from "@mui/material";
import axios from "axios";

import { ServerContext } from "../context";

const JobDetails = () => {
  const { SERVER_URL } = useContext(ServerContext);
  const [jobData, setJobData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${SERVER_URL}/api/jobs`);
        setJobData(response.data);
      } catch (error) {
        console.error("Error fetching job data:", error);
      }
    };

    fetchData();
  }, [SERVER_URL]);

  return (
    <Box m={2}>
      <Typography variant="h5" align="center" gutterBottom>
        Job Details
      </Typography>
      <Grid container spacing={2}>
        {jobData && jobData.length === 0 && (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="50vh"
            width="50vw"
          >
            <Typography variant="h6">No job details found.</Typography>
          </Box>
        )}
        {jobData ? (
          jobData.map((job, index) => (
            <Grid item xs={12} md={6} xl={4} key={index}>
              <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  <strong>Job Name:</strong> {job.job_name}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  <strong>Job Description:</strong> {job.job_description}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  <strong>Quantity:</strong> {job.qty}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  <strong>Batch Number:</strong> {job.batch_number}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  <strong>Process:</strong> {job.process_id}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  <strong>Machine:</strong> {job.machine}
                </Typography>
              </Paper>
            </Grid>
          ))
        ) : (
          <Typography variant="subtitle1" align="center">
            Loading job details...
          </Typography>
        )}
      </Grid>
    </Box>
  );
};

export default JobDetails;
