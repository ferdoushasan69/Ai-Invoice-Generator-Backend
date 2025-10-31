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

        if (!name || !email || !password) {
            return res.status(400).json({ message: "Please fill the all fields" });
        }

        //check if user exists
        const userExists = User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        //create user
        const user = User.create({ name, email, password });

        if (user) {
            res.status(201).json({
                _id: user.id,
                name: user.name,
                email: user.email,
                token: generateToken(user.id),
            });
        } else {
            res.status(400).json({ message: "Invalid user data" });
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
        const user = await User.findOne({ email }).select("+password");
        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user.id,
                name: user.name,
                email: user.email,
                token: generateToken(user.id),
                businessName: user.businessName || "",
                address: user.address || "",
                phone: user.phone || "",
            })
        } else {
            res.json({ message: "Invalid credential" })
        }
    } catch (error) {
        return res.status(500).json({ message: "Server error" });
    }
}


exports.getMe = async (req, res) => {

    try {
        const user = await User.findById(req.user.id);
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            businessName: user.businessName || "",
            address: user.address || "",
            phone: user.phone || "",
        })
    } catch (error) {
        return res.status(500).json({ message: "Server error" });
    }
}


exports.updateUserProfile = async (req, res) => {

    try {
        const user = await User.findById(req.user.id);
        if (user) {
            user.name = req.body.name || user.name
            user.businessName = req.body.businessName || user.businessName
            user.address = req.body.address || user.address
            user.phone = req.body.phone || user.phone

            const updateUser = await user.save();

            res.json({
                _id: updateUser._id,
                name: updateUser.name,
                businessName: updateUser.businessName,
                address: updateUser.address,
                phone: updateUser.phone
            })
        }else{
            res.json({message : "User not found"});
        }

    } catch (error) {
        return res.status(500).json({ message: "Server error" });
    }
}