const knex = require("knex")(require("../knexfile"));

const getAllGroups = async (req, res) => {
  try {
    const groups = await knex("group");
    const mappedGroups = await Promise.all(
      groups.map(async (group) => {
        const users = await knex("group_user")
          .join("user", "group_user.user_id", "user.id")
          .where({ group_id: group.id })
          .select("user.id", "first_name", "last_name", "email");

        group.users = users.map((object) => {
          const newObj = {
            id: object.id,
            first_name: object.first_name,
            last_name: object.last_name,
            email: object.email,
          };

          return newObj;
        });

        return group;
      })
    );
    res.status(200).json(mappedGroups);
  } catch (error) {
    res.status(500).send({
      message: `Unable to retrieve groups: ${error}`,
    });
  }
};

const oneGroup = async (req, res) => {
  try {
    const group = await knex("group").where({ id: req.params.id }).first();
    if (!group) {
      return res.status(404).send(`Group ${req.params.id} not found.`);
    }
    const users = await knex("group_user")
      .join("user", "group_user.user_id", "user.id")
      .where({ group_id: req.params.id })
      .select("user.id", "first_name", "last_name", "email");

    const mappedUsers = users.map((object) => {
      const newObj = {
        id: object.id,
        first_name: object.first_name,
        last_name: object.last_name,
        email: object.email,
      };
      return newObj;
    });

    const events = await knex("group")
      .join("event", "event.group_id", "group.id")
      .where({ group_id: req.params.id })
      .select("event.id", "event.name", "location", "time", "date");

    const mappedEvents = events.map((object) => {
      const eventObj = {
        id: object.id,
        name: object.name,
        location: object.location,
        time: object.time,
        date: object.date,
      };
      return eventObj;
    });
    const completedGroup = {
      ...group,
      users: mappedUsers,
      events: mappedEvents,
    };

    res.status(200).json(completedGroup);
  } catch (error) {
    res
      .status(404)
      .json({ message: `Unable to retrieve group with ID: ${req.params.id}.` });
  }
};

const addUsersToGroup = async (req, res) => {
  try {
    const groupId = req.params.id;
    const usersToAdd = req.body;
    console.log(req.body);
    usersToAdd.user_id.forEach(async (userId) => {
      await knex("group_user").insert({ user_id: userId, group_id: groupId });
    });

    res
      .status(201)
      .send(
        `Successfully added ${usersToAdd.user_id.length} users to group: ${groupId}`
      );
  } catch (error) {
    res.status(404).json({
      message: `Unable to add users: ${error}`,
    });
  }
};

// groups/:groupID/add/:usersID

module.exports = {
  getAllGroups,
  oneGroup,
  addUsersToGroup,
};
