const knex = require("knex")(require("../knexfile"));

const getUsers = async (req, res) => {
  try {
    const data = await knex("user");
    res.status(200).json(data);
  } catch (error) {
    res.status(404).send(`Error retrieving users: ${error}.`);
  }
};

const getOneUser = async (req, res) => {
  try {
    const user = await knex("user").where({ id: req.params.id }).first();
    if (!user) {
      return res.status(404).send(`User with ID: ${req.params.id} not found`);
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).send({
      message: `Unable to retrieve user data for user ID: ${req.params.id}`,
    });
  }
};

const createUser = async (req, res) => {
  try {
    if (
      !req.body.first_name ||
      !req.body.last_name ||
      !req.body.email ||
      !req.body.password
    ) {
      return res.status(400).send("Please provide all required fields");
    }
    const userToInsert = {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      password: req.body.password,
    };
    const addUser = await knex("user").insert(userToInsert);
    const newUserId = addUser[0];
    const createdUser = await knex("user").where({ id: newUserId }).first();
    res.status(201).json(createdUser);
  } catch (error) {
    res.status(500).json({
      message: `Unable to create new user: ${error}`,
    });
  }
};

const editUser = async (req, res) => {
  try {
    if (
      !req.body.first_name ||
      !req.body.last_name ||
      !req.body.email ||
      !req.body.password
    ) {
      return res.status(400).send("Please provide all required fields");
    }
    const updateUser = await knex("user")
      .where({ id: req.params.id })
      .update(req.body);

    if (updateUser === 0) {
      return res
        .status(404)
        .send(
          `Could not update record, user with ID: ${req.params.id} not found`
        );
    }
    const createdUser = await knex("user").where({ id: req.params.id }).first();
    res.status(200).send(createdUser);
  } catch (error) {
    res.status(500).json({
      message: `Unable to edit user: ${error}`,
    });
  }
};

module.exports = {
  getUsers,
  getOneUser,
  createUser,
  editUser,
};
