import { StatusCodes } from 'http-status-codes';

import knex from '../../config/knex.config';
import { UserModel } from '../../entities/user/user.model';
import { addUser } from '../../entities/user/user.service';
import { customHttpError } from '../../utils/customHttpError';
import { authExceptionMessages } from '../constant/authExceptionMessages';

export const findUserByEmail = async (email: string) => {
  const user = await knex('users')
    .select('username', 'id', 'password', 'email')
    .where('email', email)
    .first();
  if (!user)
    throw new customHttpError(
      StatusCodes.UNAUTHORIZED,
      authExceptionMessages.USER_NOT_FOUND,
    );

  return user;
};

export const register = async (userData: UserModel) => {
  return await addUser(userData);
};
