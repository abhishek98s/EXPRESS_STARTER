import cloudinary from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config();

cloudinary.v2.config({
  cloud_name: process.env.CLOUDNARY_NAME,
  api_key: process.env.CLOUDNARY_KEY,
  api_secret: process.env.CLOUDNARY_SECRET,
});

export default cloudinary;
