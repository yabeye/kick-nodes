module.exports.MIN_IMAGE_DIM = 300;
module.exports.IMAGE_QUALITY = 40; // HALF

module.exports.DEST_DIR = './public/images';
module.exports.BASE_IMAGE_URL = 'http://localhost:4100/kick-nodes/product/';
module.exports.FACTOR = 1 / 6;

// All files except an image (not accepting a json, or a video!)
// This can be change according to the requirement , but you got the point!

module.exports.ALLOWED_FILE_TYPES = [
  'images/jpeg',
  'images/png',
  'images/jpg',
  'images/gif',
];
module.exports.ALLOWED_FILE_EXTENSIONS = ['.jpeg', '.png', '.jpg', '.gif'];
