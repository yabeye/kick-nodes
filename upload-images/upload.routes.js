const router = require('express').Router();
const multer = require('multer');
const path = require('path');

const MIN_IMAGE_DIM = 300;
const IMAGE_QUALITY = 40; // HALF

const sharp = require('sharp');

const DEST_DIR = './public/images';
const BASE_IMAGE_URL = 'http://localhost:4100/kick-nodes/product/';
const FACTOR = 1 / 6;

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
    return callback(null, `${Date.now()}-${file.originalname}`);
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

const handleImageCompression = async (req, res, next) => {
  const { file } = req;
  const filePath = path.join(__dirname, '/', file.path);

  const extName = path.extname(filePath);
  const filenameOnly = file.filename.substring(
    0,
    file.filename.length - extName.length
  );

  let compressedImageUrl = filenameOnly + '-300x300' + extName;
  const compressedImageFilePath = path.join(
    __dirname,
    '/',
    file.destination,
    compressedImageUrl
  );
  compressedImageUrl = BASE_IMAGE_URL + compressedImageUrl;

  try {
    await sharp('./' + file.path)
      .resize(MIN_IMAGE_DIM)
      .jpeg({
        quality: IMAGE_QUALITY,
        chromaSubsampling: '4:4:4',
      })
      .toFile(compressedImageFilePath);

    req.compressedImageUrl = compressedImageUrl;
    next();
  } catch (error) {
    console.error(error.message);
    next(error);
  }
};

router.post(
  '/single',
  upload.single('product-image'),
  handleImageCompression,
  (req, res, next) => {
    return res.status(201).json({
      code: 201,
      success: true,
      message: 'File uploaded successfully',
      data: {
        productUrl: BASE_IMAGE_URL + req.file.filename,
        compressedImageUrl: req.compressedImageUrl,
        // file: req.file, // Full file object.
      },
    });
  }
);

router.post(
  '/multiple',
  upload.fields([
    { name: 'product-image', maxCount: 1 },
    { name: 'product-image-alt', maxCount: 1 },
  ]),
  handleImageCompression,
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
