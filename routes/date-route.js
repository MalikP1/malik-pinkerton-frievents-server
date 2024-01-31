const express = require("express");
const router = express.Router();
const dateController = require("../controllers/date-controller");

router.route("/").get(dateController.getDates).post(dateController.postDate);

router.route("/:id").delete(dateController.delDate);

module.exports = router;
