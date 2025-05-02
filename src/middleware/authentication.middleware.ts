import jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
import { NextFunction, Request, Response } from 'express';

import { customHttpError } from '../utils/customHttpError';
import { authExceptionMessages } from '../auth/constant/authExceptionMessages';

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.headers['authorization'];
  if (!token)
    throw new customHttpError(
      StatusCodes.UNAUTHORIZED,
      authExceptionMessages.ACCESS_DENIED,
    );

  jwt.verify(
    token.replace('Bearer ', ''),
    process.env.JWT_TOKEN as string,
    (err, decoded) => {
      if (err) {
        throw new customHttpError(
          StatusCodes.FORBIDDEN,
          authExceptionMessages.TOKEN_INVALID,
        );
      }

      req.body.user = decoded;
      next();
    },
  );
};
