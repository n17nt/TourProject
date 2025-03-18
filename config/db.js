const mongoose = require("mongoose");
const connectDb = async () => {
  try {
    await mongoose
      .connect("mongodb://localhost:27017/tour", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then((log) => {
        console.log("Connected to MongoDB");
      });
  } catch (error) {
    console.log("Db connection failed");
  }
};
module.exports = connectDb;
