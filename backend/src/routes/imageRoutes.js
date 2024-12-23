const express = require('express');
const imageRoutes = express.Router();
const {
  uploadImages,
  getAllImages,
  likeImage,
  addTagsToImage,
  deleteImage,
  getSingleImage,
} = require('../controllers/image');

const multer = require('multer');

const { authenticateToken } = require('../middlewares');

const storage = multer.memoryStorage();
const upload = multer({ storage });

imageRoutes.get('/', getAllImages);
imageRoutes.post('/', authenticateToken, upload.single('image'), uploadImages);
imageRoutes.post('/like/:id', authenticateToken, likeImage);
imageRoutes.post('/addTag/:id', authenticateToken, addTagsToImage);
imageRoutes.delete('/:id', authenticateToken, deleteImage);
imageRoutes.get('/:id', getSingleImage);
imageRoutes.get('/fix', authenticateToken, fixImagesUrl);

module.exports = imageRoutes;
