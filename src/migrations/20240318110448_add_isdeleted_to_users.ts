import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  const exists = await knex.schema.hasTable('users');

  if (exists) {
    const hasColumn = await knex.schema.hasColumn('users', 'isdeleted');
    if (!hasColumn) {
      await knex.schema.table('users', function (table) {
        table.boolean('isdeleted').notNullable().defaultTo(false);
      });
    }
  }
}

export async function down(knex: Knex): Promise<void> {
  const exists = await knex.schema.hasTable('users');

  if (exists) {
    const hasColumn = await knex.schema.hasColumn('users', 'isdeleted');
    if (hasColumn) {
      await knex.schema.table('users', function (table) {
        table.dropColumn('isdeleted');
      });
    }
  }
}
