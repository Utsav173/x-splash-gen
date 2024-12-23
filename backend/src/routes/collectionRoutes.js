const express = require('express');
const collectionRouter = express.Router();
const { authenticateToken } = require('../middlewares');
const {
  getAllCollections,
  getCollectionById,
  updateCollection,
  deleteCollection,
  createCollection,
} = require('../controllers/collectionController');

// Create a new collection
collectionRouter.post('/', authenticateToken, createCollection);
collectionRouter.get('/', authenticateToken, getAllCollections);
collectionRouter.get('/:id', authenticateToken, getCollectionById);
collectionRouter.put('/:id', authenticateToken, updateCollection);
collectionRouter.delete('/:id', authenticateToken, deleteCollection);

module.exports = collectionRouter;
