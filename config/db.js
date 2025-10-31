const mongoose = require("mongoose");

const connectDB = async () => {
    console.log("Connecting to MongoDB:", process.env.MONGO_URI);

    try {

        await mongoose.connect(process.env.MONGO_URI);
        console.log("Mongodb Connected");
    } catch (error) {

        console.log("Error to connect mongoDb", error);
        process.exit(1);
    }
}

module.exports = connectDB;