import { useState } from "react";
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

const JobAssignmentForm = () => {
  const [formData, setFormData] = useState({
    jobName: "",
    jobDescription: "",
    qty: "",
    batchNumber: "",
    process: [{ name: "", remarks: "" }],
    machine: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProcessChange = (index, e) => {
    const { name, value } = e.target;
    const processes = [...formData.process];
    processes[index][name] = value;
    setFormData((prev) => ({
      ...prev,
      process: processes,
    }));
  };

  const addProcess = () => {
    setFormData((prev) => ({
      ...prev,
      process: [...prev.process, { name: "", remarks: "" }],
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
  };

  return (
    <Box display="flex" height="90vh" alignItems="center">
      <Container component="main" maxWidth="sm">
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h5" align="center" gutterBottom>
            Job Form
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
              label="Quantity"
              name="qty"
              value={formData.qty}
              onChange={handleChange}
              fullWidth
              margin="normal"
              type="number"
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
                  label={`Process ${index + 1}`}
                  name="name"
                  value={process.name}
                  onChange={(e) => handleProcessChange(index, e)}
                  fullWidth
                  margin="normal"
                />
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
                <MenuItem value="SN 888">SN 888</MenuItem>
                {/* Add more machine options here if needed */}
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