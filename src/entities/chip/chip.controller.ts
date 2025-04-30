import { Request, Response } from 'express';

import {
  addChip,
  findAllChips,
  findChipById,
  removeChip,
  updateChip,
} from './chip.service';
import { ChipModel } from './chip.model';
import { chipExceptionMessages } from './constant/chipExceptionMessages';
import { customHttpError } from '../../utils/customHttpError';
import { StatusCodes } from 'http-status-codes';

/**
 * The function `getAllChips` is an asynchronous function that retrieves all chips and sends the result
 * as a JSON response.
 * @param {Request} req - The `req` parameter is an object that represents the HTTP request made by the
 * client. It contains information such as the request method, headers, query parameters, and request
 * body.
 * @param {Response} res - The `res` parameter is the response object that is used to send the HTTP
 * response back to the client. It contains methods and properties that allow you to set the status
 * code, headers, and send the response body.
 */
export const getAllChips = async (req: Request, res: Response) => {
  const result: ChipModel[] = await findAllChips(req.body.user.id);

  res.status(StatusCodes.OK).json({ success: true, data: result });
};

/**
 * The `postChip` function is an asynchronous function that handles the creation of a new chip by
 * extracting the necessary data from the request body, validating the required fields, and then adding
 * the chip to the database.
 * @param {Request} req - The `req` parameter is an object representing the HTTP request made to the
 * server. It contains information such as the request headers, request body, request method, request
 * URL, etc.
 * @param {Response} res - The `res` parameter is the response object that is used to send the response
 * back to the client. It contains methods and properties that allow you to set the status code,
 * headers, and send the response body. In this code snippet, the `res` object is used to send a JSON
 * response
 */
export const postChip = async (req: Request, res: Response) => {
  const { name, folder_id, user } = req.body;

  if (!name || !folder_id) {
    throw new customHttpError(
      StatusCodes.BAD_REQUEST,
      chipExceptionMessages.Folder_NAME_REQUIRED
    );
  }

  const result: ChipModel = await addChip({
    name,
    user_id: user.id,
    folder_id,
    isdeleted: false,
    created_by: user.username,
    updated_by: user.username,
  });

  res.status(StatusCodes.OK).json({ success: true, data: result });
};

/**
 * The function `patchChip` is an asynchronous function that handles a PATCH request to update a chip's
 * name and user.
 * @param {Request} req - The `req` parameter is an object that represents the HTTP request made to the
 * server. It contains information such as the request method, headers, URL, query parameters, and
 * request body.
 * @param {Response} res - The `res` parameter is the response object that is used to send the HTTP
 * response back to the client. It contains methods and properties that allow you to set the response
 * status code, headers, and body. In this code snippet, the `res` object is used to send a JSON
 * response with
 */
export const patchChip = async (req: Request, res: Response) => {
  const chipId: number = parseFloat(req.params.id);
  if (!chipId)
    throw new customHttpError(
      StatusCodes.BAD_REQUEST,
      chipExceptionMessages.INVALID_ID
    );

  const { name, user } = req.body;

  if (!name) {
    throw new customHttpError(
      StatusCodes.BAD_REQUEST,
      chipExceptionMessages.NAME_REQUIRED
    );
  }

  const currentChip = await findChipById(chipId);

  if (!currentChip) {
    throw new customHttpError(
      StatusCodes.NOT_FOUND,
      chipExceptionMessages.CHIP_NOT_FOUND
    );
  }

  const result = await updateChip(
    { ...currentChip, name, updated_by: user.username },
    chipId
  );

  res.status(StatusCodes.OK).json({ success: true, data: result });
};

/**
 * The `deleteChip` function is an asynchronous function that handles the deletion of a chip by its ID,
 * and returns a success message or an error message.
 * @param {Request} req - The `req` parameter is an object that represents the HTTP request made to the
 * server. It contains information such as the request method, headers, query parameters, and request
 * body.
 * @param {Response} res - The `res` parameter is the response object that is used to send the response
 * back to the client. It contains methods and properties that allow you to set the status code,
 * headers, and send the response body. In this code snippet, it is used to send the response with a
 * status code of
 */
export const deleteChip = async (req: Request, res: Response) => {
  const chipId: number = parseFloat(req.params.id);
  if (!chipId)
    throw new customHttpError(
      StatusCodes.BAD_REQUEST,
      chipExceptionMessages.INVALID_ID
    );

  const isChipExist = await findChipById(chipId);

  if (!isChipExist) {
    throw new customHttpError(
      StatusCodes.NOT_FOUND,
      chipExceptionMessages.CHIP_NOT_FOUND
    );
  }

  const result = await removeChip(chipId);

  res.status(StatusCodes.OK).json({ success: true, data: result });
};
