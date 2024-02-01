const express = require("express");
const router = express.Router();
const userController = require("../controllers/user-controller");

router.route("/").get(userController.getUsers).post(userController.createUser);

router
  .route("/:id")
  .get(userController.getOneUser)
  .patch(userController.editUser);

router.route("/:id/add").post(userController.createGroup);

module.exports = router;
