import React from "react";
import { Box, Typography } from "@mui/material";
import Navbar from "../Components/Navbar";

const StudentPage = () => {
  const userData = sessionStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : null;

  if (!user) {
    return (
      <Box>
        <Navbar title="Student Panel" />
        <Box sx={{ padding: 4 }}>
          <Typography variant="h4">Student Dashboard</Typography>
          <Typography color="error">No user data found. Please log in again.</Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      <Navbar title="Student Panel" />

      <Box sx={{ padding: 4 }}>
        <Typography variant="h4">Student Dashboard</Typography>
        <Typography>Name: {user.name}</Typography>
        <Typography>Email: {user.email}</Typography>
        <Typography>Subject: {user.subject || "N/A"}</Typography>
      </Box>
    </Box>
  );
};

export default StudentPage;
