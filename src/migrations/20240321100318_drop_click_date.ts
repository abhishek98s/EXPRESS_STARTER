import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  const exists = await knex.schema.hasColumn('bookmarks', 'click_date');

  if (exists) {
    await knex.schema.alterTable('bookmarks', function (table) {
      table.dropColumn('click_date');
    });
  }
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('bookmarks');
}
