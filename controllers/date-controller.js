const knex = require("knex")(require("../knexfile"));

const getDates = async (req, res) => {
  try {
    const data = await knex("date").where({ id: req.params.user_id });
    console.log(data);
    if (!data) {
      return res
        .status(404)
        .send(`Dates for user ${req.params.user_id} could not be found.`);
    }
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: `Unable to retrieve dates for user ID: ${req.params.user_id}.`,
    });
  }
};

const postDate = async (req, res) => {
  try {
    if (!req.body.date || req.body.user_id) {
      return res.status(400).send("Please provide all required fields.");
    }
    const dateToInsert = {
      date: req.body.date,
      user_id: req.body.user_id,
    };
    const addDate = await knex("date").insert(dateToInsert);
    const newDateId = addDate[0];
    const createdDate = await knex("date").where({ id: newDateId }).first();
    res.status(201).json(createdDate);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: `Unable to create new date: ${error}.`,
    });
  }
};

module.exports = {
  getDates,
  postDate,
};
