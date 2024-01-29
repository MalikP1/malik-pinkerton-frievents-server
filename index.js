const express = require("express");
const app = express();
require("dotenv").config();
const dateRoutes = require("./routes/date-route");

const PORT = process.env.PORT || 5050;

app.get("/", (req, res) => {
  res.send("Welcome to my API");
});

app.use("/dates", dateRoutes);

app.listen(PORT, () => {
  console.log(`Running at http://localhost:${PORT}`);
});
