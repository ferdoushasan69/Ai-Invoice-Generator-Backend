require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const app = express();
//middleware to handle cors

app.use(
    cors({
        origin : "*",
        methods : ["GET","POST","PUT","DELETE"],
        allowedHeaders : ["Content-Type","Authorization"]
    })
);

//connectDb 
connectDB();

//middleware 
app.use(express.json());

//Route here
app.route("/api/auth",authRoutes)
//Start server
const PORT = process.env.PORT || 5000
app.listen(PORT,()=>console.log(`Server running on ${PORT}`))