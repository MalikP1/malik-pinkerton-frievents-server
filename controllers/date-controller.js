const knex = require("knex")(require("../knexfile"));

const getDates = async (req, res) => {
  try {
    const data = await knex("date");
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: `Unable to retrieve dates, ${error}.`,
    });
  }
};

const postDate = async (req, res) => {
  try {
    if (!req.body.date || !req.body.user_id) {
      return res.status(400).send("Please provide all required fields.");
    }
    const dateToInsert = {
      date: req.body.date,
      user_id: req.body.user_id,
    };
    console.log(req.body);
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

const delDate = async (req, res) => {
  try {
    const data = await knex("date").where({ id: req.params.id }).del();
    if (data === 0) {
      return res
        .status(404)
        .send(
          `Could not delete date, date with ID: ${req.params.id} not found`
        );
    }
    res
      .status(200)
      .send(`Date id: ${req.params.id} has been successfully deleted.`);
  } catch (error) {
    res.status(500).json({
      message: `Unable to delete date: ${error}.`,
    });
  }
};

module.exports = {
  getDates,
  postDate,
  delDate,
};
