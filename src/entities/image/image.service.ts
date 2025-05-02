import { imageExceptionMessages } from './constant/imageExceptionMessages';
import * as ImageDAO from './image.repository';
import { ImageModel } from './image.model';
import { customHttpError } from '../../utils/customHttpError';
import { StatusCodes } from 'http-status-codes';

/**
 * The function `findImage` retrieves an image from a database based on its ID and returns it.
 * @param {number} imageId - The `imageId` parameter is the unique identifier of the image that you
 * want to find. It is of type `number`.
 * @returns a Promise that resolves to an ImageModel object.
 */
export const findImage = async (imageId: number): Promise<ImageModel> => {
  const image: ImageModel = await ImageDAO.fetchById(imageId);

  if (!image)
    throw new customHttpError(
      StatusCodes.NOT_FOUND,
      imageExceptionMessages.IMAGE_NOT_FOUND,
    );

  return image;
};

/**
 * The `saveImage` function saves an image with the provided image data and the username of the
 * creator.
 * @param {ImageModel} imageData - The `imageData` parameter is an object of type `ImageModel` that
 * contains the data of the image to be saved. It likely includes properties such as the image URL,
 * file name, file size, and any other relevant information about the image.
 * @param {string} username - The `username` parameter is a string that represents the username of the
 * user who is saving the image.
 * @returns a promise that resolves to the result of inserting the new image into the "images" table in
 * the database.
 */
export const saveImage = async (imageData: ImageModel, username: string) => {
  const newImage: ImageModel = {
    ...imageData,
    created_by: username,
    updated_by: username,
  };
  const image = await ImageDAO.create(newImage);
  const { image_id } = image;
  return await ImageDAO.fetchById(image_id);
};

/**
 * The function updates an image in the database with new data and returns the updated image.
 * @param {ImageModel} newImageData - The `newImageData` parameter is an object of type `ImageModel`
 * that contains the updated data for the image. It could include properties such as `url` (the new URL
 * of the image) and `type` (the new type of the image).
 * @param {number} imageId - The `imageId` parameter is the unique identifier of the image that needs
 * to be updated. It is used to locate the specific image in the database.
 * @param {string} username - The `username` parameter is a string that represents the username of the
 * user who is updating the image.
 * @returns a Promise that resolves to an ImageModel object.
 */
export const updateImage = async (
  imageData: ImageModel,
  imageId: number,
): Promise<ImageModel> => {
  const image = await ImageDAO.update(imageData, imageId);

  if (!image)
    throw new customHttpError(
      StatusCodes.CONFLICT,
      imageExceptionMessages.UPLOAD_FAILED,
    );

  return await ImageDAO.fetchById(imageId);
};

/**
 * The function removes an image from the database based on its ID.
 * @param {number} imageId - The `imageId` parameter is the unique identifier of the image that needs
 * to be removed.
 * @returns a Promise that resolves to an instance of the ImageModel.
 */
export const removeImage = async (imageId: number): Promise<ImageModel> => {
  const image = await ImageDAO.fetchById(imageId);
  if (!image)
    throw new customHttpError(
      StatusCodes.NOT_FOUND,
      imageExceptionMessages.IMAGE_NOT_FOUND,
    );

  const removeImage = await ImageDAO.remove(imageId);
  if (!removeImage)
    throw new customHttpError(
      StatusCodes.CONFLICT,
      imageExceptionMessages.DELETE_FAILED,
    );

  return image;
};
