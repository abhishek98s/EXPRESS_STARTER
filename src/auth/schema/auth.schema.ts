import joi from 'joi';
import { authExceptionMessages } from '../constant/authExceptionMessages';

const authSchema = {
  login: joi
    .object()
    .keys({
      email: joi.string().email().required().messages({
        'string.base': authExceptionMessages.EMAIL_STRING,
        'string.email': authExceptionMessages.EMAIL_INVALID,
        'string.empty': authExceptionMessages.EMAIL_EMPTY,
        'any.required': authExceptionMessages.EMAIL_REQUIRED,
      }),
      password: joi.string().required().messages({
        'string.base': authExceptionMessages.PASSWORD_STRING,
        'string.empty': authExceptionMessages.PASSWORD_EMPTY,
        'any.required': authExceptionMessages.PASSWORD_REQUIRED,
      }),
    })
    .strict()
    .messages({
      'object.unknown': authExceptionMessages.EXTRA_PROPERTY, // Custom error message for extra properties
    }),

  register: joi.object().keys({
    username: joi.string().required().messages({
      'string.base': authExceptionMessages.USERNAME_STRING,
      'any.required': authExceptionMessages.USERNAME_REQUIRED,
      'string.empty': authExceptionMessages.USERNAME_EMPTY,
    }),
    password: joi
      .string()
      .min(8)
      .pattern(new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/))
      .required()
      .messages({
        'string.base': authExceptionMessages.PASSWORD_STRING,
        'string.min': authExceptionMessages.PASSWORD_SHORT,
        'string.empty': authExceptionMessages.PASSWORD_EMPTY,
        'string.pattern.base': authExceptionMessages.PASSWORD_INVALID,
        'any.required': authExceptionMessages.PASSWORD_REQUIRED,
      }),
    email: joi.string().email().required().messages({
      'string.base': authExceptionMessages.EMAIL_STRING,
      'string.email': authExceptionMessages.EMAIL_INVALID,
      'string.empty': authExceptionMessages.EMAIL_EMPTY,
      'any.required': authExceptionMessages.EMAIL_REQUIRED,
    }),
  }),
};

export default authSchema;
