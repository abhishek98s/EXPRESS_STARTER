/** @format */

import knex from '../../config/knex.config';
import { BookmarkModel } from './bookmark.model';

/**
 * This TypeScript function fetches a bookmark by its ID from a database table, ensuring it is not
 * marked as deleted, and returns the bookmark model.
 * @param {number} bookmarkId - The `bookmarkId` parameter is the unique identifier of the bookmark
 * that you want to fetch from the database. It is used to query the database for a specific bookmark
 * based on its ID.
 * @returns The `fetchById` function is returning a Promise that resolves to a `BookmarkModel` object.
 * The function fetches a bookmark from the database based on the `bookmarkId`, ensuring that the
 * bookmark is not deleted (`isdeleted` is false). The retrieved bookmark data includes the fields:
 * 'id', 'url', 'image_id', 'user_id', 'folder_id', 'chip_id', 'title', 'date, 'date'
 */
export const fetchById = async (bookmarkId: number): Promise<BookmarkModel> => {
  const bookmark = await knex('bookmarks')
    .select(
      'bookmarks.id',
      'bookmarks.url',
      'bookmarks.image_id',
      'bookmarks.user_id',
      'bookmarks.folder_id',
      'bookmarks.chip_id',
      'bookmarks.title',
      'bookmarks.date',
      'images.url as image_url',
    )
    .leftJoin('images', 'bookmarks.image_id', 'images.id')
    .where('bookmarks.id', bookmarkId)
    .andWhere('bookmarks.isdeleted', false);
  return bookmark[0];
};

/**
 * This TypeScript function fetches all bookmarks belonging to a specific user that are not marked as
 * deleted.
 * @param {number} user_id - The `user_id` parameter is a number that is used to filter bookmarks based
 * on the user who created them.
 * @returns The `fetchAll` function is returning a Promise that resolves to an array of `BookmarkModel`
 * objects. These objects contain properties such as `id`, `url`, `image_id`, `user_id`, `folder_id`,
 * `chip_id`, 'date' and `title`. The function fetches bookmarks from the database table `bookmarks` where the
 * `user_id` matches the provided `user_id` parameter
 */
export const fetchAll = async (user_id: number): Promise<BookmarkModel[]> => {
  return await knex('bookmarks')
    .select(
      'bookmarks.id',
      'bookmarks.url',
      'bookmarks.image_id',
      'bookmarks.user_id',
      'bookmarks.folder_id',
      'bookmarks.chip_id',
      'bookmarks.title',
      'bookmarks.date',
      'images.url as image_url',
    )
    .leftJoin('images', 'bookmarks.image_id', 'images.id')
    .where('bookmarks.user_id', user_id)
    .andWhere('bookmarks.isdeleted', false);
};

/**
 * This TypeScript function fetches bookmarks by user ID and folder ID while excluding deleted
 * bookmarks.
 * @param {number} user_id - The `user_id` parameter is a number that represents the unique identifier
 * of the user whose bookmarks are being fetched.
 * @param {number} folder_id - The `folder_id` parameter in the `fetchByFolderId` function represents
 * the unique identifier of the folder for which you want to retrieve bookmarks. This function fetches
 * bookmarks from the database based on the `user_id` and `folder_id` provided as parameters.
 * @returns The `fetchByFolderId` function returns a Promise that resolves to an array of
 * `BookmarkModel` objects. Each `BookmarkModel` object contains the properties `id`, `url`,
 * `image_id`, `folder_id`, 'date' and `title`. The bookmarks are filtered based on the `user_id`,
 * `folder_id`, and `isdeleted` criteria specified in the query.
 */
export const fetchByFolderId = async (
  user_id: number,
  folder_id: number,
): Promise<BookmarkModel[]> => {
  return await knex('bookmarks')
    .select(
      'bookmarks.id',
      'bookmarks.url',
      'bookmarks.image_id',
      'bookmarks.folder_id',
      'bookmarks.title',
      'bookmarks.date',
      'images.url as image_url',
    )
    .leftJoin('images', 'bookmarks.image_id', 'images.id')
    .where('bookmarks.user_id', user_id)
    .andWhere('bookmarks.folder_id', folder_id)
    .andWhere('bookmarks.isdeleted', false);
};

/**
 * The function creates a new bookmark record in the database and returns the ID of the newly created
 * bookmark.
 * @param {BookmarkModel} bookmarkData - BookmarkModel is a type representing the data structure of a
 * bookmark. It likely includes properties such as title, url, description, and any other relevant
 * information about a bookmark.
 * @returns The `create` function is returning an object with a property `bookmarkId` that contains the
 * id of the newly inserted bookmark in the database.
 */
export const create = async (
  bookmarkData: BookmarkModel,
): Promise<{ bookmarkId: number }> => {
  const bookmark = await knex('bookmarks').insert(bookmarkData).returning('id');
  return { bookmarkId: bookmark[0].id };
};

/**
 * The function `updateTitle` updates a bookmark's data in the database based on the provided bookmark
 * ID.
 * @param {BookmarkModel} bookmarkData - BookmarkModel - an object containing data to update for a
 * bookmark
 * @param {number} bookmarkId - The `bookmarkId` parameter is the unique identifier of the bookmark
 * that you want to update in the database. It is used to locate the specific bookmark record that
 * needs to be updated.
 * @returns The `updateTitle` function is returning a promise that resolves to the result of updating
 * the `bookmarks` table in the database with the provided `bookmarkData` for the bookmark identified
 * by `bookmarkId`.
 */
export const updateTitle = async (
  bookmarkData: BookmarkModel,
  bookmarkId: number,
): Promise<number> => {
  return await knex('bookmarks').where('id', bookmarkId).update(bookmarkData);
};

/**
 * The function `remove` updates a bookmark record in the database based on the provided
 * `bookmarkData` object which is changed the isdeleted to true.
 * @param {BookmarkModel} bookmarkData - BookmarkModel
 * @returns The `remove` function is returning a promise that resolves to the result of updating the
 * `bookmarks` table in the database where the `id` matches the `id` of the `bookmarkData` object with
 * the values from the `bookmarkData` object which is to change the isdeleted to true.
 */
export const remove = async (bookmarkData: BookmarkModel) => {
  return await knex('bookmarks')
    .where('id', bookmarkData.id)
    .update(bookmarkData);
};

/**
 * This function removes bookmarks by setting their 'isdeleted' flag to true based on the provided
 * folderId.
 * @param {number} folderId - The `folderId` parameter is a number that represents the unique
 * identifier of the folder for which you want to remove bookmarks.
 * @returns The function `removeByFolderid` is returning a Promise that resolves to the result of
 * updating the `isdeleted` field to `true` for all bookmarks in the `bookmarks` table where the
 * `folder_id` matches the provided `folderId`.
 */
export const removeByFolderid = async (folderId: number) => {
  return await knex('bookmarks')
    .where('folder_id', folderId)
    .update('isdeleted', true);
};

/**
 * This function fetches bookmarks by title from a specific folder while ensuring they are not deleted.
 * @param {string} title - The `title` parameter is a string that represents the title of the bookmark
 * you want to search for in the database.
 * @param {number} folderId - The `folderId` parameter is the ID of the folder in which you want to
 * search for bookmarks with titles similar to the provided `title`.
 * @returns The function `fetchByTitle` is returning a Promise that resolves to an array of objects
 * containing the `title` and `url` of bookmarks that match the provided `title` (case-insensitive)
 * within a specific `folderId` where the `isdeleted` flag is set to false.
 */
export const fetchByTitle = async (title: string, folderId: number) => {
  return await knex('bookmarks')
    .select('title', 'url')
    .whereRaw('LOWER(title) LIKE LOWER(?)', [`%${title}%`])
    .andWhere('isdeleted', false)
    .andWhere('folder_id', folderId);
};

/**
 * This function sorts bookmarks by a specified criteria for a specific user and folder.
 * @param {string} sortBy - The `sortBy` parameter is a string that specifies the column by which the
 * bookmarks should be sorted.
 * @param {number} userId - The `userId` parameter is the unique identifier of the user for whom the
 * bookmarks are being retrieved.
 * @param {number} folder_id - The `folder_id` parameter represents the unique identifier of the folder
 * in which the bookmarks are stored. It is used to filter the bookmarks based on the specified folder.
 * @param {string} sortOrder - The `sortOrder` parameter specifies the order in which the results
 * should be sorted. It can have two possible values: "asc" for ascending order or "desc" for
 * descending order.
 * @returns The function `sortBy` is returning a promise that resolves to an array of bookmarks of objects
 * containing the 'id', 'url', 'image_id', 'folder_id', 'title', 'date'
 * selected from the database table 'bookmarks' based on the provided parameters such as `userId`,
 * `folder_id`, `sortBy`, and `sortOrder`. The bookmarks are filtered by the `user_id`, `isdeleted`,
 * and `folder_id` conditions and sorted based on the `sortBy` field in the specified `
 */
export const sortBy = async (
  sortBy: 'created_at' | 'title',
  userId: number,
  folder_id: number,
  sortOrder: string,
) => {
  return await knex('bookmarks')
    .select(
      'bookmarks.id',
      'bookmarks.url',
      'bookmarks.image_id',
      'bookmarks.folder_id',
      'bookmarks.title',
      'bookmarks.date',
      'images.url as image_url',
    )
    .leftJoin('images', 'bookmarks.image_id', 'images.id')
    .where('bookmarks.user_id', userId)
    .andWhere('bookmarks.isdeleted', false)
    .andWhere('bookmarks.folder_id', folder_id)
    .orderBy(`bookmarks.${sortBy}`, sortOrder);
};

/**
 * The function `updateClickedDate` updates a bookmark's data in the database based on the provided
 * `bookmarkData` object.
 * @param {BookmarkModel} bookmarkData - BookmarkModel is an object containing data related to a
 * bookmark, such as id, title, url, and any other relevant information.
 * @returns The `updateClickedDate` function is returning a Promise that resolves to the result of
 * updating the `bookmarkData` in the `bookmarks` table where the `id` matches the `bookmarkData.id`.
 */
export const updateClickedDate = async (bookmarkData: BookmarkModel) => {
  return await knex('bookmarks')
    .update(bookmarkData)
    .where('id', bookmarkData.id);
};

/**
 * The function `removeRecentlyClickedBookmark` updates a bookmark attribute date to null in the database based on the user ID
 * and bookmark ID.
 * @param {BookmarkModel} bookmarkData - BookmarkModel is an object containing data about a bookmark,
 * such as id, title, url, and any other relevant information.
 * @param {number} user_id - The `user_id` parameter is the unique identifier of the user whose
 * bookmark you want to update or remove.
 * @returns a promise that updates the bookmark date attribute in the database table 'bookmarks' for a specific
 * user based on the user_id and bookmark id provided.
 */
export const removeRecentlyClickedBookmark = async (
  bookmarkData: BookmarkModel,
  user_id: number,
) => {
  return await knex('bookmarks')
    .update(bookmarkData)
    .where('user_id', user_id)
    .andWhere('id', bookmarkData.id);
};

/**
 * This function sorts recently clicked bookmarks by a specified criteria for a given user.
 * @param {string} sortBy - The `sortBy` parameter is the field by which you want to sort the recently
 * clicked bookmarks. It could be any field present in the `bookmarks` table, such as `id`, `url`,
 * `image_id`, `folder_id`, `title`, or `date`.
 * @param {number} userId - The `userId` parameter is the unique identifier of the user whose bookmarks
 * you want to sort.
 * @param {string} sortOrder - The `sortOrder` parameter specifies the order in which the bookmarks
 * should be sorted. It can have two possible values: "asc" for ascending order or "desc" for
 * descending order. This parameter determines whether the bookmarks will be sorted in increasing or
 * decreasing order based on the specified `sortBy` parameter
 * @returns The function `sortRecentlyClickedBookmarkBy` is returning a promise that resolves to the
 * result of a database query using Knex. The query selects specific columns ('id', 'url', 'image_id',
 * 'folder_id', 'title', 'date') from the 'bookmarks' table where the 'user_id' matches the provided
 * userId, 'isdeleted' is false, and 'click_date
 */
export const sortRecentlyClickedBookmarkBy = async (
  sortBy: string,
  userId: number,
  sortOrder: string,
) => {
  return await knex('bookmarks')
    .select(
      'bookmarks.id',
      'bookmarks.url',
      'bookmarks.image_id',
      'bookmarks.folder_id',
      'bookmarks.title',
      'bookmarks.date',
      'images.url as image_url',
    )
    .leftJoin('images', 'bookmarks.image_id', 'images.id')
    .where('bookmarks.user_id', userId)
    .andWhere('bookmarks.isdeleted', false)
    .andWhereNot('bookmarks.click_date', null)
    .orderBy(sortBy, sortOrder);
};

/**
 * This function filters recently clicked bookmarks by user ID and chip ID while excluding deleted
 * bookmarks and those without a click date.
 * @param {number} userId - The `userId` parameter is the unique identifier of the user whose bookmarks
 * you want to filter.
 * @param {number} chipId - The `chipId` parameter is used to filter the bookmarks based on a specific
 * category or tag associated with them. It helps in retrieving bookmarks that are tagged with a
 * particular chip or category.
 * @returns The function `filterRecentlyClickedBookmarksByChip` is returning a Promise that resolves to
 * an array of bookmark objects that match the specified `userId`, `chipId`, and other conditions. Each
 * bookmark object in the array contains the properties: 'id', 'url', 'image_id', 'folder_id', 'title',
 * and 'date'.
 */
export const filterRecentlyClickedBookmarksByChip = async (
  userId: number,
  chipId: number,
) => {
  return await knex('bookmarks')
    .select('id', 'url', 'image_id', 'folder_id', 'title', 'date')
    .where('user_id', userId)
    .where('chip_id', chipId)
    .andWhere('isdeleted', false)
    .andWhereNot('click_date', null);
};

/**
 * This function fetches recently clicked bookmarks by title from a database table while filtering out
 * deleted bookmarks.
 * @param {string} title - The `fetchRecentlyClickedBookmarksByTittle` function is designed to fetch
 * recently clicked bookmarks based on a provided title. The function takes a `title` parameter of type
 * string, which is used to filter bookmarks whose titles contain the provided string. The function
 * then queries the database to select the `
 * @returns The function `fetchRecentlyClickedBookmarksByTittle` is returning a Promise that resolves
 * to an array of objects containing the `title` and `url` of bookmarks from the database table
 * `bookmarks` where the `title` matches the provided input `title` (case-insensitive search),
 * `isdeleted` is false, and `click_date` is not null.
 */
export const fetchRecentlyClickedBookmarksByTittle = async (
  title: string,
  user_id: number,
) => {
  return await knex('bookmarks')
    .select('title', 'url')
    .whereRaw('LOWER(title) LIKE LOWER(?)', [`%${title}%`])
    .andWhere('isdeleted', false)
    .andWhere('user_id', user_id)
    .andWhereNot('click_date', null);
};
