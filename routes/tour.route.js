let express = require("express");
let router = express.Router();
let tourController = require("../controller/tour.controller");

router.route("/").get(tourController.getTours).post(tourController.addTour);
// router
//   .route("/:id")
//   .delete(tourController.deleteUser)
//   .get(tourController.getById);

module.exports = router;
