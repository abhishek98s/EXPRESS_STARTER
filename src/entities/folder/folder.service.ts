import { folderExceptionMessages } from './constant/folderExceptionMessages';
import * as FolderDAO from './folder.repository';
import * as BookmarkDAO from '../bookmark/bookmark.repository';
import { FolderModel } from './folder.model';
import { customHttpError } from '../../utils/customHttpError';
import { StatusCodes } from 'http-status-codes';

/**
 * The function `findAllFolders` retrieves all folders from a database using Knex and returns them as
 * an array of `FolderModel` objects.
 * @returns an array of FolderModel objects.
 */
export const findAllFolders = async (
  user_id: number,
): Promise<FolderModel[]> => {
  const folders: FolderModel[] = await FolderDAO.fetchAllParent(user_id);

  return folders;
};

export const findAllNestedFolders = async (
  user_id: number,
  parentFolderId: number,
): Promise<FolderModel[]> => {
  const folder: FolderModel = await FolderDAO.fetchById(parentFolderId);

  if (!folder)
    throw new customHttpError(
      StatusCodes.NOT_FOUND,
      folderExceptionMessages.FOLDER_NOT_FOUND,
    );
  const folders: FolderModel[] = await FolderDAO.fetchAllNested(
    user_id,
    parentFolderId,
  );

  return folders;
};

/**
 * The function `findFolderById` is an asynchronous function that retrieves a folder by its ID from a
 * database using Knex and returns it.
 * @param {number} folderId - The `folderId` parameter is the unique identifier of the folder you want
 * to find. It is of type `number`.
 * @returns a Promise that resolves to a FolderModel object.
 */
export const findFolderById = async (
  folderId: number,
): Promise<FolderModel> => {
  const folder: FolderModel = await FolderDAO.fetchById(folderId);

  if (!folder)
    throw new customHttpError(
      StatusCodes.NOT_FOUND,
      folderExceptionMessages.FOLDER_NOT_FOUND,
    );

  return folder;
};

/**
 * The function `addFolders` inserts folder data into a database table and returns the inserted folder.
 * @param {FolderModel} folderData - The `folderData` parameter is an object of type `FolderModel` that
 * contains the data for the folder to be added.
 * @returns the inserted folder data.
 */
export const addFolders = async (folderData: FolderModel) => {
  const folder = await FolderDAO.create(folderData);
  if (!folder)
    throw new customHttpError(
      StatusCodes.CONFLICT,
      folderExceptionMessages.ADD_FAILED,
    );

  const { folder_Id } = folder;

  return await FolderDAO.fetchById(folder_Id);
};

/**
 * The function updates a folder in a database using the provided folder data and folder ID.
 * @param {FolderModel} folderData - The `folderData` parameter is an object that represents the
 * updated data for the folder. It should contain the properties and values that need to be updated in
 * the folder record in the database.
 * @param {number} folderId - The `folderId` parameter is the unique identifier of the folder that
 * needs to be updated. It is of type `number`.
 * @returns the updated folder data.
 */
export const updateFolder = async (
  folderData: FolderModel,
  folderId: number,
) => {
  const folder = await FolderDAO.update(folderData, folderId);

  if (!folder)
    throw new customHttpError(
      StatusCodes.CONFLICT,
      folderExceptionMessages.UPDATE_FOLDER,
    );

  return await FolderDAO.fetchById(folderId);
};

/**
 * The function `removeFolder` recursively deletes a folder and its subfolders along with their
 * associated bookmarks by updating their `isdeleted` flag in the database.
 * @param {number} folderId - The `removeFolder` function is designed to recursively delete a folder
 * and all its subfolders and bookmarks from a database. The function takes a `folderId` parameter,
 * which is the unique identifier of the folder to be deleted. The function first retrieves all
 * subfolders of the given folder, then recursively
 * @returns The `removeFolder` function is returning nothing explicitly, as it ends with `return`
 * without any value.
 */
export const removeFolder = async (folderId: number) => {
  const folder: FolderModel = await FolderDAO.fetchById(folderId);

  if (!folder)
    throw new customHttpError(
      StatusCodes.NOT_FOUND,
      folderExceptionMessages.FOLDER_NOT_FOUND,
    );
  const subfolders: FolderModel[] = await FolderDAO.fetchAllByFolderId(
    folderId,
  );

  for (const subfolder of subfolders) {
    await removeFolder(subfolder.id!);
  }

  await FolderDAO.remove(folderId);
  await BookmarkDAO.removeByFolderid(folderId);
  return;
};

/**
 * The function `sortByDate` sorts data from a specific folder by date for a given user based on the
 * specified order.
 * @param {number} userId - The `userId` parameter in the `sortByDate` function is the unique
 * identifier of the user for whom you want to sort the data.
 * @param {number} folder_id - The `folder_id` parameter in the `sortByDate` function represents the
 * unique identifier of the folder for which you want to retrieve and sort the data. It is used to
 * filter the data based on the specified folder.
 * @param {string} sortOrder - The `sortOrder` parameter in the `sortByDate` function determines the
 * order in which the data will be sorted. It can be either 'asc' for ascending order or 'desc' for
 * descending order based on the 'date' field in the database table.
 * @returns The function `sortByDate` is returning the sorted data from the `folders` table based on
 * the specified `userId`, `folder_id`, and `sortOrder`. If the sorted data is empty, it will throw an
 * error with the message `FOLDER_EMPTY`.
 */
export const sortByDate = async (
  userId: number,
  folder_id: number,
  sortOrder: string,
) => {
  const isFolderExits = await FolderDAO.fetchById(folder_id);

  if (!isFolderExits) {
    throw new customHttpError(
      StatusCodes.NOT_FOUND,
      folderExceptionMessages.FOLDER_NOT_FOUND,
    );
  }
  const sortedData = await FolderDAO.sortBy(
    'created_at',
    userId,
    folder_id,
    sortOrder,
  );

  return sortedData;
};

/**
 * The function sorts folders by title alphabetically for a specific user and folder ID.
 * @param {number} userId - The `userId` parameter in the `sortByAlphabet` function represents the
 * unique identifier of the user for whom the folders are being sorted.
 * @param {number} folder_id - The `folder_id` parameter in the `sortByAlphabet` function represents
 * the unique identifier of the folder for which you want to sort the data. It is used to filter the
 * data based on the specified folder.
 * @param {string} sortOrder - The `sortOrder` parameter in the `sortByAlphabet` function determines
 * the order in which the data will be sorted. It can be either `'asc'` for ascending order or `'desc'`
 * for descending order based on the `title` field of the folders table.
 * @returns The function `sortByAlphabet` is returning the sorted data from the `folders` table based
 * on the `title` column and the specified `sortOrder`. The data is filtered by `user_id`, `isdeleted`,
 * and `folder_id`. If the sorted data is empty, an error with the message `FOLDER_EMPTY` will be
 * thrown.
 */
export const sortByAlphabet = async (
  userId: number,
  folder_id: number,
  sortOrder: string,
) => {
  const isFolderExits = await FolderDAO.fetchById(folder_id);

  if (!isFolderExits) {
    throw new customHttpError(
      StatusCodes.NOT_FOUND,
      folderExceptionMessages.FOLDER_NOT_FOUND,
    );
  }
  const sortedData = await FolderDAO.sortBy(
    'name',
    userId,
    folder_id,
    sortOrder,
  );

  return sortedData;
};
