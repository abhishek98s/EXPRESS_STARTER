import knex from '../../config/knex.config';
import { ChipModel } from './chip.model';

/**
 * This TypeScript function fetches a chip by its ID from a database table called 'chips' while
 * ensuring it is not marked as deleted.
 * @param {number} chipId - The `chipId` parameter is a number that represents the unique identifier of
 * a chip in the database. The `fetchById` function is an asynchronous function that retrieves
 * information about a chip based on its `chipId`. It queries the `chips` table in the database and
 * selects the `id
 * @returns The `fetchById` function is returning a Promise that resolves to an object containing the
 * 'id', 'name', 'user_id', and 'folder_id' properties of a chip from the database where the 'id'
 * matches the provided `chipId` and 'isdeleted' is false.
 */
export const fetchById = async (chipId: number) => {
  return await knex('chips')
    .select('id', 'name', 'user_id', 'folder_id')
    .where('id', chipId)
    .andWhere('isdeleted', false)
    .first();
};

/**
 * This TypeScript function fetches all non-deleted chips belonging to a specific user based on their
 * user_id.
 * @param {number} user_id - The `user_id` parameter is a number that is used to filter the results of
 * the database query. The `fetchAll` function fetches all records from the `chips` table where the
 * `user_id` matches the provided `user_id` parameter and the `isdeleted` flag is set
 * @returns The `fetchAll` function is returning a Promise that resolves to an array of objects
 * containing the 'id', 'name', 'user_id', and 'folder_id' properties of chips that belong to the
 * specified user and have not been deleted.
 */
export const fetchAll = async (user_id: number) => {
  return await knex('chips')
    .select('id', 'name', 'user_id', 'folder_id')
    .where('user_id', user_id)
    .andWhere('isdeleted', false);
};

/**
 * The function creates a new record in the 'chips' table using the provided data and returns the ID of
 * the newly created record.
 * @param {ChipModel} chipData - The `chipData` parameter is of type `ChipModel`, which likely contains
 * the data needed to create a new record in the `chips` table. This data is being inserted into the
 * `chips` table using the `knex` library, and the `id` of the newly
 * @returns The `create` function is returning an object with a property `chipID` that contains the ID
 * of the newly inserted chip record in the database.
 */
export const create = async (chipData: ChipModel) => {
  const chip = await knex('chips').insert(chipData).returning('id');
  return { chipID: chip[0].id };
};

/**
 * The function `update` updates a chip record in the database with the provided data based on the chip
 * ID.
 * @param {ChipModel} chipData - `chipData` is an object representing the data that needs to be updated
 * for a chip in the database. It likely contains properties such as `name`, `color`, `size`, etc.,
 * depending on the schema of the `chips` table in the database.
 * @param {number} chipId - The `chipId` parameter is the unique identifier of the chip that you want
 * to update in the database. It is used to locate the specific chip record in the `chips` table for
 * updating.
 * @returns The `update` function is returning a promise that resolves to the result of updating the
 * `chips` table in the database with the provided `chipData` for the chip with the specified `chipId`.
 */
export const update = async (chipData: ChipModel, chipId: number) => {
  return await knex('chips').where('id', chipId).update(chipData);
};

/**
 * The function removes a chip by updating its 'isdeleted' field to true in the database.
 * @param {number} chipId - The `chipId` parameter is a number that represents the unique identifier of
 * a chip in the database. The `remove` function is an asynchronous function that updates the
 * `isdeleted` field of the `chips` table in the database to `true` for the chip with the specified
 * `chip
 * @returns The `remove` function is returning a promise that updates the `isdeleted` field to `true`
 * in the `chips` table where the `id` matches the `chipId` provided.
 */
export const remove = async (chipId: number) => {
  return await knex('chips').update('isdeleted', true).where('id', chipId);
};
