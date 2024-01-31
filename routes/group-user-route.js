const express = require("express");
const router = express.Router();
const groupController = require("../controllers/group-user-controller");

router.route("/").get(groupController.getGroup);

router.route("/:id");

module.exports = router;
