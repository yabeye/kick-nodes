const { generateImageUrlFromFiles } = require('./utils/helpers');
const { BASE_IMAGE_URL } = require('./utils/constants');

module.exports.uploadSingleImageController = async (req, res, next) => {
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
};

module.exports.uploadMultipleImageController = async (req, res, next) => {
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
};
