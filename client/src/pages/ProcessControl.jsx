import { useContext } from "react";
import { Box, Grid } from "@mui/material";
import BlocklyComponent, { Block } from "../components/Blockly";
import axios from "axios";

import { ProcessDetails } from "../components";
import { ServerContext } from "../context";

const ProcessControl = () => {
  const { SERVER_URL } = useContext(ServerContext);
  const handlePatternSave = (code) => {
    console.log("Saving process:", code);
    axios
      .post(`${SERVER_URL}/api/process`, {
        processSeq: code,
      })
      .catch((err) => {
        console.log("Error saving process:", err.message);
      });
  };
  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={8}>
          <div style={{ margin: "10px" }}>
            <BlocklyComponent handlePatternSave={handlePatternSave}>
              <Block type="movement" />
              <Block type="grinding" />
              <Block type="cleaning" />
              <Block type="item" />
            </BlocklyComponent>
          </div>
        </Grid>
        <Grid item xs={4}>
          <ProcessDetails />
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProcessControl;
