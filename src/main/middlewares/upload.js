import Cloudinary from 'cloudinary';
import cloudinaryStorage from 'multer-storage-cloudinary';
import multer from 'multer';

const storage = cloudinaryStorage({
  cloudinary: Cloudinary,
  folder: 'teamwork-devc-capstone',
  // filename(req, file, cb) {
  //   const ext = file.originalname && file.originalname.substring(file.originalname.lastIndexOf('.') + 1);
  //   cb(undefined, `${Date.now()}-${file.originalname}.${ext}`);
  // },
});

export default multer({ storage });
