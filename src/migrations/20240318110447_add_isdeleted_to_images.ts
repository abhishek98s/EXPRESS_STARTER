import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  const exists = await knex.schema.hasTable('images');

  if (exists) {
    const hasColumn = await knex.schema.hasColumn('images', 'isdeleted');
    if (!hasColumn) {
      await knex.schema.table('images', function (table) {
        table.boolean('isdeleted').notNullable().defaultTo(false);
      });
    }
  }
}

export async function down(knex: Knex): Promise<void> {
  const exists = await knex.schema.hasTable('images');

  if (exists) {
    const hasColumn = await knex.schema.hasColumn('images', 'isdeleted');
    if (hasColumn) {
      await knex.schema.table('images', function (table) {
        table.dropColumn('isdeleted');
      });
    }
  }
}
