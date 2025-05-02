/**
 * @format
 * @swagger /auth/login: post: tags: - Authentication summary: Login requestBody: description: Login credentials required: true content: application/json: schema: type: object properties: email: type: string password: type: string required: - email - password responses: 200: description: Successful operation content: application/json: schema: properties: email: type: string password: type: string components: securitySchemes: bearerAuth: type: http scheme: bearer bearerFormat: JWT
 */
