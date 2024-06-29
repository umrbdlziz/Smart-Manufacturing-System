import { useEffect, useState, useContext } from "react";
import {
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
} from "@mui/material";
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
    <Box m={2} p={10}>
      <Typography variant="h5" align="center" gutterBottom>
        Job Details
      </Typography>
      {jobData ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <strong>Bil</strong>
                </TableCell>{" "}
                {/* Add this line */}
                <TableCell>
                  <strong>Job Name</strong>
                </TableCell>
                <TableCell>
                  <strong>Job Description</strong>
                </TableCell>
                <TableCell>
                  <strong>Batch Number</strong>
                </TableCell>
                <TableCell>
                  <strong>Process</strong>
                </TableCell>
                <TableCell>
                  <strong>Machine</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {jobData.map((job, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell> {/* Add this line */}
                  <TableCell>{job.job_name}</TableCell>
                  <TableCell>{job.job_description}</TableCell>
                  <TableCell>{job.batch_number}</TableCell>
                  <TableCell>{job.process_id}</TableCell>
                  <TableCell>{job.machine}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography variant="subtitle1" align="center">
          Loading job details...
        </Typography>
      )}
    </Box>
  );
};

export default JobDetails;
