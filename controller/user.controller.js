const User = require("../models/user.model");
const errorHandler = require("../utils/error.handler");
const resposcha = require("../utils/resposcha");

let getAllUsers = errorHandler(async (req, res, next) => {
  let users = await User.find();
  resposcha(res, 200, users);
});

module.exports = {
  getAllUsers,
};
