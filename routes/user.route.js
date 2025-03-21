let express = require("express");
let router = express.Router();
let userController = require("../controller/user.controller");
const protect = require("../middlewares/protect.middleware");
const checkRole = require("../middlewares/checkRole.middleware");

router
  .route("/")
  .get(protect, checkRole(["user", "admin"]), userController.getAllUsers);
module.exports = router;
