import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  const exists = await knex.schema.hasTable('images');

  if (!exists) {
    await knex.schema.createTable('images', (table) => {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.string('url').notNullable();
      table.string('type').notNullable();
      table.string('created_by').notNullable();
      table.string('updated_by').notNullable();
      table.timestamps(true, true);
    });
  }
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('images');
}
