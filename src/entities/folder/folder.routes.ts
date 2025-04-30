import express from 'express';
import {
  deleteFolders,
  getAllTopFolders,
  getAllnestedFolders,
  patchFolders,
  postFolders,
  getSortedFolders,
} from './folder.controller';
import { verifyToken } from '../../middleware/authentication.middleware';
import multer from 'multer';
import joiValidationMiddleware, {
  joiQueryValidationMiddleware,
} from '../../middleware/joiValidationMiddleware';
import folderSchema, {
  folderPatchSchema,
  folderQuerySchema,
} from './folder.schema';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.use(verifyToken);
router.get(
  '/sort',
  joiQueryValidationMiddleware(folderQuerySchema),
  getSortedFolders,
);
router
  .get('/', getAllTopFolders)
  .get('/:id', getAllnestedFolders)
  .post('/', joiValidationMiddleware(folderSchema), verifyToken, postFolders);
router
  .patch(
    '/:id',
    upload.single('litmark_image'),
    joiValidationMiddleware(folderPatchSchema),
    verifyToken,
    patchFolders,
  )
  .delete('/:id', deleteFolders);

export default router;
