import { Knex } from 'knex';
import bcrypt from 'bcrypt';

export const UserSeed = [
  {
    password: 'John123!',
    username: 'jhon',
    email: 'jhon@example.com',
    isdeleted: false,
    role: 'normal',
    image_id: 0,
    created_by: 'John',
    updated_by: 'John',
  },
  {
    password: 'Zoro123!',
    username: 'zoro',
    email: 'zoro@example.com',
    isdeleted: false,
    role: 'normal',
    image_id: 0,
    created_by: 'Zoro',
    updated_by: 'Zoro',
  },
  {
    password: 'Nami123!',
    username: 'nami',
    email: 'nami@example.com',
    isdeleted: false,
    role: 'normal',
    image_id: 0,
    created_by: 'Nami',
    updated_by: 'Nami',
  },
  {
    password: 'Luffy123!',
    username: 'luffy',
    email: 'luffy@example.com',
    isdeleted: false,
    role: 'normal',
    image_id: 0,
    created_by: 'Luffy',
    updated_by: 'Luffy',
  },
];

export async function seed(knex: Knex): Promise<void> {
  const hashedUsers = UserSeed.map( (user) => {
    return { ...user, password: bcrypt.hashSync(user.password, 10) };
  });
  // Deletes ALL existing entries
  await knex('users').del();

  // Inserts seed entries
  await knex('users').insert(hashedUsers);
}
