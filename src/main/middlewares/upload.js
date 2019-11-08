import Cloudinary from 'cloudinary';
import cloudinaryStorage from 'multer-storage-cloudinary';
import multer from 'multer';

const storage = cloudinaryStorage({
  cloudinary: Cloudinary,
  folder: 'teamwork-devc-capstone',
});

export default multer({ storage });
