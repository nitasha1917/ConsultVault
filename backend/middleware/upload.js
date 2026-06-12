const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'consultvault',
    resource_type: 'video', // audio = video in cloudinary
  },
});

const upload = multer({ storage });

module.exports = { upload };