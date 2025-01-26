import React from "react";
import { Box, Drawer, List, ListItem, ListItemIcon, ListItemText, Typography } from "@mui/material";
import { Home, DirectionsCar, Info, Settings } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();

  const menuItems = [
    { text: "Home", icon: <Home />, path: "/" },
    { text: "Research cars", icon: <DirectionsCar />, path: "/research" },
    { text: "Compare cars", icon: <Info />, path: "/compare" },
    { text: "Settings", icon: <Settings />, path: "/settings" },
  ];

  return (
    <Drawer variant="permanent" anchor="left">
      <Box
        sx={{
          width: 250,
          height: "100vh",
          bgcolor: "primary.main",
          color: "primary.contrastText",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography variant="h6" sx={{ p: 2, fontWeight: "bold" }}>
          App Name
        </Typography>
        <List>
          {menuItems.map((item) => (
            <ListItem
              button
              key={item.text}
              onClick={() => navigate(item.path)}
              sx={{
                "&:hover": {
                  bgcolor: "primary.light",
                },
              }}
            >
              <ListItemIcon sx={{ color: "primary.contrastText" }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
