import { useEffect, useState, useContext } from "react";
import { Box, Card, CardContent, Grid, Paper, Typography } from "@mui/material";
import { DirectionsRun, Build, LocalDrink } from "@mui/icons-material";
import axios from "axios";

import { ServerContext } from "../context";

const ProcessDetails = () => {
  const { SERVER_URL } = useContext(ServerContext);

  const [processData, setProcessData] = useState([]);
  useEffect(() => {
    axios
      .get(`${SERVER_URL}/api/process`)
      .then((res) => {
        setProcessData(res.data);
      })
      .catch((err) => {
        console.log(err.message);
      });
  });

  const parseProcessStep = (step) => {
    // Extract the JSON part of the string
    const jsonString = step.replace(/^.*?:\s*/, "");

    // Parse the JSON string to an object
    const data = JSON.parse(jsonString);

    // Return the extracted item name and quantity
    return {
      itemName: data.item_name,
      quantity: data.quantity,
    };
  };

  return (
    <Box m={2}>
      <Typography variant="h4" component="div" sx={{ mb: 2 }}>
        Process Details
      </Typography>
      {processData.map((process) => (
        <Card
          variant="outlined"
          sx={{ maxWidth: 500, mb: 2 }}
          key={process.process_id}
        >
          <CardContent>
            <Typography variant="h5" component="div" sx={{ mb: 2 }}>
              Process ID: {process.process_id}
            </Typography>
            <Grid container>
              {process.process_sequence.map((step, index) => {
                let icon, label, itemName, quantity;
                if (step.startsWith("move")) {
                  icon = <DirectionsRun sx={{ mr: 1 }} />;
                  label = "Move";
                } else if (step.startsWith("grind")) {
                  icon = <Build sx={{ mr: 1 }} />;
                  label = "Grind";
                  ({ itemName, quantity } = parseProcessStep(step));
                } else if (step.startsWith("clean")) {
                  icon = <LocalDrink sx={{ mr: 1 }} />;
                  label = "Clean";
                  ({ itemName, quantity } = parseProcessStep(step));
                }

                return (
                  <Grid item xs={12} key={index}>
                    <Paper
                      variant="outlined"
                      sx={{ p: 2, display: "flex", alignItems: "center" }}
                    >
                      {icon}
                      <Box>
                        <Typography variant="body1">{label}</Typography>
                        {itemName && quantity ? (
                          <Typography variant="body2" color="text.secondary">
                            Item Name: {itemName}, Quantity: {quantity}
                          </Typography>
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            {step}
                          </Typography>
                        )}
                      </Box>
                    </Paper>
                  </Grid>
                );
              })}
            </Grid>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default ProcessDetails;
