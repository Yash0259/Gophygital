const users = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const loginUser = (req, res) => {
    const { email, password } = req.body;

    //check user exists
    users.findUserByEmail(email, (err, results) => {
        if (err) return res.status(500).json({ message: "DB error" });

        if (results.length === 0) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        const user = results[0];

        // 2. Compare password
        const isMatch = bcrypt.compareSync(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // 3. Generate JWT token
        const token = jwt.sign(
            { id: user.id, email: user.email },  // payload
            process.env.JWT_SECRET,             // secret
            { expiresIn: "1h" }                 // token expires in 1 hour
        );

        // 4. Send token back
        res.status(200).json({
            message: "Login successful",
            token: token,
        });
    });
}
const registerUser = (req, res) => {
    const { name, email, password } = req.body;

    //check user already exists 
    users.findUserByEmail(email, (err, results) => {
        if (err) {
            return res.status(500).json({ message: "DB error" });
        }
        if (results.length > 0) {
            return res.status(400).json({ message: "User already exists" });
        }

        //hash password
        const hashedPassword = bcrypt.hashSync(password, 10);

        //Save user
        users.createUser({ name, email, password: hashedPassword }, (err, result) => {
            if (err) return res.status(500).json({ message: "Error saving user" });

            const userId = result.insertId;

            const token = jwt.sign({ id: userId, email }, process.env.JWT_SECRET, {
                expiresIn: "1h"
            });
            res.status(201).json({ message: "User registered Successfully", token })
        });
    });
};

const getUsers = (req, res) => {
    users.getAllUsers((err, results) => {
        if (err) return res.status(500).json({ message: "Error fetching users" });

        res.status(200).json(results)
    });
};

const updateUserStatus = (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!['active', 'disabled'].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
    }
    users.updateUserStatus(id, status, (err, results) => {
        if (err) return res.status(500).json({ message: "Error updating user status" });

        res.status(200).json({ message: "User status updated" });
    })
}


module.exports = {
    registerUser,
    getUsers,
    updateUserStatus,
    loginUser,


}