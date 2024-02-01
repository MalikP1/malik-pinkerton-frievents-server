/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .createTable("user", (table) => {
      table.increments("id").primary();
      table.string("first_name").notNullable();
      table.string("last_name").notNullable();
      table.string("email").notNullable().unique();
      table.string("password").notNullable();
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table
        .timestamp("updated_at")
        .defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));
    })
    .createTable("date", (table) => {
      table.increments("id").primary();
      table.date("date").notNullable();
      table.integer("user_id").unsigned().references("user.id").notNullable();
    })
    .createTable("group", (table) => {
      table.increments("id").primary();
      table.string("name").notNullable();
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table
        .timestamp("updated_at")
        .defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));
    })
    .createTable("group_user", (table) => {
      table.integer("group_id").unsigned().references("group.id").notNullable();
      table.integer("user_id").unsigned().references("user.id").notNullable();
    })
    .createTable("event", (table) => {
      table.increments("id").primary();
      table.string("name").notNullable();
      table.string("location").notNullable();
      table.time("time").notNullable();
      table.date("date").notNullable();
      table.integer("group_id").unsigned().references("group.id").notNullable();
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table
        .timestamp("updated_at")
        .defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));
    });
};
exports.down = function (knex) {
  return knex.schema
    .dropTable("group_user")
    .dropTable("event")
    .dropTable("date")
    .dropTable("group")
    .dropTable("user");
};
