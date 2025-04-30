import { Request, Response } from 'express';
import { FolderModel } from './folder.model';
import {
  addFolders,
  findAllFolders,
  findAllNestedFolders,
  findFolderById,
  removeFolder,
  sortByAlphabet,
  sortByDate,
  updateFolder,
} from './folder.service';
import { uploadImage } from '../image/image.controller';
import { findImage, saveImage } from '../image/image.service';
import { folderExceptionMessages } from './constant/folderExceptionMessages';
import crypto from 'crypto';
import { StatusCodes } from 'http-status-codes';
import { customHttpError } from '../../utils/customHttpError';
import { folderSuccessMessages } from './constant/folderSuccessMessages';

const isImage = async (username: string) => {
  try {
    await findImage(1);
    return 1;
  } catch (error) {
    const imageName = crypto.randomUUID();
    const image = await saveImage(
      {
        type: 'folder',
        url: 'https://res.cloudinary.com/dxsqdqnoe/image/upload/v1709878273/litmark/xo5sncdhybhemuvacf4u.png',
        name: imageName,
        isdeleted: false,
      },
      username,
    );
    return image.id!;
  }
};

/**
 * The function `getAllFolders` is an asynchronous function that retrieves all folders and sends the
 * result as a JSON response.
 * @param {Request} req - The `req` parameter is an object that represents the HTTP request made by the
 * client. It contains information such as the request method, headers, query parameters, and body.
 * @param {Response} res - The `res` parameter is the response object that is used to send the HTTP
 * response back to the client. It contains methods and properties that allow you to set the response
 * status, headers, and body. In this code snippet, it is used to send a JSON response with the status
 * code 200
 */
export const getAllTopFolders = async (req: Request, res: Response) => {
  const result: FolderModel[] = await findAllFolders(req.body.user.id);
  res.status(StatusCodes.OK).json({ success: true, data: result });
};

/**
 * The function `getAllnestedFolders` retrieves all nested folders for a given parent folder ID and
 * returns the result in a JSON response.
 * @param {Request} req - Request object containing information about the HTTP request
 * @param {Response} res - The `res` parameter in the `getAllnestedFolders` function is an object
 * representing the HTTP response that the function will send back to the client. It is of type
 * `Response`, which is typically provided by web frameworks like Express in Node.js. The `res` object
 * has methods like `status
 */
export const getAllnestedFolders = async (req: Request, res: Response) => {
  const parentFolderId: number = parseInt(req.params.id);

  if (isNaN(parentFolderId)) {
    throw new customHttpError(
      StatusCodes.BAD_REQUEST,
      folderExceptionMessages.INVALID_ID,
    );
  }
  const result: FolderModel[] = await findAllNestedFolders(
    req.body.user.id,
    parentFolderId,
  );
  res.status(StatusCodes.OK).json({ success: true, data: result });
};

/**
 * The `postFolders` function is an asynchronous function that handles the creation of folders,
 * including uploading an image if provided, and returns the result as a JSON response.
 * @param {Request} req - The `req` parameter is an object that represents the HTTP request made to the
 * server. It contains information such as the request headers, request body, request method, and
 * request URL.
 * @param {Response} res - The `res` parameter is the response object that is used to send the response
 * back to the client. It contains methods and properties that allow you to control the response, such
 * as setting the status code, headers, and sending the response body.
 */
export const postFolders = async (req: Request, res: Response) => {
  const { name, folder_id, user } = req.body;

  if (req.file) {
    const imagePath = req.file!.path;
    const imageUrl = await uploadImage(imagePath);

    const image = await saveImage(
      {
        url: imageUrl,
        type: 'folder',
        name: req.file.filename,
        isdeleted: false,
      },
      user.username,
    );

    req.body.image_id = image.id;
  }

  const folderData: FolderModel = {
    name,
    user_id: user.id,
    image_id: await isImage(user.username),
    folder_id: folder_id || null,
    isdeleted: false,
    created_by: user.username,
    updated_by: user.username,
  };

  const result = await addFolders(folderData);

  res.status(StatusCodes.OK).json({ success: true, data: result });
};

/**
 * The function `patchFolders` is an asynchronous function that handles the patch request for updating
 * a folder's name and image.
 * @param {Request} req - The `req` parameter is an object that represents the HTTP request made to the
 * server. It contains information such as the request headers, request body, request method, request
 * URL, and other relevant details.
 * @param {Response} res - The `res` parameter is the response object that is used to send the response
 * back to the client. It contains methods and properties that allow you to control the response, such
 * as setting the status code, headers, and sending the response body.
 */
export const patchFolders = async (req: Request, res: Response) => {
  const folderId: number = parseInt(req.params.id);
  if (!folderId || isNaN(folderId))
    throw new customHttpError(
      StatusCodes.BAD_REQUEST,
      folderExceptionMessages.INVALID_ID,
    );

  const { name, user } = req.body;

  if (!name) {
    throw new customHttpError(
      StatusCodes.BAD_REQUEST,
      folderExceptionMessages.NAME_REQUIRED,
    );
  }

  if (req.file) {
    const imagePath = req.file!.path;
    const imageUrl = await uploadImage(imagePath);

    const image = await saveImage(
      {
        url: imageUrl,
        type: 'user',
        name: req.file.filename,
        isdeleted: false,
      },
      user.username,
    );

    req.body.image_id = image.id;
  }

  const currentFolder: FolderModel = await findFolderById(folderId);
  delete currentFolder.image_url;

  const { image_id: curretImage } = currentFolder;

  const folderData: FolderModel = {
    ...currentFolder,
    name,
    image_id: req.body.image_id || curretImage,
    updated_by: user.username,
  };

  const result = await updateFolder(folderData, folderId);

  res.status(StatusCodes.OK).json({ success: true, data: result });
};

/**
 * The function `deleteFolders` is an asynchronous function that handles the deletion of folders by
 * taking a request and response object as parameters.
 * @param {Request} req - The `req` parameter is an object that represents the HTTP request made to the
 * server. It contains information such as the request method, headers, query parameters, and request
 * body.
 * @param {Response} res - The `res` parameter is the response object that is used to send the response
 * back to the client. It contains methods and properties that allow you to set the status code,
 * headers, and send the response body.
 */
export const deleteFolders = async (req: Request, res: Response) => {
  const folderId: number = parseInt(req.params.id);
  if (!folderId || isNaN(folderId))
    throw new customHttpError(
      StatusCodes.BAD_REQUEST,
      folderExceptionMessages.INVALID_ID,
    );

  await removeFolder(folderId);

  res
    .status(StatusCodes.OK)
    .json({ success: true, message: folderSuccessMessages.DELETE_SUCCESS });
};

/**
 * The function `getSortedFolders` sorts folders based on a specified criteria and returns the sorted
 * data in ascending or descending order.
 * @param {Request} req - The `req` parameter in the `getSortedFolders` function represents the
 * incoming request to the server. It contains information such as the request method, request headers,
 * request body, request parameters, query parameters, and more. In this specific function, `req` is of
 * type `Request`, which
 * @param {Response} res - The `res` parameter in the `getSortedFolders` function is the response
 * object that will be used to send a response back to the client making the request. It is an instance
 * of the `Response` class from the Express.js framework. This object allows you to send HTTP responses
 * with data back
 */
export const getSortedFolders = async (req: Request, res: Response) => {
  const sortBy = req.query.sort as string;
  const folder_id = req.query.folder_id as unknown as number;
  const sortOrder = (req.query.order as string) || 'asc';

  const { user } = req.body;

  let result;

  switch (sortBy) {
    case 'date':
      result = await sortByDate(user.id, folder_id, sortOrder);
      break;
    case 'alphabet':
      result = await sortByAlphabet(user.id, folder_id, sortOrder);
      break;
    default:
      throw new customHttpError(
        StatusCodes.BAD_REQUEST,
        folderExceptionMessages.SORT_INVALID,
      );
  }
  res.status(StatusCodes.OK).json({ success: true, data: result });
};
