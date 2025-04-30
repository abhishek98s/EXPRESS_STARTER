import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('chips').del();

  // Inserts seed entries
  await knex('chips').insert([
    {
      name: 'Design',
      user_id: 3,
      folder_id: 2,
      created_by: 'John',
      updated_by: 'John',
      created_at: '2021-04-15T10:30:00.000Z',
      updated_at: '2022-01-20T14:45:00.000Z',
      isdeleted: false,
    },
    {
      name: 'Coding',
      user_id: 1,
      folder_id: 3,
      created_by: 'Nami',
      updated_by: 'Nami',
      created_at: '2020-06-10T09:00:00.000Z',
      updated_at: '2021-05-25T11:00:00.000Z',
      isdeleted: false,
    },
    {
      name: 'Marketing',
      user_id: 4,
      folder_id: 1,
      created_by: 'Luffy',
      updated_by: 'Luffy',
      created_at: '2022-02-20T08:00:00.000Z',
      updated_at: '2023-03-15T14:00:00.000Z',
      isdeleted: false,
    },
    {
      name: 'Books',
      user_id: 2,
      folder_id: 2,
      created_by: 'John',
      updated_by: 'John',
      created_at: '2021-08-30T10:30:00.000Z',
      updated_at: '2022-09-20T14:45:00.000Z',
      isdeleted: false,
    },
    {
      name: 'Market',
      user_id: 4,
      folder_id: 3,
      created_by: 'Nami',
      updated_by: 'Nami',
      created_at: '2020-12-15T09:00:00.000Z',
      updated_at: '2021-11-25T11:00:00.000Z',
      isdeleted: false,
    },
    {
      name: 'AI',
      user_id: 3,
      folder_id: 1,
      created_by: 'Luffy',
      updated_by: 'Luffy',
      created_at: '2022-03-05T08:00:00.000Z',
      updated_at: '2023-04-10T14:00:00.000Z',
      isdeleted: false,
    },
  ]);
}
