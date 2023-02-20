const router = require('express').Router();

const { handleImageCompression } = require('./compress.middleware');
const { upload } = require('./helpers');
const {
  uploadSingleImageController,
  uploadMultipleImageController,
} = require('./upload.controllers');

router.post(
  '/single',
  upload.single('product-image'),
  handleImageCompression,
  uploadSingleImageController
);

router.post(
  '/multiple',
  upload.fields([
    { name: 'product-image', maxCount: 1 },
    { name: 'product-image-alt', maxCount: 1 },
  ]),
  handleImageCompression,
  uploadMultipleImageController
);

module.exports = router;
