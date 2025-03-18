const express = require("express");
const app = express();
const mongana = require("morgan");
const tourRouter = require("./routes/tour.route.js");
const authRouter = require("./routes/auth.route.js");
const env = require("dotenv").config();

const TOur = require("./models/user.model.js");

const connectDb = require("./config/db.js");
const errController = require("./controller/errorController");
const TourGuide = require("./models/user.model.js");
connectDb();

app.use(express.json());

app.use(mongana("dev"));

app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/auth", authRouter);
app.use(errController);

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION 💥");
  console.log(err.name, err.message);
  // process.exit(1);
});

// Unhandled Excpections
process.on("uncaughtException", (err) => {
  console.log("UNHANDLED Excpections 💥");
  console.log(err.name, err.message);
  // process.exit(1);
});

app.listen(3000, () => {
  console.log(`Server is running on port ${3000}`);
});
