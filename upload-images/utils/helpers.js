const path = require('path');
const multer = require('multer');
const sharp = require('sharp');

const {
  MIN_IMAGE_DIM,
  BASE_IMAGE_URL,
  IMAGE_QUALITY,
  DEST_DIR,
  ALLOWED_FILE_EXTENSIONS,
  ALLOWED_FILE_TYPES,
} = require('./constants');

module.exports.compressSingleImage = async (file) => {
  const filePath = path.join(__dirname, '/', file.path);
  const extName = path.extname(filePath);
  const filenameOnly = file.filename.substring(
    0,
    file.filename.length - extName.length
  );

  let compressedImageUrl =
    filenameOnly + `-${MIN_IMAGE_DIM}xOriginal` + extName;
  console.log('Files', file);
  const compressedImageFilePath = path.join(
    // __dirname,
    // '/',
    file.destination,
    compressedImageUrl
  );
  compressedImageUrl = BASE_IMAGE_URL + compressedImageUrl;

  console.log('Pathic', file.path);
  console.log('Destination:', compressedImageFilePath);

  await sharp('./' + file.path)
    .resize(MIN_IMAGE_DIM)
    .jpeg({
      quality: IMAGE_QUALITY,
      chromaSubsampling: '4:4:4',
    })
    .toFile(compressedImageFilePath);
  return compressedImageUrl;
};

// module.exports
module.exports.mapToMultiFile = async (files) => {
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

module.exports.generateImageUrlFromFiles = (files) => {
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

module.exports.upload = multer({
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
