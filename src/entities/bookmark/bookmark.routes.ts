import express from 'express';
import multer from 'multer';
import * as bookmarkController from './bookmark.controller';
import { verifyToken } from '../../middleware/authentication.middleware';
import joiValidationMiddleware, {
  joiQueryValidationMiddleware,
} from '../../middleware/joiValidationMiddleware';

import * as schema from './bookmark.schema';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.use(verifyToken);

router
  .get('/recent', bookmarkController.getRecentBookmarks)
  .delete('/recent/:id', bookmarkController.deleteRecentBookmark)
  .patch('/recent/:id', bookmarkController.addRecentBookmark)
  .get(
    '/recent/sort',
    joiQueryValidationMiddleware(schema.recentBookmarkSortQuerySchema),
    bookmarkController.sortRecentBookmark,
  )
  .get(
    '/recent/filter',
    joiQueryValidationMiddleware(schema.recentBookmarkFilterQuerySchema),
    bookmarkController.filterRecentBookmark,
  )
  .get(
    '/recent/search',
    joiQueryValidationMiddleware(schema.searchRecentBookmarkQuerySchema),
    bookmarkController.searchRecentBookmark,
  );

router.get(
  '/search',
  joiQueryValidationMiddleware(schema.searchBookmarkByTitleQuerySchema),
  bookmarkController.searchByTitle,
);
router.get('/sort', bookmarkController.getSortedData);

router
  .get('/', bookmarkController.getBookmarks)
  .get('/:folder_id', bookmarkController.getBookmarksByFolderId)
  .post(
    '/',
    joiValidationMiddleware(schema.bookmarkSchema),
    verifyToken,
    bookmarkController.postBookmark,
  );

router
  .patch(
    '/:id',
    upload.single('litmark_image'),
    verifyToken,
    bookmarkController.patchBookmark,
  )
  .delete('/:id', bookmarkController.deleteBookmark);

export default router;
