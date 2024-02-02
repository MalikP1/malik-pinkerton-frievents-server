const bcrypt = require("bcrypt");
const knex = require("knex")(require("../knexfile"));
const jwt = require("jsonwebtoken");
require("dotenv").config();

const registerNewUser = async (req, res) => {
  const { first_name, last_name, email, password } = req.body;

  if (!first_name || !last_name || !email || !password) {
    return res.status(400).send("Please enter the required fields.");
  }

  const hashedPassword = bcrypt.hashSync(password, 6);

  const newUser = {
    first_name,
    last_name,
    email,
    password: hashedPassword,
  };

  try {
    await knex("user").insert(newUser);
    return res.status(201).json(newUser);
  } catch (error) {
    return res.status(400).json({
      message: `Failed Registration: ${error}`,
    });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send("Please enter the required fields.");
  }

  try {
    const user = await knex("user").where({ email: email }).first();

    const passwordCorrect = bcrypt.compareSync(password, user.password);

    if (!passwordCorrect) {
      return res.status(400).send("Invalid password");
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "24h",
      }
    );

    return res.status(200).json({ token });
  } catch (error) {
    return res.status(400).json({ message: `Failed to login: ${error}` });
  }
};

const getProfile = async (req, res) => {
  if (!req.headers.authorization) {
    return res.status(401).send("Please login");
  }

  const authHeader = req.headers.authorization;
  const authToken = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(authToken, process.env.JWT_SECRET);

    const user = await knex("user").where({ id: decoded.id }).first();

    res.status(200).json(user);
  } catch (error) {
    return res.status(401).send(`Invalid auth token: ${error}`);
  }
};
module.exports = {
  registerNewUser,
  loginUser,
  getProfile,
};
