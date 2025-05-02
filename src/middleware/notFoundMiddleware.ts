import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { middlewareExceptionMessage } from './constant/middlewareExceptionMessage';

const notFoundHandler = (req: Request, res: Response) => {
  res
    .status(StatusCodes.NOT_FOUND)
    .json({ success: false, message: middlewareExceptionMessage.INALID_ROUTE });
};

export default notFoundHandler;
