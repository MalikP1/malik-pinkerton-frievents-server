const express = require("express");
const router = express.Router();
const eventController = require("../controllers/event-controller");

router
  .route("/")
  .get(eventController.getEvents)
  .post(eventController.createEvent);

router
  .route("/:id")
  .get(eventController.getOneEvent)
  .patch(eventController.editEvent);

module.exports = router;
