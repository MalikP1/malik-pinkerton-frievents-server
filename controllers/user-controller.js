const knex = require("knex")(require("../knexfile"));

const getUsers = async (req, res) => {
  try {
    const users = await knex("user");
    const mappedUsers = await Promise.all(
      users.map(async (user) => {
        const groups = await knex("group_user")
          .join("group", "group_user.group_id", "group.id")
          .where({ user_id: user.id })
          .select("group.id", "name");

        user.groups = groups.map((object) => {
          const newObj = {
            id: object.id,
            name: object.name,
          };
          return newObj;
        });
        return user;
      })
    );
    res.status(200).json(mappedUsers);
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
    const groups = await knex("group_user")
      .join("group", "group_user.group_id", "group.id")
      .where({ "group_user.user_id": user.id })
      .select("group.id", "name");

    const mappedGroups = groups.map((object) => {
      const groupObj = {
        id: object.id,
        name: object.name,
      };
      return groupObj;
    });

    const dates = await knex("user")
      .join("date", "date.user_id", "user.id")
      .where({ user_id: user.id })
      .select("date.id", "date");

    const mappedDates = dates.map((object) => {
      const mapObj = {
        id: object.id,
        date: object.date,
      };
      return mapObj;
    });
    const completedUser = {
      ...user,
      groups: mappedGroups,
      dates: mappedDates,
    };

    res.status(200).json(completedUser);
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

const createGroup = async (req, res) => {
  try {
    if (!req.body.name) {
      return res.status(400).send("Please provide all required fields");
    }
    const groupToInsert = {
      name: req.body.name,
    };
    const addGroup = await knex("group").insert(groupToInsert);

    const userId = req.params.id;

    console.log(addGroup);

    await knex("group_user").insert({ user_id: userId, group_id: addGroup[0] });

    res.json(addGroup[0]);
  } catch (error) {
    res.json(error);
  }
};

module.exports = {
  getUsers,
  getOneUser,
  createUser,
  editUser,
  createGroup,
};
