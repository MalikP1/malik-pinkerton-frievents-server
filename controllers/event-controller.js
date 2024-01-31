const knex = require("knex")(require("../knexfile"));

const getEvents = async (req, res) => {
  try {
    const data = await knex("event");
    res.status(200).json(data);
  } catch (error) {
    res.status(404).send(`Error retrieving events: ${error}`);
  }
};

const getOneEvent = async (req, res) => {
  try {
    const event = await knex("event").where({ id: req.params.id }).first();
    if (!event) {
      return res.status(404).send(`Event with ID: ${req.params.id} not found`);
    }
    res.status(200).json(event);
  } catch (error) {
    res.status(500).send({
      message: `Unable to retrieve event data wtih ID: ${req.params.id}`,
    });
  }
};

const createEvent = async (req, res) => {
  try {
    if (
      !req.body.name ||
      !req.body.location ||
      !req.body.time ||
      !req.body.date ||
      !req.body.group_id
    ) {
      return res.status(400).send("Please provide all required fields");
    }
    const eventToInsert = {
      name: req.body.name,
      location: req.body.location,
      time: req.body.time,
      date: req.body.date,
      group_id: req.body.group_id,
    };
    const addEvent = await knex("event").insert(eventToInsert);
    const newEventId = addEvent[0];
    const createdEvent = await knex("event").where({ id: newEventId }).first();
    res.status(201).json(createdEvent);
  } catch (error) {
    res.status(500).json({
      message: `Unable to create new event: ${error}`,
    });
  }
};

const editEvent = async (req, res) => {
  try {
    if (
      !req.body.name ||
      !req.body.location ||
      !req.body.time ||
      !req.body.date ||
      !req.body.group_id
    ) {
      return res.status(400).send("Please provide all required fields");
    }
    const updateEvent = await knex("event")
      .where({ id: req.params.id })
      .update(req.body);

    if (updateEvent === 0) {
      return res
        .status(404)
        .send(
          `Could not update record, event with ID: ${req.params.id} not found`
        );
    }
    const createdEvent = await knex("event")
      .where({ id: req.params.id })
      .first();
    res.status(200).send(createdEvent);
  } catch (error) {
    res.status(500).json({
      message: `Unable to edit event: ${error}`,
    });
  }
};

module.exports = {
  getEvents,
  getOneEvent,
  createEvent,
  editEvent,
};
