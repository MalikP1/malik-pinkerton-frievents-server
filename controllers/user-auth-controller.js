const bcrypt = require("bcrypt");
const knex = require("knex")(require("../knexfile"));
const jwt = require("jsonwebtoken");

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

module.exports = {
  registerNewUser,
  //   loginUser,
  //   getProfile,
};
