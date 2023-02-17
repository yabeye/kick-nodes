const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const DEST_DIR = './upload/images';
const BASE_IMAGE_URL = 'http://localhost:4100/kick-nodes/product/';

// All files except an image (not accepting a json, or a video!)
// This can be change according to the requirement , but you got the point!
const ALLOWED_FILE_TYPES = [
  'images/jpeg',
  'images/png',
  'images/jpg',
  'images/gif',
];
const ALLOWED_FILE_EXTENSIONS = ['.jpeg', '.png', '.jpg', '.gif'];

// ACTUAL CODE,

const storage = multer.diskStorage({
  destination: DEST_DIR,
  filename: (req, file, callback) => {
    return callback(
      null,
      `${Date.now()}_${file.fieldname}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, callback) => {
    const fileType = file.mimetype;
    const fileExtension = path.extname(file.originalname);

    const isFileTypeAllowed = ALLOWED_FILE_EXTENSIONS.indexOf(fileType) === -1;
    const isFileExtensionAllowed =
      ALLOWED_FILE_TYPES.indexOf(fileExtension) === -1;

    if (!isFileTypeAllowed || !isFileExtensionAllowed) {
      return callback(new Error('Only image is allowed!'));
    }

    return callback(null, true);
  },
  limits: {
    fileSize: 1024 * 1024,
  },
});

router.post('/single', upload.single('product-image'), (req, res, next) => {
  return res.status(201).json({
    code: 201,
    success: true,
    message: 'File uploaded successfully',
    data: {
      productUrl: BASE_IMAGE_URL + req.file.filename,
      // file: req.file, // Full file object.
    },
  });
});

router.post('/multiple', upload, (req, res, next) => {
  return res.status(201).json({
    code: 201,
    success: true,
    message: 'Files uploaded successfully',
    data: {
      productImagesUrls: [],
    },
  });
});

module.exports = router;
