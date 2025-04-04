import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button, IconButton, InputAdornment, Box, Typography, Paper } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import users from "../Data/users.json";
import bcrypt from "bcryptjs";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [error, setError] = useState("");

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };
  const handleLogin = async () => {
    setError("");
  
    // Find user by email
    const user = users.find((user) => user.email === email);
    if (!user) {
      setError("Invalid Email!");
      return;
    }
  
    // Compare password using bcrypt
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      setError("Invalid Password!");
      return;
    }
  
    // Store user details in sessionStorage before redirecting
    sessionStorage.setItem("user", JSON.stringify(user));
  
    // Redirect based on user type
    if (user.userType === "admin") {
      navigate("/adminPage");
    } else if (user.userType === "student") {
      navigate("/studentPage");
    }
  };
  

  return (
    <Box
    sx={{
        position: "absolute", // Ensure it covers the entire screen
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage: "url('/macOS.jpg')", // Absolute path from public
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Paper
        elevation={10}
        sx={{
          padding: 4,
          width: 350,
          borderRadius: 3,
          backdropFilter: "blur(10px)",
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          color: "#fff",
          textAlign: "center",
        }}
      >
        <Typography variant="h5" gutterBottom>
          Sign In
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.7, marginBottom: 2 }}>
          Keep it all together and you'll be fine
        </Typography>
        <TextField
          fullWidth
          label="Email"
          variant="outlined"
          margin="normal"
          InputProps={{ style: { color: "#fff" } }}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          fullWidth
          label="Password"
          type={showPassword ? "text" : "password"}
          variant="outlined"
          margin="normal"
          value={password}
          onChange ={(e) => setPassword(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleTogglePassword} sx={{ color: "#fff" }}>
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
            style: { color: "#fff" },
          }}
        />
        <Typography variant="body2" sx={{ textAlign: "left", cursor: "pointer", opacity: 0.7, marginBottom: 2 }}>
          Forgot Password?
        </Typography>
        <Button fullWidth variant="contained" sx={{ backgroundColor: "#a855f7", marginBottom: 2 }} onClick={handleLogin}>
          Sign In
        </Button>
      </Paper>
    </Box>
  );
};

export default LoginPage;
