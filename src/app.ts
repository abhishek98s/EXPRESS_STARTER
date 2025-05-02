import express from 'express';
import cors from 'cors';
import 'express-async-errors';
import bodyParser from 'body-parser';
import pathToSwaggerUi from 'swagger-ui-dist';

import { swagger } from './swagger/swagger';

import imageRoutes from './entities/image/image.routes';
import userRoutes from './entities/user/user.routes';
import authRoutes from './auth/routes/auth.routes';
import notFoundHandler from './middleware/notFoundMiddleware';
import customErrorHandler from './middleware/customErrorHandler';

const app = express();

app.use(
  cors({
    origin: '*',
    methods: ['*'],
    allowedHeaders: ['*'],
  }),
);

app.use(express.static(pathToSwaggerUi.absolutePath()));

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

swagger(app);

app.get('/', (request, response) => {
  response.send('Hello world');
});

app.use('/api/auth', authRoutes);
app.use('/api/image', imageRoutes);
app.use('/api/user', userRoutes);

app.use(customErrorHandler);
app.use(notFoundHandler);

export default app;
