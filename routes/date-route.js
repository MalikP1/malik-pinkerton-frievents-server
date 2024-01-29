const express = require("express");
const router = express.Router();
const dateController = require("../controllers/date-controller");

router.route("/").post(dateController.postDate);

router.route("/:id").get(dateController.getDates);

module.exports = router;
