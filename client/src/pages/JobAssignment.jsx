import { Grid } from "@mui/material";

import { JobAssignmentForm, JobDetails } from "../components";

const JobAssignment = () => {
  return (
    <Grid container>
      <Grid item xs={12} md={6}>
        <JobAssignmentForm />
      </Grid>
      <Grid item xs={12} md={6}>
        <JobDetails />
      </Grid>
    </Grid>
  );
};

export default JobAssignment;
