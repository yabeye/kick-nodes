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

// Compression !
const compressSingleImage = async (file) => {
  const filePath = path.join(__dirname, '/', file.path);
  const extName = path.extname(filePath);
  const filenameOnly = file.filename.substring(
    0,
    file.filename.length - extName.length
  );

  let compressedImageUrl =
    filenameOnly + `-${MIN_IMAGE_DIM}xOriginal` + extName;
  const compressedImageFilePath = path.join(
    __dirname,
    '/',
    file.destination,
    compressedImageUrl
  );
  compressedImageUrl = BASE_IMAGE_URL + compressedImageUrl;

  await sharp('./' + file.path)
    .resize(MIN_IMAGE_DIM)
    .jpeg({
      quality: IMAGE_QUALITY,
      chromaSubsampling: '4:4:4',
    })
    .toFile(compressedImageFilePath);
  return compressedImageUrl;
};

const mapToMultiFile = async (files) => {
  const someArray = [];
  await Promise.all(
    Object.values(files).map(async (fileArray) => {
      const file = fileArray[0];
      const newFilename = `${MIN_IMAGE_DIM}xOriginal-` + file.filename;

      await sharp(file.path)
        .resize(MIN_IMAGE_DIM)
        .toFormat('jpeg')
        .jpeg({ quality: IMAGE_QUALITY })
        .toFile(`public/images/${newFilename}`);

      someArray.push(BASE_IMAGE_URL + newFilename);
    })
  );
  return someArray;
};

const generateImageUrlFromFiles = (files) => {
  const originalProductImageUrls = [];
  var rawImageFilesArray = Object.keys(files).map((key) => [key, files[key]]);

  rawImageFilesArray.forEach((r) =>
    originalProductImageUrls.push(`${BASE_IMAGE_URL}${r[1][0].filename}`)
  );
  return originalProductImageUrls;
};

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
    fileSize: 1 * 1024 * 1024,
  },
});

const handleImageCompression = async (req, res, next) => {
  const { file, files } = req;

  try {
    if (file) {
      req.body.image = await compressSingleImage(file);
    } else if (files) {
      req.body.images = await mapToMultiFile(files);
    } else {
      next(multer.MulterError('Unable to find file(s)'));
    }
    next();
  } catch (error) {
    next(error);
  }
};

router.post(
  '/single',
  upload.single('product-image'),
  handleImageCompression,
  (req, res, next) => {
    const { body } = req;
    const originalProductImageUrl = BASE_IMAGE_URL + req.file.filename;

    // ... Additional logic goes here!

    return res.status(201).json({
      code: 201,
      success: true,
      message: 'File uploaded successfully',
      data: {
        // productUrl: originalProductImageUrl,
        // compressedImageUrl: body.image,
        productImageUrls: [originalProductImageUrl, body.image],
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
    const { files, body } = req;
    const originalProductImageUrls = generateImageUrlFromFiles(files);

    // ... Additional logic goes here!

    return res.status(201).json({
      code: 201,
      success: true,
      message: 'Files are uploaded successfully',
      data: {
        productImagesUrls: [...originalProductImageUrls, ...body.images],
      },
    });
  }
);

module.exports = router;
