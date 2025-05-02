import bcrypt from 'bcrypt';

import { userExceptionMessages } from './constant/userExceptionMessages';
import * as UserDAO from './user.repository';
import { UserModel } from './user.model';
import { customHttpError } from '../../utils/customHttpError';
import { StatusCodes } from 'http-status-codes';

/**
 * The function `getUserById` retrieves a user from a database based on their ID and returns it.
 * @param {number} userId - The `userId` parameter is a number that represents the unique identifier of
 * a user.
 * @returns a Promise that resolves to a UserModel object.
 */
export const getUserById = async (userId: number) => {
  const user: UserModel = await UserDAO.fetchById(userId);

  if (!user)
    throw new customHttpError(
      StatusCodes.NOT_FOUND,
      userExceptionMessages.USER_NOT_FOUND,
    );

  return user;
};

/**
 * The function `addUser` takes in user information, hashes the password, inserts the user into a
 * database, and returns the user.
 * @param {UserModel} userInfo - The `userInfo` parameter is an object of type `UserModel` which
 * contains information about the user that needs to be added. This information typically includes
 * properties such as `username`, `email`, and `password`.
 * @returns the user object that was inserted into the "users" table in the database.
 */
export const addUser = async (userInfo: UserModel) => {
  const { password, email } = userInfo;

  const existingUser = await UserDAO.fetchByEmail(email);

  if (existingUser) {
    throw new customHttpError(
      StatusCodes.CONFLICT,
      userExceptionMessages.EMAIL_EXITS,
    );
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await UserDAO.create({ ...userInfo, password: hashedPassword });

  if (!user)
    throw new customHttpError(
      StatusCodes.CONFLICT,
      userExceptionMessages.CREATE_FAILED,
    );

  const { userID } = user;

  return await UserDAO.fetchById(userID);
};

/**
 * The function updates a user's information in the database and returns the updated user.
 * @param {number} userId - The `userId` parameter is the unique identifier of the user that needs to
 * be updated. It is of type `number`.
 * @param {UserModel} updatedUserInfo - The `updatedUserInfo` parameter is an object of type
 * `UserModel` that contains the updated information for the user.
 * @returns the updated user information.
 */
export const updateUser = async (
  userId: number,
  updatedUserInfo: UserModel,
) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(updatedUserInfo.password, salt);

  const updatedUser = { ...updatedUserInfo, password: hashedPassword };
  const user = await UserDAO.update(updatedUser, userId);

  if (!user)
    throw new customHttpError(
      StatusCodes.CONFLICT,
      userExceptionMessages.UPDATE_FAILED,
    );

  return await UserDAO.fetchById(userId);
};

/**
 * The function removes a user from the database by their ID and returns the deleted user.
 * @param {number} userId - The `userId` parameter is the unique identifier of the user that needs to
 * be removed from the database.
 * @returns the deleted user object.
 */
export const removeUser = async (userId: number) => {
  const currentUser = await getUserById(userId);
  if (!currentUser)
    throw new customHttpError(
      StatusCodes.NOT_FOUND,
      userExceptionMessages.USER_NOT_FOUND,
    );

  const user = await UserDAO.remove(userId);
  if (!user)
    throw new customHttpError(
      StatusCodes.CONFLICT,
      userExceptionMessages.DELETE_FAILED,
    );

  return currentUser;
};
