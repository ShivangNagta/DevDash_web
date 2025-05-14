const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Users = require('./Models/User');
require('dotenv').config();


const app = express();
const port = process.env.PORT || 3000;

const clientOptions = { 
    serverApi: { 
        version: '1', 
        strict: true, 
        deprecationErrors: true 
    } 
};

const uri = process.env.MONGODB_URI

// Middleware to enable CORS and parse JSON bodies
app.use(cors({
    origin: 'https://softcomdevdashalphafrontend.onrender.com', 
    credentials: true
}));

app.use(express.json());

// Function to connect to MongoDB
async function connectToDatabase() {
    try {
        await mongoose.connect(uri, clientOptions);
        console.log("Connected to MongoDB successfully!");
    } catch (error) {
        console.error("Failed to connect to MongoDB:", error);
    }
}

// Connect to the database when the server starts
connectToDatabase();

// Handle POST request to create a new user
app.post("/", async (req, res) => {
    try {
        let user = new Users(req.body);
        let result = await user.save();
        res.send(result);
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).send("Error creating user");
    }
});

app.post("/updateTime", async (req, res) => {
    console.log("Received update-time request:", req.body);
    try {
        const { entryNumber, timeTaken } = req.body;

        const user = await Users.findOne({ entryNumber });

        if (!user) {
            return res.status(404).send("User not found");
        }

        user.time += parseInt(timeTaken);
        await user.save();

        res.send(user);
    } catch (error) {
        console.error("Error updating time taken:", error);
        res.status(500).send("Error updating time taken");
    }
});

app.post("/percentageComplete", async (req, res) => {
    try {
        const { date } = req.body;

        const totalUsers = await Users.countDocuments({ date });
        const completedUsers = await Users.countDocuments({ date, isEnd: true });

        if (totalUsers === 0) {
            return res.status(404).send("No users found for the given date");
        }

        const percentageComplete = (completedUsers / totalUsers) * 100;

        res.send({ percentageComplete });
    } catch (error) {
        console.error("Error calculating percentage complete:", error);
        res.status(500).send("Error calculating percentage complete");
    }
});

app.post("/setIsEnd", async (req, res) => {
    try {
        const { entryNumber } = req.body;

        const user = await Users.findOne({ entryNumber });

        if (!user) {
            return res.status(404).send("User not found");
        }

        user.isEnd = true;
        await user.save();

        res.send(user);
    } catch (error) {
        console.error("Error setting isEnd:", error);
        res.status(500).send("Error setting isEnd");
    }
});

app.post("/result", async (req, res) => {
    const { date } = req.body;

    try {
        const totalUsers = await Users.find({ date: date, isEnd: true }).sort({ time: 1 }).select('name entryNumber time');
        res.send({ totalUsers });
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).send({ message: "Error fetching users" });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// Handle graceful shutdown
process.on('SIGINT', async () => {
    await mongoose.disconnect();
    process.exit(0);
});
