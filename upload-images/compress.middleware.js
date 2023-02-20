const multer = require('multer');

const { compressSingleImage, mapToMultiFile } = require('./helpers');

module.exports.handleImageCompression = async (req, res, next) => {
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
