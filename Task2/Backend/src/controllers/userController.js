const users = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");

//  REGISTER USER
const registerUser = async (req, res) => {
    const { name, email, password, language, mobile } = req.body;

    try {
        // Check if user already exists
        users.findUserByEmail(email, async (err, results) => {
            if (err) return res.status(500).json({ message: "DB error" });

            if (results.length > 0) {
                return res.status(400).json({ message: "User already exists" });
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Save user in DB
            users.createUser(
                { name, email, password: hashedPassword, language, mobile, status: "Inactive" },
                async (err, result) => {
                    if (err) return res.status(500).json({ message: "Error saving user" });

                    // Send activation email
                    const subject = "Account Registered - Pending Activation";
                    const html = `
                        <h3>Hi ${name},</h3>
                        <p>Thank you for registering. Your account is currently pending activation.</p>
                        <p>You will receive another email once your account is activated.</p>
                        <br><p>Regards,<br/>Team</p>
                    `;
                    await sendEmail(email, subject, html);

                    res.status(201).json({ message: "Registration successful. Activation email sent." });
                }
            );
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error during registration." });
    }
};

// LOGIN USER
const loginUser = (req, res) => {
    const { email, password } = req.body;

    // Admin login
    if (email === process.env.ADMIN_EMAIL) {
        if (password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign({ email, userType: "admin" }, process.env.JWT_SECRET, { expiresIn: "1h" });
            return res.status(200).json({
                message: "Admin login successful",
                token,
                user: { email, userType: "admin" }
            });
        } else {
            return res.status(400).json({ message: "Invalid admin credentials" });
        }
    }

    // Student login
    users.findUserByEmail(email, (err, results) => {
        if (err) return res.status(500).json({ message: "DB error" });
        if (results.length === 0) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const user = results[0];
        const isMatch = bcrypt.compareSync(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // ✅ Check account status
        if (user.status.toLowerCase() !== "active") {
            return res.status(403).json({ message: "Your account is not active. Please wait for approval." });
        }

        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                userType: "student"
            }
        });
    });
};

//  GET USERS
const getUsers = (req, res) => {
    users.getAllUsers((err, results) => {
        if (err) return res.status(500).json({ message: "Error fetching users" });
        res.status(200).json(results);
    });
};

//  UPDATE USER STATUS
const updateUserStatus = (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!['active', 'disabled'].includes(status.toLowerCase())) {
        return res.status(400).json({ message: "Invalid status" });
    }

    users.updateUserStatus(id, status, (err, results) => {
        if (err) return res.status(500).json({ message: "Error updating user status" });

        //  If activated, send confirmation email
        if (status.toLowerCase() === "active") {
            users.findUserById(id, async (err, result) => {
                if (err || result.length === 0) return;
                const user = result[0];

                const subject = "Account Activated";
                const html = `
                    <h3>Hi ${user.name},</h3>
                    <p>Your account has been activated. You can now log in and access the platform.</p>
                    <br><p>Regards,<br/>Team</p>
                `;
                await sendEmail(user.email, subject, html);
            });
        }

        res.status(200).json({ message: "User status updated" });
    });
};
const getMe = (req, res) => {
    users.findUserById(req.user.id, (err, results) => {
        if (err) {
            console.error("getMe error:", err);
            return res.status(500).json({ message: "Server error" });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        const user = results[0];
        delete user.password; // remove password before sending

        res.status(200).json(user);
    });
};


module.exports = {
    registerUser,
    loginUser,
    getUsers,
    updateUserStatus,
    getMe
};
