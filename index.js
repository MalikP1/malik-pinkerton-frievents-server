const express = require("express");
const app = express();
require("dotenv").config();
const dateRoutes = require("./routes/date-route");
const groupRoutes = require("./routes/group-user-route");
const eventRoutes = require("./routes/event-route");
const userRoutes = require("./routes/user-route");
const PORT = process.env.PORT || 5050;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to my API");
});

app.use("/dates", dateRoutes);

app.use("/group-user", groupRoutes);

app.use("/events", eventRoutes);

app.use("/users", userRoutes);

app.listen(PORT, () => {
  console.log(`Running at http://localhost:${PORT}`);
});
