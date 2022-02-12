// Importing libraries
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const DealerRoutes= require("./routes/dealer/signup")
const DriverRoutes= require("./routes/driver/signup")
require("dotenv").config();

// All the middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ strict: false }));
app.use(cors());

// Database Connnection
mongoose.connect(process.env.DB_URI, () => {
	console.log("Database Connected");
});

// Routes
app.get("/", (req, res) => {
	res.send("Your server is woking fine!!");
});

app.listen(process.env.PORT || 3000, () => {
	console.log("Server is running on port", process.env.PORT || 3000);
});

app.use("/dealer", DealerRoutes);
app.use("/driver", DriverRoutes);
