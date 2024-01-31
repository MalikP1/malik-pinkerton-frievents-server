const knex = require("knex")(require("../knexfile"));

const getGroup = async (req, res) => {
  try {
    const groups = await knex("group");
    const mappedGroups = await Promise.all(
      groups.map(async (group) => {
        const users = await knex("group_user")
          .join("user", "group_user.user_id", "user.id")
          .where({ group_id: group.id })
          .select("user.id", "first_name", "last_name", "email");

        group.user = users.map((object) => {
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

module.exports = {
  getGroup,
};
