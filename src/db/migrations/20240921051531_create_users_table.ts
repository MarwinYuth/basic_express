import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("users", (table) => {
    table.increments();
    table.string("username");
    table.string("email").notNullable();
    table.string("password");
    table.string("role").defaultTo("member");
    // table.timestamps(true, true);

    table.dateTime("created_at").defaultTo(knex.fn.now());
    table.dateTime("updated_at").defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("users");
}
