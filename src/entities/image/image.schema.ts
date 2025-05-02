import joi, { Schema } from 'joi';

const imageSchema: Schema = joi.object().keys({
  name: joi.string(),
  url: joi.string(),
  type: joi
    .string()
    .valid('bookmark', 'user', 'folder')
    .insensitive()
    .required(),
  user: joi.object().keys({
    id: joi.number().required(),
    username: joi.string().required(),
    email: joi.string().required(),
    iat: joi.number(),
  }),
});

export default imageSchema;
