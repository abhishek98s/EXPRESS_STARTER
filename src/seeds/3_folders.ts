import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('folders').del();

  // Inserts seed entries
  await knex('folders').insert([
    {
      name: 'Design',
      user_id: 1,
      image_id: 2,
      isdeleted: false,
      folder_id: null,
      created_by: 'John',
      updated_by: 'John',
    }, // id: 1
    {
      name: 'Health',
      user_id: 2,
      image_id: 2,
      isdeleted: false,
      folder_id: null,
      created_by: 'Zoro',
      updated_by: 'Zoro',
    }, // id: 2
    {
      name: 'Coding',
      user_id: 1,
      image_id: 2,
      isdeleted: false,
      folder_id: null,
      created_by: 'John',
      updated_by: 'John',
    }, // id: 3
    {
      name: 'React',
      user_id: 1,
      image_id: 2,
      isdeleted: false,
      folder_id: null,
      created_by: 'John',
      updated_by: 'John',
    }, // id: 4
    {
      name: 'Interview',
      user_id: 3,
      image_id: 2,
      isdeleted: false,
      folder_id: 2,
      created_by: 'Nami',
      updated_by: 'Nami',
    },
    {
      name: 'Books',
      user_id: 1,
      image_id: 2,
      isdeleted: false,
      folder_id: 1,
      created_by: 'John',
      updated_by: 'John',
    },
  ]);
}
