import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import {
  findImage,
  removeImage,
  saveImage,
  updateImage,
} from './image.service';
import { ImageModel } from './image.model';
import { imageExceptionMessages } from './constant/imageExceptionMessages';
import cloudinary from '../../utils/imageUploader';
import { customHttpError } from '../../utils/customHttpError';

/**
 * The function checks if the type of an image is valid by matching it against a regular
 * expression.
 * @param {ImageModel}  - The above code is a TypeScript function named `isValidType` that takes an
 * object of type `ImageModel` as a parameter. The `ImageModel` is expected to have a property named
 * `type`.
 * @returns a boolean value of true.
 */
export const isValidType = ({ type }: ImageModel) => {
  const reg: RegExp = new RegExp(/\b(?:folder|user|bookmark)\b/i);
  const isNameValid = reg.test(type);
  if (!isNameValid)
    throw new customHttpError(
      StatusCodes.BAD_REQUEST,
      imageExceptionMessages.INVALID_TYPE
    );
  return true;
};

/**
 * The function `uploadImage` uploads an image to Cloudinary and returns the secure URL of the uploaded
 * image.
 * @param {string} imgPath - The `imgPath` parameter is a string that represents the path to the image
 * file that you want to upload.
 * @returns The function `uploadImage` returns the `imgUrl` which is the secure URL of the uploaded
 * image.
 */
export const uploadImage = async (imgPath: string) => {
  const imgUrl = (
    await cloudinary.v2.uploader.upload(imgPath, { folder: 'litmark' })
  ).secure_url;

  if (!imgUrl)
    throw new customHttpError(
      StatusCodes.CONFLICT,
      imageExceptionMessages.UPLOAD_FAILED
    );

  return imgUrl;
};

/**
 * The function `validateImageType` checks if a given file name has a valid image type (png, jpg, jpeg,
 * or gif) and throws an error if it doesn't.
 * @param {string} fileName - The `fileName` parameter is a string that represents the name of the
 * image file.
 * @returns nothing (void).
 */
export const validateImageType = (fileName: string) => {
  const imageType = fileName.split('.').pop() as string;

  const reg: RegExp = new RegExp(/\b(?:png|jpg|jpeg|gif)\b/i);
  const isValidType = reg.test(imageType);

  if (!isValidType)
    throw new customHttpError(
      StatusCodes.BAD_REQUEST,
      imageExceptionMessages.INVALID_IMAGE_TYPE
    );
  return;
};

/**
 * The function `getImage` is an asynchronous function that handles a request to retrieve an image by
 * its ID and returns the image data if found, or an error message if not found or if there is an
 * internal server error.
 * @param {Request} req - The `req` parameter is an object that represents the HTTP request made to the
 * server. It contains information such as the request method, headers, query parameters, and body.
 * @param {Response} res - The `res` parameter is the response object that is used to send the HTTP
 * response back to the client. It contains methods and properties that allow you to set the response
 * status code, headers, and body. In this code snippet, it is used to send a JSON response with the
 * image data or
 * @returns a response with the status code 200 (OK) and a JSON object containing the data of the
 * image.
 */
export const getImage = async (req: Request, res: Response) => {
  const imageId: number = parseInt(req.params.id);
  if (!imageId)
    throw new customHttpError(
      StatusCodes.BAD_REQUEST,
      imageExceptionMessages.INVALID_ID
    );

  const result = await findImage(imageId);

  return res.status(StatusCodes.OK).json({ success: true, data: result });
};

/**
 * The `postImage` function handles the uploading and saving of an image file, including validation and
 * error handling.
 * @param {Request} req - The `req` parameter is an object that represents the HTTP request made to the
 * server. It contains information such as the request headers, request body, request method, and
 * request URL.
 * @param {Response} res - The `res` parameter is the response object that is used to send the response
 * back to the client. It contains methods and properties that allow you to control the response, such
 * as setting the status code, headers, and sending the response body.
 * @returns a JSON response with the data property set to the result of the saveImage function.
 */
export const postImage = async (req: Request, res: Response) => {
  if (!req.file) {
    throw new customHttpError(
      StatusCodes.BAD_REQUEST,
      imageExceptionMessages.FILE_REQUIRED
    );
  }
  const imgPath = req.file!.path;

  req.body.url = await uploadImage(imgPath);
  req.body.name = req.file?.filename;

  const { url, type, name, user } = req.body;

  if (!type)
    throw new customHttpError(
      StatusCodes.BAD_REQUEST,
      imageExceptionMessages.TYPE_REQUIRED
    );

  isValidType(req.body);
  validateImageType(req.file!.originalname);

  const result = await saveImage(
    { type, url, name, isdeleted: false },
    user.username
  );

  res.status(StatusCodes.OK).json({ success: true, data: result });
};

/**
 * The function `patchImage` is an asynchronous function that handles the patch request for updating an
 * image with the specified ID, including uploading a new image file if provided.
 * @param {Request} req - The `req` parameter is an object that represents the HTTP request made to the
 * server. It contains information such as the request headers, request body, request method, request
 * URL, and other relevant details.
 * @param {Response} res - The `res` parameter is the response object that is used to send the HTTP
 * response back to the client. It is an instance of the `Response` class from the Express framework.
 * @returns a JSON response with the updated image data if successful, or an error message and status
 * code if there is an error.
 */
export const patchImage = async (req: Request, res: Response) => {
  const imageId: number = parseInt(req.params.id);

  const { name, user } = req.body;

  if (!name)
    throw new customHttpError(
      StatusCodes.BAD_REQUEST,
      imageExceptionMessages.NAME_REQUIRED
    );

  const currentImage = await findImage(imageId);

  if (req.file) {
    const imgPath = req.file!.path;
    req.body.url = await uploadImage(imgPath);
  }

  // const result: ImageModel = await updateImage({ url, type, name }, imageId, user.id)
  const result: ImageModel = await updateImage(
    {
      ...currentImage,
      name,
      updated_by: user.username,
      url: req.file ? req.body.url : currentImage.url,
    },
    imageId
  );

  res.status(StatusCodes.OK).json({ success: true, data: result });
};

/**
 * The function `deleteImage` is an asynchronous function that handles the deletion of an image based
 * on the provided image ID.
 * @param {Request} req - The `req` parameter is an object that represents the HTTP request made to the
 * server. It contains information such as the request method, headers, query parameters, and request
 * body.
 * @param {Response} res - The `res` parameter is the response object that is used to send the response
 * back to the client. It contains methods and properties that allow you to set the status code,
 * headers, and send the response body.
 * @returns a JSON response with the data property set to the result of the removeImage function.
 */
export const deleteImage = async (req: Request, res: Response) => {
  const imageId: number = parseInt(req.params.id);
  if (!imageId)
    throw new customHttpError(
      StatusCodes.BAD_REQUEST,
      imageExceptionMessages.INVALID_ID
    );

  const result = await removeImage(imageId);

  res.status(StatusCodes.OK).json({ success: true, data: result });
};
