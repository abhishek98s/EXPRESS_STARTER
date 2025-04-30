import { StatusCodes } from 'http-status-codes';
import bcrypt from 'bcrypt';

import { authExceptionMessage } from '../auth/constant/authExceptionMessage';
import { customHttpError } from './customHttpError';

export const isMatchingPassword = async (
  password: string,
  hashed_password: string,
) => {
  const isMatch = await bcrypt.compare(password, hashed_password);
  if (!isMatch)
    throw new customHttpError(
      StatusCodes.UNAUTHORIZED,
      authExceptionMessage.INVALID_CREDENTIALS,
    );

  return;
};

export const passwordHash = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  return hashedPassword;
};
