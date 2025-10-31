const jwt = require("jsonwebtoken");
const User = require("../models/Users");
const { ReturnDocument } = require("mongodb");

//Helper generate token

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });
};

//@DESC register new user
//route POST api/auth/register
//access Public

exports.registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {

        if(!name || !email || !password){
            return res.status(400).json({message : "Please fill the all fields"});
        }

        //check if user exists
        const userExists = User.findOne({email});
        if(userExists){
            return res.status(400).json({message : "User already exists"});
        }

        //create user
        const user = User.create({name,email,password});

        if(user){
            res.status(201).json({
                _id : user.id,
                name : user.name,
                email : user.email,
                token : generateToken(user.id),
            });
        }else{
            res.status(400).json({message : "Invalid user data"});
        }
    } catch (error) {
        return res.status(500).json({ message: "Server error" });;
    }
}

//@DESC login existing user
//route POST api/auth/login
//access Public

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {

    } catch (error) {
        return res.status(500).json({ message: "Server error" });
    }
}


exports.getMe = async (req, res) => {

    try {

    } catch (error) {
        return res.status(500).json({ message: "Server error" });
    }
}


exports.updateUserProfile = async (req, res) => {

    try {

    } catch (error) {
        return res.status(500).json({ message: "Server error" });
    }
}