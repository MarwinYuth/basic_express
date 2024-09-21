import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.table("users", table=>{
        table.string("token");
        table.string("reset");
    })
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.table("users", table=>{
        table.dropColumns("token", "reset");
    })
}
