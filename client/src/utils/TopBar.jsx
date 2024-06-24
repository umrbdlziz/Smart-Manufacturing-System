import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import {
  AppBar,
  Toolbar,
  IconButton,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import WorkIcon from "@mui/icons-material/Work";
import MonitorIcon from "@mui/icons-material/Monitor";
import AccountTreeIcon from "@mui/icons-material/AccountTree";

import NanoIcon from "/NanoIcon.png";
import NanoLogo from "/CompanyLogo.png";

const CustomDrawer = ({ drawerOpen, toggleDrawer }) => {
  const navigate = useNavigate();
  const handleUserClick = (page) => {
    toggleDrawer(false);
    navigate(page);
  };

  return (
    <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
      <Box
        sx={{
          display: "flex", // Set display to flex
          flexDirection: "column", // Arrange children in a column
          height: "100%", // Take up full height
          width: 220,
          marginTop: 4,
        }}
        role="presentation"
        onClick={toggleDrawer(false)}
      >
        <IconButton
          edge="end"
          onClick={() => navigate("/")}
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img src={NanoLogo} alt="NanoLogo" style={{ width: "150px" }} />
        </IconButton>
        <List sx={{ flexGrow: 1 }}>
          {" "}
          {/* Make this List grow to take available space */}
          <ListItem button onClick={() => handleUserClick("/")}>
            <ListItemIcon>
              <DashboardIcon style={{ color: "#EFF1ED" }} />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItem>
          <ListItem
            button
            onClick={() => handleUserClick("/real-time-monitoring")}
          >
            <ListItemIcon>
              <MonitorIcon style={{ color: "#EFF1ED" }} />
            </ListItemIcon>
            <ListItemText primary="Real Time Monitoring" />
          </ListItem>
          <ListItem button onClick={() => handleUserClick("/job-assignment")}>
            <ListItemIcon>
              <WorkIcon style={{ color: "#EFF1ED" }} />
            </ListItemIcon>
            <ListItemText primary="Job Assignment" />
          </ListItem>
          <ListItem button onClick={() => handleUserClick("/process-control")}>
            <ListItemIcon>
              <AccountTreeIcon style={{ color: "#EFF1ED" }} />
            </ListItemIcon>
            <ListItemText primary="Process Control" />
          </ListItem>
        </List>
        <Divider />
        <List>
          {" "}
          {/* This List will be pushed to the bottom */}
          <ListItem>
            <ListItemText secondary={`Version: 1.0.0`} />
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
};

const TopBar = () => {
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  return (
    <>
      <AppBar
        position="static"
        sx={{
          backgroundColor: "transparent",
          boxShadow: "none",
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
          <IconButton edge="end" onClick={() => navigate("/")}>
            <img src={NanoIcon} alt="NanoIcon" style={{ width: "40px" }} />
          </IconButton>
        </Toolbar>
      </AppBar>
      <CustomDrawer drawerOpen={drawerOpen} toggleDrawer={toggleDrawer} />
    </>
  );
};

CustomDrawer.propTypes = {
  drawerOpen: PropTypes.bool.isRequired,
  toggleDrawer: PropTypes.func.isRequired,
};

export default TopBar;
