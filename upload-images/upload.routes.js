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

const storage = multer.diskStorage({
  destination: DEST_DIR,
  filename: (req, file, callback) => {
    console.log('File ', file);
    return callback(null, `${Date.now()}_${file.originalname}`);
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

router.post(
  '/multiple',
  upload.fields([
    { name: 'product-image', maxCount: 1 },
    { name: 'product-image-alt', maxCount: 1 },
  ]),
  (req, res, next) => {
    const { files } = req;
    var rawImageFilesArray = Object.keys(files).map((key) => [key, files[key]]);

    const productImageUrls = [];
    rawImageFilesArray.forEach((r) =>
      productImageUrls.push(`${BASE_IMAGE_URL}${r[1][0].filename}`)
    );

    return res.status(201).json({
      code: 201,
      success: true,
      message: 'Files are uploaded successfully',
      data: {
        productImageUrls: productImageUrls,
      },
    });
  }
);

module.exports = router;
