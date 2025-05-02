export const responseSchema = {
  CREATED: {
    description: 'Created new data',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: 'true' },
            message: { type: 'string' },
          },
        },
      },
    },
  },
  BAD_REQUEST: {
    description: 'Bad request due to invalid input',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: 'false' },
            message: { type: 'string' },
          },
        },
      },
    },
  },
  UNAUTHORIZED: {
    description: 'Unauthorized access due to invalid credentials',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: 'false' },
            message: { type: 'string' },
          },
        },
      },
    },
  },
  FORBIDDEN: {
    description: 'Data already Exits',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: 'false' },
            message: { type: 'string' },
          },
        },
      },
    },
  },
  NOT_FOUND: {
    description: 'Resource not found',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: 'false' },
            message: { type: 'string' },
          },
        },
      },
    },
  },
  CONFLICT: {
    description: 'Duplicate Entry',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: 'false' },
            message: { type: 'string' },
          },
        },
      },
    },
  },
  UNPROCESSABLE_ENTITY: {
    description: 'Duplicate Entry',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: 'false' },
            message: { type: 'string' },
          },
        },
      },
    },
  },
  PAYLOAD_TOO_LARGE: {
    description: 'Request entity is larger than limits defined by server',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: 'false' },
            message: { type: 'string' },
          },
        },
      },
    },
  },
  INTERNAL_SERVER_ERROR: {
    description: 'Internal Server Error',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: 'false' },
            message: { type: 'string' },
          },
        },
      },
    },
  },
};
