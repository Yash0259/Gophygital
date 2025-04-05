const express = require("express");
const router = express.Router();
const { registerUser,getUsers,updateUserStatus ,loginUser} =require("../controllers/userController");
const verifyToken = require("../middleware/authMiddleware");

router.get("/",verifyToken,getUsers);
router.post("/",registerUser);
router.put("/:id/status",verifyToken,updateUserStatus);
router.post("/login",loginUser);

module.exports = router;