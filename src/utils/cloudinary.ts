import cloudinary from 'cloudinary';
import sharp from 'sharp';
import fs from 'fs';
import { config } from '../config/config';

cloudinary.v2.config({
  cloud_name: config.storage.CLOUDINARY_CLOUD_NAME,
  api_key: config.storage.CLOUDINARY_API_KEY,
  api_secret: config.storage.CLOUDINARY_API_SECRET,
});

export default cloudinary;

export const uploadToCloudinary = async (image_path: string) => {
  const compressedImagePath = image_path + '.compressed.jpg';
  await sharp(image_path).jpeg({ quality: 80 }).toFile(compressedImagePath);

  const uploaded = await cloudinary.v2.uploader.upload(compressedImagePath, {
    folder: 'Test',
  });

  fs.unlinkSync(compressedImagePath);

  return uploaded.secure_url;
};
