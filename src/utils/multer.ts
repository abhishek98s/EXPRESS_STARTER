import multer from 'multer';
import path from 'path';
import { customHttpError } from './customHttpError';
import { StatusCodes } from 'http-status-codes';
import { utilsExceptionMessages } from './constants/utilsExceptionMessages';

const allowedExtensions = /\.(jpg|jpeg|png)$/i;

export const upload = multer({
  storage: multer.diskStorage({
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const fileName = `${file.fieldname}-${Date.now()}${ext}`;
      cb(null, fileName);
    },
  }),
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname);

    if (!allowedExtensions.test(ext.toLowerCase())) {
      cb(
        new customHttpError(
          StatusCodes.UNSUPPORTED_MEDIA_TYPE,
          utilsExceptionMessages.UNSUPPORTED_FILE_FORMAT,
        ),
      );
    }
    if (!file.mimetype.startsWith('image/')) {
      return cb(
        new customHttpError(
          StatusCodes.UNSUPPORTED_MEDIA_TYPE,
          utilsExceptionMessages.UNSUPPORTED_FILE_FORMAT,
        ),
      );
    }

    cb(null, true);
  },
});

export const isFIleGreaterThan = (fileSize: number, maxSize: number) => {
  if (fileSize > maxSize * 1024 * 1024) {
    throw new customHttpError(
      StatusCodes.BAD_REQUEST,
      utilsExceptionMessages.FILE_TOO_LARGE,
    );
  }
};
