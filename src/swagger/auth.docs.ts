/** @format */

import { responseSchema } from './response';

export const docs = {
  '/auth/login': {
    post: {
      tags: ['Authentication'],
      summary: 'Login',
      requestBody: {
        description: 'Login credentials',
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                email: {
                  type: 'string',
                },
                password: {
                  type: 'string',
                },
              },
              required: ['email', 'password'],
            },
          },
        },
      },
      responses: {
        '200': {
          description: 'Successful operation',
          content: {
            'application/json': {
              schema: {
                properties: {
                  data: {
                    type: 'string',
                  },
                },
              },
            },
          },
        },
        '400': { ...responseSchema.BAD_REQUEST },
        '404': { ...responseSchema.NOT_FOUND },
        '409': { ...responseSchema.CONFLICT },
        '422': { ...responseSchema.UNPROCESSABLE_ENTITY },
        '500': { ...responseSchema.INTERNAL_SERVER_ERROR },
      },
    },
  },
  '/auth/register': {
    post: {
      tags: ['Authentication'],
      summary: 'Register',
      requestBody: {
        description: 'Register credentials',
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                username: {
                  type: 'string',
                },
                email: {
                  type: 'string',
                },
                password: {
                  type: 'string',
                },
              },
              required: ['username', 'email', 'password'],
            },
          },
        },
      },
      responses: {
        '200': {
          description: 'Successful operation',
          content: {
            'application/json': {
              schema: {
                properties: {
                  data: {
                    type: 'string',
                  },
                },
              },
            },
          },
        },
        '400': { ...responseSchema.BAD_REQUEST },
        '409': { ...responseSchema.CONFLICT },
        '422': { ...responseSchema.UNPROCESSABLE_ENTITY },
        '500': { ...responseSchema.INTERNAL_SERVER_ERROR },
      },
    },
  },
};

export const schema = {
  securitySchemes: {
    bearerAuth: {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    },
  },
};
