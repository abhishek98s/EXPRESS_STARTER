import { Request, Response } from 'express';
import validator from 'validator';

import { addUser, getUserById, removeUser, updateUser } from './user.service';
import { saveImage } from '../image/image.service';
import { uploadImage, validateImageType } from '../image/image.controller';
import { userExceptionMessages } from './constant/userExceptionMessages';
import { userSucessMessages } from './constant/userSucessMessages';
import { customHttpError } from '../../utils/customHttpError';
import { StatusCodes } from 'http-status-codes';

/**
 * The function `getUser` is an asynchronous function that retrieves a user by their ID and returns the
 * result as JSON.
 * @param {Request} req - The `req` parameter is an object that represents the HTTP request made by the
 * client. It contains information such as the request method, headers, query parameters, and request
 * body.
 * @param {Response} res - The `res` parameter is the response object that is used to send the response
 * back to the client. It contains methods and properties that allow you to control the response, such
 * as setting the status code, headers, and sending the response body.
 * @returns a JSON response with the data property set to the result of the getUserById function.
 */
export const getUser = async (req: Request, res: Response) => {
  const userId = parseInt(req.params.id);
  if (!userId)
    throw new customHttpError(
      StatusCodes.BAD_REQUEST,
      userExceptionMessages.INVALID_ID,
    );

  const result = await getUserById(userId);

  return res.json({ success: true, data: result });
};

/**
 * The function `postUser` is an asynchronous function that handles the creation of a new user,
 * including validation of input data and saving an image if provided.
 * @param {Request} req - The `req` parameter is an object representing the HTTP request made to the
 * server. It contains information such as the request headers, request body, request method, and
 * request URL.
 * @param {Response} res - The `res` parameter is the response object that is used to send the response
 * back to the client. It contains methods and properties that allow you to control the response, such
 * as setting the status code, headers, and sending the response body.
 * @returns a JSON response with the data property set to the result variable.
 */
export const postUser = async (req: Request, res: Response) => {
  const { username, email, password, role, user } = req.body;

  if (!username || !email || !password) {
    throw new customHttpError(
      StatusCodes.BAD_REQUEST,
      userExceptionMessages.USER_CREDENTIALS_REQUIRED,
    );
  }

  if (
    !(
      validator.isEmail(email!) &&
      validator.isStrongPassword(password, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
      })
    )
  ) {
    throw new customHttpError(
      StatusCodes.BAD_REQUEST,
      userExceptionMessages.INVALID_EMAIL_PASS,
    );
  }

  if (req.file) {
    const imagePath = req.file!.path;
    validateImageType(req.file.originalname);
    const imageUrl = await uploadImage(imagePath);
    const imageName = req.file.filename;

    const image = await saveImage(
      { url: imageUrl, type: 'user', name: imageName, isdeleted: false },
      username,
    );
    req.body.image_id = image.id;
  } else {
    req.body.image_id = 0;
  }

  await addUser({
    username,
    email,
    password,
    image_id: req.body.image_id,
    isdeleted: false,
    role: role === 'admin' ? role : 'normal',
    created_by: user.username,
    updated_by: user.username,
  });

  return res.json({ success: true, message: userSucessMessages.POST_SUCESS });
};

/**
 * The function `patchUser` is an asynchronous function that updates a user's information, including
 * their username, password, and profile image, and returns the updated user data.
 * @param {Request} req - The `req` parameter is an object that represents the HTTP request made to the
 * server. It contains information such as the request headers, request body, request parameters, etc.
 * @param {Response} res - The `res` parameter is the response object that is used to send the response
 * back to the client. It contains methods and properties that allow you to control the response, such
 * as setting the status code, headers, and sending the response body.
 * @returns a JSON response with the updated user data.
 */
export const patchUser = async (req: Request, res: Response) => {
  const userId = parseInt(req.params.id);

  if (!userId)
    throw new customHttpError(
      StatusCodes.BAD_REQUEST,
      userExceptionMessages.INVALID_ID,
    );

  const { username, password, user } = req.body;

  if (!username || !password) {
    throw new customHttpError(
      StatusCodes.BAD_REQUEST,
      userExceptionMessages.USERNAME_PASS_REQUIRED,
    );
  }

  const currentUser = await getUserById(userId);

  if (!currentUser) {
    throw new customHttpError(
      StatusCodes.NOT_FOUND,
      userExceptionMessages.USER_NOT_FOUND,
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
      username,
    );

    req.body.image_id = image.id;
  }

  const result = await updateUser(userId, {
    ...currentUser,
    username,
    password,
    image_id: req.file ? req.body.image_id : currentUser.image_id,
    updated_by: user.username,
  });

  return res.json({
    success: true,
    data: result,
    message: userSucessMessages.PATCH_SUCCESS,
  });
};

/**
 * The deleteUser function is an asynchronous function that removes a user from the system based on the
 * provided user id.
 * @param {Request} req - The `req` parameter is an object that represents the HTTP request made to the
 * server. It contains information such as the request method, request headers, request body, request
 * parameters, etc.
 * @param {Response} res - The `res` parameter is the response object that is used to send the response
 * back to the client. It contains methods and properties that allow you to control the response, such
 * as setting the status code, headers, and sending the response body.
 * @returns a JSON response with the data property set to the result of the removeUser function.
 */
export const deleteUser = async (req: Request, res: Response) => {
  const userId = parseInt(req.params.id);

  if (!userId)
    throw new customHttpError(
      StatusCodes.BAD_REQUEST,
      userExceptionMessages.INVALID_ID,
    );

  const result = await removeUser(userId);

  return res.json({
    success: true,
    data: result,
    message: userSucessMessages.DELETE_SUCCESS,
  });
};
