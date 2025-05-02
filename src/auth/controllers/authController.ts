import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import validator from 'validator';
import { findUserByEmail, register } from '../services/authService';
import { uploadImage } from '../../entities/image/image.controller';
import { saveImage } from '../../entities/image/image.service';
import { authExceptionMessages } from '../constant/authExceptionMessages';
import { authSuccessMessages } from '../constant/authSuccessMessages';
import { customHttpError } from '../../utils/customHttpError';
import { StatusCodes } from 'http-status-codes';

export const loginHandler = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new customHttpError(
      StatusCodes.BAD_REQUEST,
      authExceptionMessages.EMAIL_PASS_REQUIRED,
    );
  }

  const user = await findUserByEmail(email);

  const { username, id, email: dBEmail } = user;

  const passordMatched: boolean = await bcrypt.compare(password, user.password);

  if (!passordMatched) {
    throw new customHttpError(
      StatusCodes.UNAUTHORIZED,
      authExceptionMessages.INVALID_CREDENTIALS,
    );
  }

  const token = jwt.sign(
    { username, id, email: dBEmail },
    process.env.JWT_TOKEN as string,
  );

  res.status(StatusCodes.OK).json({
    success: true,
    data: token,
    message: authSuccessMessages.LOGIN_SUCCESS,
  });
};

export const registerHandler = async (req: Request, res: Response) => {
  const { username, email, password, role } = req.body;

  if (!username || !email || !password) {
    throw new customHttpError(
      StatusCodes.BAD_REQUEST,
      authExceptionMessages.USER_CREDENTIALS,
    );
  }

  if (!validator.isEmail(email)) {
    throw new customHttpError(
      StatusCodes.BAD_REQUEST,
      authExceptionMessages.EMAIL_INVALID,
    );
  }

  if (
    !validator.isStrongPassword(password, {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
    })
  ) {
    throw new customHttpError(
      StatusCodes.BAD_REQUEST,
      authExceptionMessages.PASSWORD_INVALID,
    );
  }

  if (!role) {
    req.body.role = 'normal';
  }

  if (req.file) {
    const imagePath = req.file!.path;
    const imageUrl = await uploadImage(imagePath);
    const imageName = req.file.filename;

    const image = await saveImage(
      { url: imageUrl, type: 'user', name: imageName, isdeleted: false },
      username,
    );
    req.body.image_id = image.id;
  } else {
    req.body.image_id = 0;
  }

  const savedUser = await register({
    username,
    email,
    password,
    role: req.body.role,
    isdeleted: false,
    image_id: req.body.image_id,
    created_by: username,
    updated_by: username,
  });

  res.json({
    success: true,
    data: savedUser,
    message: authSuccessMessages.REGISTER_SUCCESS,
  });
};
