const jwt = require("jsonwebtoken");
const User = require("../models/Users");

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && res.headers.authorization.startsWith('Bearer')) {
        try {
            //get token from header
            token = req.headers.authorization.split(' ')[1];

            //verifyToken
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            //getUser from token 
            req.user = await User.findById(decoded.id).select('-password');
            next();
        } catch (error) {
            return res.status(401).json({ message: 'Not authorized, token failed!' });
        }
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token!' });

    }

};

module.exports = { protect };
