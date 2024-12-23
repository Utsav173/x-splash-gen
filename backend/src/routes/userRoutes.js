const express = require('express');
const userRoutes = express.Router();
const { authenticateToken } = require('../middlewares');
const {
  login,
  register,
  addImageToCollection,
  removeImageFromCollection,
  me,
} = require('../controllers/user');

userRoutes.post('/register', register);
userRoutes.post('/login', login);
userRoutes.get('/me', authenticateToken, me);
userRoutes.post(
  '/collections/:collectionId/images/:imageId',
  authenticateToken,
  addImageToCollection
);
userRoutes.delete(
  '/collections/:collectionId/images/:imageId',
  authenticateToken,
  removeImageFromCollection
);

module.exports = userRoutes;
