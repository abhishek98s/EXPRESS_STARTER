import knex from '../../config/knex.config';
import { UserModel } from './user.model';

/**
 * This function fetches user data by their ID from a database table called 'users' while ensuring the
 * user is not deleted.
 * @param {number} userId - The `userId` parameter is the unique identifier of the user whose
 * information you want to fetch from the database.
 * @returns The `fetchById` function is returning a Promise that resolves to an object containing the
 * user's `id`, `username`, `email`, and `image_id` from the database table `users` where the `id`
 * matches the `userId` parameter and the `isdeleted` column is `false`.
 */
export const fetchById = async (userId: number) => {
  return await knex('users')
    .select('id', 'username', 'email', 'image_id')
    .where('id', userId)
    .andWhere('isdeleted', false)
    .first();
};

export const fetchByEmail = async (email: string) => {
  return await knex('users')
    .select('id', 'username', 'email', 'image_id')
    .where('email', email)
    .andWhere('isdeleted', false)
    .first();
};

/**
 * The function creates a new user record in a database table and returns the user's ID.
 * @param {UserModel} userData - The `userData` parameter is an object of type `UserModel` containing
 * the data needed to create a new user in the database. This data typically includes properties such
 * as username, email, password, and any other relevant information for a user profile.
 * @returns { userID: user[0].id }
 */
export const create = async (userData: UserModel) => {
  const user = await knex('users').insert(userData).returning('id');
  return { userID: user[0].id };
};

/**
 * The function `update` updates a user username or password record in the database with the provided data for a specific
 * user ID.
 * @param {UserModel} userData - The `userData` parameter in the `update` function is of type
 * `UserModel`, which likely represents an object containing data to update for a user in a database.
 * This object may include fields such as `name`, `email`, `password`, etc., depending on the schema of
 * the `users
 * @param {number} userId - The `userId` parameter is the unique identifier of the user whose data you
 * want to update in the database.
 * @returns The `update` function is returning a promise that resolves to the result of updating the
 * user data in the database table `users` where the `id` matches the provided `userId`.
 */
export const update = async (userData: UserModel, userId: number) => {
  return await knex('users').select('*').where('id', userId).update(userData);
};

/**
 * This TypeScript function removes a user by updating the 'isdeleted' field to true in the 'users'
 * table based on the provided userId.
 * @param {number} userId - The `userId` parameter is the unique identifier of the user that you want
 * to mark as deleted in the database.
 * @returns The `remove` function is returning a promise that resolves to the result of updating the
 * `isdeleted` field to `true` for the user with the specified `userId` in the `users` table.
 */
export const remove = async (userId: number) => {
  return await knex('users').where('id', userId).update('isdeleted', true);
};
