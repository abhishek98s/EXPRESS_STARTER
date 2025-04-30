import { Request, Response } from 'express';
import dotenv from 'dotenv';
import crypto from 'crypto';
import { StatusCodes } from 'http-status-codes';

import { BookmarkModel } from './bookmark.model';
import {
  addBookmark,
  deleteRecentBookmarkById,
  filterRecentBookmarkByChip,
  findBookmarkById,
  findBookmarks,
  findBookmarksByFolderId,
  findRecentClickedBookmarks,
  getBookmarksByTitle,
  getRecentBookmarksByTitle,
  removeBookmark,
  sortByAlphabet,
  sortByDate,
  sortRecentBookmarkByAlphabet,
  sortRecentBookmarkByDate,
  updateBookmark,
  updateClickedDate,
} from './bookmark.service';

import { uploadImage } from '../image/image.controller';
import { saveImage } from '../image/image.service';
import { bookmarkExceptionMessages } from './constant/bookmarkExceptionMessages';
import { addChip } from '../chip/chip.service';
import { findFolderById } from '../folder/folder.service';
import { FolderModel } from '../folder/folder.model';
import { ChipModel } from '../chip/chip.model';
import { getThumbnailFromURL, getTitleFromURL } from '../../utils/bookmark';
import { bookmarkSucessMessages } from './constant/bookmarkSucessMessages';
import { customHttpError } from '../../utils/customHttpError';

dotenv.config();

/**
 * The function `getBookmarks` is an asynchronous function that retrieves bookmarks and sends them as a
 * response in JSON format.
 * @param {Request} req - The `req` parameter is an object that represents the HTTP request made by the
 * client. It contains information such as the request headers, query parameters, request body, and
 * more.
 * @param {Response} res - The `res` parameter is the response object that is used to send the HTTP
 * response back to the client. It contains methods and properties that allow you to set the status
 * code, headers, and send the response body.
 */
export const getBookmarks = async (req: Request, res: Response) => {
  const { user } = req.body;

  const result: BookmarkModel[] = await findBookmarks(user.id);

  res.status(StatusCodes.OK).json({ success: true, data: result });
};

/**
 * The function `getBookmarksByFolderId` retrieves bookmarks by folder ID for a specific user and sends
 * the result as a JSON response.
 * @param {Request} req - The `req` parameter in the `getBookmarksByFolderId` function stands for the
 * HTTP request object. It contains information about the incoming request such as headers, parameters,
 * body, etc. This parameter is of type `Request` which is typically provided by web frameworks like
 * Express.js in Node
 * @param {Response} res - The `res` parameter in the `getBookmarksByFolderId` function is an instance
 * of the Express Response object. It is used to send a response back to the client making the request.
 * In this function, we are using `res` to send a JSON response with the bookmarks data or
 */
export const getBookmarksByFolderId = async (req: Request, res: Response) => {
  const { user } = req.body;
  const folder_id = parseInt(req.params.folder_id);

  const result: BookmarkModel[] = await findBookmarksByFolderId(
    user.id,
    folder_id,
  );

  res.status(StatusCodes.OK).json({ success: true, data: result });
};

/**
 * The `postBookmark` function is an asynchronous function that handles the creation of a new bookmark,
 * including uploading an image if provided, and returns the created bookmark data.
 * @param {Request} req - The `req` parameter is an object that represents the HTTP request made to the
 * server. It contains information such as the request headers, request body, request method, request
 * URL, etc.
 * @param {Response} res - The `res` parameter is the response object that is used to send the response
 * back to the client. It contains methods and properties that allow you to control the response, such
 * as setting the status code, headers, and sending the response body.
 */
export const postBookmark = async (req: Request, res: Response) => {
  const { url, folder_id, user } = req.body;

  if (!url || !folder_id) {
    throw new customHttpError(
      StatusCodes.NOT_FOUND,
      bookmarkExceptionMessages.LINK_FOLDER_REQUIRED,
    );
  }

  const isFolder: FolderModel = await findFolderById(folder_id);
  if (!isFolder)
    throw new customHttpError(StatusCodes.NOT_FOUND, 'Folder does\'nt exist.');

  const imageName = crypto.randomUUID();
  const imageUrl = await getThumbnailFromURL(url);
  const imageFromDB = await saveImage(
    { url: imageUrl, type: 'bookmark', name: imageName, isdeleted: false },
    user.username,
  );

  const chipData = {
    name: isFolder.name,
    user_id: user.id,
    folder_id,
    isdeleted: false,
    created_by: user.username,
    updated_by: user.username,
  };
  const chip: ChipModel = await addChip(chipData);

  const bookmarkData: BookmarkModel = {
    url,
    folder_id,
    title: await getTitleFromURL(url),
    image_id: imageFromDB.id || 1,
    chip_id: chip.id || 1,
    user_id: user.id,
    date: new Date(),
    isdeleted: false,
    created_by: user.username,
    updated_by: user.username,
  };

  const result = await addBookmark(bookmarkData);

  res.status(StatusCodes.OK).json({
    success: true,
    message: bookmarkSucessMessages.POST_SUCESS,
    data: result,
  });
};

/**
 * The function `patchBookmark` updates a bookmark with the provided data, including the title and
 * image, and returns the updated bookmark.
 * @param {Request} req - The `req` parameter is an object that represents the HTTP request made to the
 * server. It contains information such as the request headers, request body, request parameters, etc.
 * @param {Response} res - The `res` parameter is the response object that is used to send the HTTP
 * response back to the client. It contains methods and properties that allow you to set the response
 * status, headers, and body. In this code snippet, it is used to send a JSON response with the updated
 * bookmark data or
 */
export const patchBookmark = async (req: Request, res: Response) => {
  const bookmarkId = parseInt(req.params.id);

  if (!bookmarkId) {
    throw new customHttpError(
      StatusCodes.BAD_REQUEST,
      bookmarkExceptionMessages.INVALID_ID,
    );
  }

  const { title, user, folder_id } = req.body;

  const currentBookmark = await findBookmarkById(bookmarkId);
  delete currentBookmark.image_url;

  const {
    title: currentBookmarkTitle,
    image_id: currentBookmarkImage,
    folder_id: currentBookmarkFolderId,
  } = currentBookmark;

  if (req.file) {
    const imagePath = req.file!.path;
    const imageUrl = await uploadImage(imagePath);

    const image = await saveImage(
      {
        url: imageUrl,
        type: 'bookmark',
        name: req.file.filename,
        isdeleted: false,
      },
      user.username,
    );

    req.body.image_id = image.id;
  }

  const bookmarkData: BookmarkModel = {
    ...currentBookmark,
    title: title || currentBookmarkTitle,
    folder_id: folder_id || currentBookmarkFolderId,
    image_id: req.body.image_id || currentBookmarkImage,
    updated_by: user.username,
  };

  const result = await updateBookmark(bookmarkData, bookmarkId);

  res.status(StatusCodes.OK).json({
    success: true,
    message: bookmarkSucessMessages.PATCH_SUCESS,
    data: result,
  });
};

/**
 * The function `deleteBookmark` is an asynchronous function that handles the deletion of a bookmark by
 * its ID and returns a JSON response with the result.
 * @param {Request} req - The `req` parameter is an object that represents the HTTP request made to the
 * server. It contains information such as the request method, headers, query parameters, and request
 * body.
 * @param {Response} res - The `res` parameter is the response object that is used to send the HTTP
 * response back to the client. It contains methods and properties that allow you to set the status
 * code, headers, and send the response body.
 */
export const deleteBookmark = async (req: Request, res: Response) => {
  const bookmarkId = parseInt(req.params.id);

  if (!bookmarkId) {
    throw new customHttpError(
      StatusCodes.BAD_REQUEST,
      bookmarkExceptionMessages.INVALID_ID,
    );
  }

  const result = await removeBookmark(bookmarkId);

  res.status(StatusCodes.OK).json({
    success: true,
    message: bookmarkSucessMessages.DELETE_SUCESS,
    data: result,
  });
};

/**

 * This TypeScript function searches for bookmarks by title and returns the results in a JSON format,
 * handling errors appropriately.
 * @param {Request} req - Request object containing information about the HTTP request
 * @param {Response} res - The `res` parameter in the `searchByTitle` function is an object
 * representing the HTTP response that the function will send back to the client. It is of type
 * `Response`, which is typically provided by a web framework like Express in Node.js. This object
 * allows you to send data back to
 */

export const searchByTitle = async (req: Request, res: Response) => {
  const title: string = req.query.title as string;
  const folder_id: number = req.query.folder_id as unknown as number;

  const result = await getBookmarksByTitle(title!, folder_id!);

  res.status(StatusCodes.OK).json({ success: true, data: result });
};
/*
 * The function `getSortedData` in TypeScript fetches and sorts data based on specified criteria like
 * date or alphabet for a given user and folder.
 * @param {Request} req - The `req` parameter in the `getSortedData` function represents the request
 * object, which contains information about the HTTP request that was made. This object includes
 * properties such as `query` (for query parameters), `body` (for request body data), `params` (for
 * route parameters),
 * @param {Response} res - The `res` parameter in the `getSortedData` function is an object
 * representing the HTTP response that the function will send back to the client. It is of type
 * `Response`, which is typically provided by a web framework like Express in Node.js. The `res` object
 * has methods like `
 */
export const getSortedData = async (req: Request, res: Response) => {
  const sortBy = req.query.sort as string;
  const folder_id = req.query.folder_id as unknown as number;
  const sortOrder = (req.query.order as string) || 'asc';

  const { user } = req.body;

  if (!folder_id)
    throw new customHttpError(
      StatusCodes.BAD_REQUEST,
      bookmarkExceptionMessages.FOLDER_REQUIRED,
    );

  let result;

  switch (sortBy) {
    case 'date':
      result = await sortByDate(user.id, folder_id, sortOrder);
      break;
    case 'alphabet':
      result = await sortByAlphabet(user.id, folder_id, sortOrder);
      break;
    default:
      result = await sortByAlphabet(user.id, folder_id, sortOrder);
      break;
  }
  res.status(StatusCodes.OK).json({ success: true, data: result });
};

export const getRecentBookmarks = async (req: Request, res: Response) => {
  const { user } = req.body;

  const result = await findRecentClickedBookmarks(user.id);

  res.status(StatusCodes.OK).json({ success: true, data: result });
};

/**
 * The function `bookmarkClick` updates the click_date of a bookmark based on the provided ID.
 * @param {Request} req - The `req` parameter in the `bookmarkClick` function is of type `Request`,
 * which is typically used to represent the HTTP request in Express.js or other Node.js frameworks. It
 * contains information about the incoming request such as headers, parameters, body, etc. You can
 * access specific data from the
 * @param {Response} res - The `res` parameter in the `bookmarkClick` function is an object
 * representing the HTTP response that the function will send back to the client. It is of type
 * `Response`, which is typically provided by a web framework like Express in Node.js. The `res` object
 * has methods like `status
 */
export const addRecentBookmark = async (req: Request, res: Response) => {
  const bookmarkId = parseInt(req.params.id);

  if (!bookmarkId || isNaN(bookmarkId)) {
    throw new customHttpError(
      StatusCodes.BAD_REQUEST,
      bookmarkExceptionMessages.INVALID_ID,
    );
  }
  const isBookmarkPresent = await findBookmarkById(bookmarkId);
  delete isBookmarkPresent.image_url;

  await updateClickedDate({ ...isBookmarkPresent, click_date: new Date() });

  res
    .status(200)
    .json({ success: true, message: bookmarkSucessMessages.ADDED_RB_SUCESS });
};

/**
 * The function `deleteRecentBookmark` deletes a recent bookmark associated with a user based on the
 * provided bookmark ID.
 * @param {Request} req - Request object containing information about the HTTP request
 * @param {Response} res - The `res` parameter in the function `deleteRecentBookmark` is an object
 * representing the HTTP response that the function will send back to the client. It is of type
 * `Response`, which is typically provided by an Express.js server. This object allows you to send data
 * back to the client, set
 */
export const deleteRecentBookmark = async (req: Request, res: Response) => {
  const { user } = req.body;
  const bookmarkId = parseInt(req.params.id);

  if (!bookmarkId || isNaN(bookmarkId)) {
    throw new customHttpError(
      StatusCodes.BAD_REQUEST,
      bookmarkExceptionMessages.INVALID_ID,
    );
  }

  const currentBookmark = await findBookmarkById(bookmarkId);
  delete currentBookmark.image_url;

  await deleteRecentBookmarkById(currentBookmark, user.id);

  res
    .status(200)
    .json({ success: true, message: bookmarkSucessMessages.DELETE_RB_SUCESS });
};
/**
 * The function `sortRecentBookmark` sorts recent bookmarks based on a specified criteria and order.
 * @param {Request} req - The `req` parameter in the `sortRecentBookmark` function stands for the
 * incoming request object. It contains information about the HTTP request made to the server,
 * including headers, body, query parameters, and more. In this case, it is specifically of type
 * `Request`, which is likely from a
 * @param {Response} res - The `res` parameter in the `sortRecentBookmark` function is an object
 * representing the HTTP response that the function will send back to the client. It is of type
 * `Response`, which is typically provided by an Express.js server. This object allows you to send data
 * back to the client, set
 */

export const sortRecentBookmark = async (req: Request, res: Response) => {
  const { user } = req.body;

  const sortType = req.query.sortBy as string;
  const sortOrder = (req.query.order as string) || 'asc';

  let result;

  switch (sortType) {
    case 'date':
      result = await sortRecentBookmarkByDate(user.id, sortOrder);
      break;
    case 'alphabet':
      result = await sortRecentBookmarkByAlphabet(user.id, sortOrder);
      break;
    default:
      result = await sortRecentBookmarkByDate(user.id, 'desc');
      break;
  }

  res.status(StatusCodes.OK).json({ success: true, data: result });
};

/**
 * The function `filterRecentBookmark` filters recent bookmarks based on a specified sort type and chip
 * ID.
 * @param {Request} req - The `req` parameter in the `filterRecentBookmark` function represents the
 * incoming request to the server. It contains information such as the request headers, body, query
 * parameters, and other details sent by the client making the request. In this specific function, the
 * `req` parameter is of type `
 * @param {Response} res - The `res` parameter in the `filterRecentBookmark` function is an object
 * representing the HTTP response that the function will send back to the client. It is of type
 * `Response`, which is typically provided by an Express.js server. The `res` object has methods like
 * `status()` to set
 */
export const filterRecentBookmark = async (req: Request, res: Response) => {
  const { user } = req.body;

  // const sortType = req.query.filterBy as string;
  const chipId = req.query.chip_id as unknown as number;
  const result = await filterRecentBookmarkByChip(user.id, chipId);

  // switch (sortType) {
  //   case 'chips':
  //     result = await filterRecentBookmarkByChip(user.id, chipId);
  //     break;
  //   default:
  //     result = await findRecentClickedBookmarks(user.id);
  //     break;
  // }

  res.status(StatusCodes.OK).json({ success: true, data: result });
};

/**
 * This TypeScript function searches for recent bookmarks by title and returns the result in a JSON
 * format.
 * @param {Request} req - Request object containing information about the HTTP request
 * @param {Response} res - The `res` parameter in the `searchRecentBookmark` function is an instance of
 * the Express Response object. It is used to send a response back to the client making the request. In
 * this function, it is used to send a JSON response with the search results or an error message along
 * with the
 */
export const searchRecentBookmark = async (req: Request, res: Response) => {
  const { user } = req.body;
  const title: string = String(req.query.title) as string;

  const result = await getRecentBookmarksByTitle(title!, parseInt(user.id));

  res.status(StatusCodes.OK).json({ success: true, data: result });
};
