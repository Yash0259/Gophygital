import React from "react";
import { Box, Typography } from "@mui/material";
import Navbar from "../Components/Navbar";

const StudentPage = () => {
  const userData = sessionStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : null;
  console.log(user)

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
        <Typography>Name: {user.name}</Typography>
        <Typography>Email: {user.email}</Typography>
        <Typography>Standard: {user.standard}</Typography>
        <Typography>Subject: {user.subjects?.join(", ")}</Typography>
        <Typography>Address: {user.address}</Typography>
      </Box>
    </Box>
  );
};

export default StudentPage;
