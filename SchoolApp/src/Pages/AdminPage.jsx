import React, { useState } from "react";
import { Box, Typography, TextField, Button, Dialog, DialogTitle, DialogContent } from "@mui/material";
import users from "../Data/users.json";
import Navbar from "../Components/Navbar";

const AdminPage = () => {
    const students = users.filter((user) => user.role === "student");
    const [search, setSearch] = useState("");
    const [selectedStudent, setSelectedStudent] = useState(null);

    const handleSearch = (e) => {
        setSearch(e.target.value.toLowerCase());
    };

    const filteredStudents = students.filter((student) => {
        const name = student.name?.toLowerCase() || "";  // Ensure it's a string
        const subject = student.subject?.toLowerCase() || "";  // Handle missing subjects
    
        return name.includes(search) || subject.includes(search);
    });
    

    return (
        <Box>
            <Navbar title="Admin Panel" />

            <Box sx={{ padding: 4 }}>
                <Typography variant="h4">Admin Dashboard</Typography>

                <TextField
                    fullWidth
                    label="Search by Name or Subject"
                    variant="outlined"
                    margin="normal"
                    onChange={handleSearch}
                    InputLabelProps={{ style: { color: "#fff" } }}  // Makes label white
                    InputProps={{ style: { color: "#fff", borderColor: "#fff" } }}  // Makes input text white
                    sx={{
                        "& .MuiOutlinedInput-root": {
                            "& fieldset": { borderColor: "#fff" }, // White border
                            "&:hover fieldset": { borderColor: "#fff" }, // White border on hover
                            "&.Mui-focused fieldset": { borderColor: "#fff" }, // White border on focus
                        }
                    }}
                />

                {filteredStudents.map((student) => (
                    <Box key={student.id} sx={{ display: "flex", justifyContent: "space-between", padding: 2, border: "1px solid #ddd", marginBottom: 2 }}>
                        <Typography>{student.name} - {student.subject}</Typography>
                        <Button variant="contained" onClick={() => setSelectedStudent(student)}>Details</Button>
                    </Box>
                ))}

                {/* Student Details Popup */}
                {selectedStudent && (
                    <Dialog open={Boolean(selectedStudent)} onClose={() => setSelectedStudent(null)}>
                        <DialogTitle>{selectedStudent.name} - {selectedStudent.subject}</DialogTitle>
                        <DialogContent>
                            <Typography>Email: {selectedStudent.email}</Typography>
                        </DialogContent>
                    </Dialog>
                )}
            </Box>
        </Box>
    );
};

export default AdminPage;
