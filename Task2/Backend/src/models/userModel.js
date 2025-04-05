const db = require('../config/db');

//create a new user
const createUser = (userData, callback)=>{
    const { name , email , password } = userData;
    const query = "INSERT INTO users (name,email,password) VALUES (?,?,?)";
    db.query(query,[name,email,password],callback);
};

//find by email
const findUserByEmail = (email, callback)=>{
    const query = "SELECT * FROM users WHERE email = ?";
    db.query(query,[email],callback);
}

//get all users 
const getAllUsers = (callback) =>{
    const query = "SELECT * FROM users";
    db.query(query,callback);
}

//update user status 
const updateUserStatus = (id,status, callback) =>{
    const query = "UPDATE users SET status = ? WHERE id = ?";

};

module.exports ={
    createUser,
    findUserByEmail,
    getAllUsers,
    updateUserStatus,
};