let express = require("express");
let router = express.Router();
let authController = require("../controller/auth.controller");

router.route("/register").post(authController.registerUser);
router.route("/login").post(authController.login);

module.exports = router;
