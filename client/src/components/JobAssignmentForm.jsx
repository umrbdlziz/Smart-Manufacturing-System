import { useState, useContext, useEffect } from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  Container,
  IconButton,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import axios from "axios";

import { ServerContext } from "../context";

const JobAssignmentForm = () => {
  const { SERVER_URL } = useContext(ServerContext);

  const [formData, setFormData] = useState({
    jobName: "",
    jobDescription: "",
    batchNumber: "",
    process: [""], // Changed to array of strings
    machine: "",
  });
  const [processData, setProcessData] = useState([]);

  useEffect(() => {
    axios
      .get(`${SERVER_URL}/api/process`)
      .then((response) => {
        setProcessData(response.data);
      })
      .catch((err) => {
        console.error("Error getting processes:", err.message);
      });
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProcessChange = (index, value) => {
    const processes = [...formData.process];
    processes[index] = value; // Update the string at the specific index
    setFormData((prev) => ({
      ...prev,
      process: processes,
    }));
  };

  const addProcess = () => {
    setFormData((prev) => ({
      ...prev,
      process: [...prev.process, ""], // Add an empty string
    }));
  };

  const removeProcess = (index) => {
    const processes = [...formData.process];
    processes.splice(index, 1);
    setFormData((prev) => ({
      ...prev,
      process: processes,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    axios
      .post(`${SERVER_URL}/api/jobs`, formData)
      .then((response) => {
        console.log(response.data);
      })
      .catch((err) => {
        console.error("Error submitting job form:", err.message);
      });

    setFormData({
      jobName: "",
      jobDescription: "",
      batchNumber: "",
      process: [""], // Reset to initial state with an empty string
      machine: "",
    });
  };

  return (
    <Box display="flex" height="90vh" alignItems="center">
      <Container component="main" maxWidth="sm">
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h5" align="center" gutterBottom>
            Job Order
          </Typography>
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              label="Job Name"
              name="jobName"
              value={formData.jobName}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Job Description"
              name="jobDescription"
              value={formData.jobDescription}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Batch Number"
              name="batchNumber"
              value={formData.batchNumber}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            {formData.process.map((process, index) => (
              <Box key={index} display="flex" alignItems="center" my={1}>
                <TextField
                  select
                  label={`Process ${index + 1}`}
                  value={process}
                  onChange={(e) => handleProcessChange(index, e.target.value)}
                  fullWidth
                  margin="normal"
                >
                  {processData.map((step, index) => (
                    <MenuItem key={index} value={step.process_id}>
                      {step.process_id}
                    </MenuItem>
                  ))}
                </TextField>
                <IconButton onClick={() => removeProcess(index)}>
                  <Delete />
                </IconButton>
              </Box>
            ))}
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<Add />}
              onClick={addProcess}
              fullWidth
              sx={{ mb: 2 }}
            >
              Add Process
            </Button>
            <FormControl fullWidth margin="normal">
              <InputLabel id="machine-label">Machine</InputLabel>
              <Select
                labelId="machine-label"
                id="machine"
                name="machine"
                value={formData.machine}
                onChange={handleChange}
              >
                <MenuItem value="GrindSmart620XS">GrindSmart620XS</MenuItem>
                <MenuItem value="GrindSmart528XS">GrindSmart528XS</MenuItem>
                <MenuItem value="GrindSmart830XW">GrindSmart830XW</MenuItem>
              </Select>
            </FormControl>
            <Button
              type="submit"
              variant="contained"
              color="secondary"
              fullWidth
            >
              Submit
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default JobAssignmentForm;
