const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const dateRoutes = require("./routes/date-route");
const groupRoutes = require("./routes/group-route");
const eventRoutes = require("./routes/event-route");
const userRoutes = require("./routes/user-route");
const authRoutes = require("./routes/user-auth-route");
const PORT = process.env.PORT || 5050;

app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to my API");
});

app.use("/dates", dateRoutes);

app.use("/groups", groupRoutes);

app.use("/events", eventRoutes);

app.use("/users", userRoutes);

app.use("/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Running at http://localhost:${PORT}`);
});
