import React from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Navbar = ({ title }) => {
  const navigate = useNavigate();

  const handleSignOut = () => {
    sessionStorage.removeItem("user");
    navigate("/");
  };

  return (
    <AppBar position="static">
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6">{title}</Typography>
        <Button color="inherit" onClick={handleSignOut}>
          Sign Out
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
