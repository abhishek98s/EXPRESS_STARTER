import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('images').del();

  // Inserts seed entries
  await knex('images').insert([
    {
      type: 'folder',
      url: 'https://image.litmark/images/sd334.png',
      name: 'folder',
      isdeleted: false,
      created_by: 'John',
      updated_by: 'John',
    },
    {
      type: 'folder',
      url: 'https://image.litmark/images/sd3342.png',
      name: 'design',
      isdeleted: false,
      created_by: 'John',
      updated_by: 'John',
    },
  ]);
}
