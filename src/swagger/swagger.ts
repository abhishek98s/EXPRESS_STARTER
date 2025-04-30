import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { OAS3Definition } from 'swagger-jsdoc';

import * as Bookmark_docs from './bookmark.docs';
import * as auth_docs from './auth.docs';
import * as chip_docs from './chip.docs';
import * as folder_docs from './folder.docs';
import * as recent_bookmark_docs from './recent-bookmark.docs';
import * as user from './user.docs';

export const swaggerConfig: OAS3Definition = {
  openapi: '3.0.0',
  info: {
    title: 'LITMARK_BACKEND_API',
    version: '1.0.0',
    description: 'Documentation for Litmark.',
  },
  servers: [
    {
      url: 'https://litmark-backend-2.vercel.app/api',
      description: 'Local development server',
    },
  ],
  paths: {
    ...auth_docs.docs,
    ...Bookmark_docs.docs,
    ...chip_docs.docs,
    ...folder_docs.docs,
    // ...image_docs.docs,
    ...recent_bookmark_docs.docs,
    ...user.docs,
  },
  components: {
    ...auth_docs.schema,
    schemas: {
      ...Bookmark_docs.schema,
      ...chip_docs.schema,
      ...folder_docs.schema,
      // ...image_docs.schema,
      ...recent_bookmark_docs.schema,
      ...user.schema,
    },
  },
};

const CSS_URL =
  'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.3.0/swagger-ui.min.css';

export const swagger = function (app: express.Application) {
  app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerConfig, {
      customCss:
        '.swagger-ui .opblock .opblock-summary-path-description-wrapper { align-items: center; display: flex; flex-wrap: wrap; gap: 0 10px; padding: 0 10px; width: 100%; }',
      customCssUrl: CSS_URL,
    }),
  );
};
