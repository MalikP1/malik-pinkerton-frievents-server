const userData = require("../seed-data/user");
const dateData = require("../seed-data/date");
const eventData = require("../seed-data/event");
const groupData = require("../seed-data/group");
const groupUserData = require("../seed-data/group_user");

exports.seed = async function (knex) {
  await knex("date").del();
  await knex("event").del();
  await knex("group_user").del();
  await knex("group").del();
  await knex("user").del();
  await knex("user").insert(userData);
  await knex("date").insert(dateData);
  await knex("group").insert(groupData);
  await knex("group_user").insert(groupUserData);
  await knex("event").insert(eventData);
};
