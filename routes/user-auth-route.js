const router = require("express").Router();
const authController = require("../controllers/user-auth-controller");

router.route("/register").post(authController.registerNewUser);

// router.route("/login").post(authController.loginUser);

// router.route("/profile").get(authController.getProfile);

module.exports = router;
