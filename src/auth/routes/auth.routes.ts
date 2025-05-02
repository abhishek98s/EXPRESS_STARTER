import express from 'express';
import multer from 'multer';

import authSchema from '../schema/auth.schema';
import { loginHandler, registerHandler } from '../controllers/authController';
import joiValidationMiddleware from '../../middleware/joiValidationMiddleware';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post(
  '/register',
  upload.single('litmark_image'),
  joiValidationMiddleware(authSchema.register),
  registerHandler,
);
router.post('/login', joiValidationMiddleware(authSchema.login), loginHandler);

export default router;
