const express = require("express");
const router = express.Router();
const groupController = require("../controllers/group-controller");

router.route("/").get(groupController.getAllGroups);

router
  .route("/:id")
  .get(groupController.oneGroup)
  .post(groupController.addUsersToGroup);

module.exports = router;
