import multer from 'multer';
import path from 'path';

const uploadDir = path.join(process.cwd(), 'uploads');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname); // get the original extension
    cb(null, file.fieldname + '-' + uniqueSuffix + ext); // include extension
  }
});

export const upload = multer({ storage });
