let express = require("express");
let router = express.Router();
let tourController = require("../controller/tour.controller");
const protect = require("../middlewares/protect.middleware");
const checkRole = require("../middlewares/checkRole.middleware");

router
  .route("/")
  .get(protect, tourController.getTours)
  .post(protect, checkRole(["guide", "admin"]), tourController.addTour);
// router
//   .route("/:id")
//   .delete(tourController.deleteUser)
//   .get(tourController.getById);

module.exports = router;
