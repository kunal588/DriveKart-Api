// Importing libraries
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// Routers
const DriverLoginRouter = require("./routes/driver/login");
const DealerSignUpRoutes = require("./routes/dealer/signup");
const DriverSignUpRoutes = require("./routes/driver/signup");
const DealerLoginRoutes = require("./routes/dealer/login");
const DriverOtherRoutes = require("./routes/driver/other");
const DealerOtherRoutes = require("./routes/dealer/other");

// All the middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ strict: false }));
app.use(cors());

// Database Connnection
mongoose.connect(process.env.DB_URI, () => {
  console.log("Database Connected");
});

// Routes
app.use("/driver", DriverLoginRouter);
app.use("/driver", DriverSignUpRoutes);
app.use("/driver", DriverOtherRoutes);
app.use("/dealer", DealerSignUpRoutes);
app.use("/dealer", DealerLoginRoutes);
app.use("/dealer/other", DealerOtherRoutes);

app.get("/", (req, res) => {
  res.send("Your server is woking fine!!");
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server is running on port", process.env.PORT || 3000);
});
