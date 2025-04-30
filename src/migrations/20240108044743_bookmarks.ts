import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  const exists = await knex.schema.hasTable('bookmarks');

  if (!exists) {
    await knex.schema.createTable('bookmarks', (table) => {
      table.increments('id').primary();
      table.string('title').notNullable();
      table.string('url').notNullable();
      table.date('date').notNullable();

      table.integer('image_id').unsigned().notNullable();
      table.foreign('image_id').references('images.id');

      table.integer('user_id').unsigned().notNullable();
      table.foreign('user_id').references('users.id');

      table.integer('folder_id').unsigned().notNullable();
      table.foreign('folder_id').references('folders.id');

      table.integer('chip_id').unsigned().notNullable();
      table.foreign('chip_id').references('chips.id');

      table.string('created_by').notNullable();
      table.string('updated_by').notNullable();

      table.date('click_date');
      table.timestamps(true, true);
    });
  }
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('bookmarks');
}
