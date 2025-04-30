import joi, { Schema } from 'joi';
import { folderExceptionMessages } from './constant/folderExceptionMessages';

const folderSchema: Schema = joi
  .object()
  .keys({
    name: joi.string().required().messages({
      'string.base': folderExceptionMessages.NAME_STRING,
      'any.required': folderExceptionMessages.NAME_REQUIRED,
      'string.empty': folderExceptionMessages.NAME_REQUIRED,
    }),
    folder_id: joi.number().allow(null).required().messages({
      'number.base': folderExceptionMessages.FOLDER_ID_NUMBER,
      'any.required': folderExceptionMessages.FOLDER_ID_REQUIRED,
      'number.empty': folderExceptionMessages.NAME_REQUIRED,
    }),
    user: joi.object().keys({
      id: joi.number().required(),
      username: joi.string().required(),
      email: joi.string().required(),
      iat: joi.number(),
    }),
  })
  .messages({
    'object.unknown': folderExceptionMessages.EXTRA_PROPERTY,
  });

const folderQuerySchema = joi
  .object()
  .keys({
    sort: joi.string().valid('date', 'alphabet').required().messages({
      'string.base': folderExceptionMessages.SORT_STRING,
      'any.required': folderExceptionMessages.SORT_REQUIRED,
      'string.empty': folderExceptionMessages.SORT_REQUIRED,
      'any.only': folderExceptionMessages.SORT_INVALID,
    }),
    order: joi.string().valid('asc', 'desc').required().messages({
      'string.base': folderExceptionMessages.ORDER_STRING,
      'any.required': folderExceptionMessages.ORDER_REQUIRED,
      'string.empty': folderExceptionMessages.SORT_REQUIRED,
      'any.only': folderExceptionMessages.ORDER_INVALID,
    }),
    folder_id: joi.number().required().messages({
      'number.base': folderExceptionMessages.FOLDER_ID_NUMBER,
      'any.required': folderExceptionMessages.FOLDER_ID_REQUIRED,
      'number.empty': folderExceptionMessages.FOLDER_ID_REQUIRED,
    }),
  })
  .messages({
    'object.unknown': folderExceptionMessages.EXTRA_PROPERTY,
  });

const folderPatchSchema: Schema = joi
  .object()
  .keys({
    name: joi.string().required().messages({
      'string.base': folderExceptionMessages.NAME_STRING,
      'any.required': folderExceptionMessages.NAME_REQUIRED,
      'string.empty': folderExceptionMessages.NAME_REQUIRED,
    }),
    user: joi.object().keys({
      id: joi.number().required(),
      username: joi.string().required(),
      email: joi.string().required(),
      iat: joi.number(),
    }),
  })
  .messages({
    'object.unknown': folderExceptionMessages.EXTRA_PROPERTY,
  });

export default folderSchema;
export { folderQuerySchema, folderPatchSchema };
