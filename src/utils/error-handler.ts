import { NextFunction, Request, Response } from 'express';
import { HttpError } from 'http-errors';
import { StatusCodes } from 'http-status-codes';
import { MulterError } from 'multer';

import { middlewareExceptionMessage } from '../middleware/constant/middlewareExceptionMessage';
import { authExceptionMessages } from '../auth/constant/authExceptionMessages';

export const errorHandlerMiddleware = (
  err: HttpError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const statusCode = err.statusCode || 500;

  if (parseInt(err.code) === 11000) {
    return res.status(StatusCodes.CONFLICT).json({
      status: false,
      message: authExceptionMessages.EMAIL_ALREADY_EXISTS,
    });
  }

  if (err instanceof MulterError && err.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: false,
      message: middlewareExceptionMessage.FIELD_NAME_INCORRECT,
    });
  }
  return res.status(statusCode).json({
    status: false,
    message: err.message,
  });
};
