import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { customHttpError } from '../utils/customHttpError';
import { middlewareExceptionMessage } from './constant/middlewareExceptionMessage';

const customErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // Handle custom HTTP errors
  if (err instanceof customHttpError) {
    return res
      .status(err.statusCode)
      .json({ success: false, message: err.message });
  }

  // Handle SyntaxError for invalid JSON
  if (err instanceof SyntaxError && 'body' in err) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ success: false, message: middlewareExceptionMessage.INVALID_JSON });
  }
  console.log((err as Error).message);

  return res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json({ success: false, message: middlewareExceptionMessage.INTERNAL_SERVER_ERROR });
};

export default customErrorHandler;
