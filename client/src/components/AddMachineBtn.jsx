import { Button, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import PropTypes from "prop-types";

const AddMachineBtn = ({ onClick }) => {
  return (
    <Button
      onClick={onClick}
      variant="outlined"
      color="primary"
      sx={{
        width: "350px",
        height: "350px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        padding: "20px",
        "&:hover": {
          backgroundColor: "primary.dark",
        },
      }}
    >
      <AddIcon sx={{ fontSize: "100px" }} />
      <Typography variant="caption">Add machine</Typography>
    </Button>
  );
};

AddMachineBtn.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default AddMachineBtn;
