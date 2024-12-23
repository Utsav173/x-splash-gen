const express = require('express');
const {
  createComment,
  getAllComments,
  getCommentById,
  deleteComment,
  createReplyComment,
} = require('../controllers/comment');
const { authenticateToken } = require('../middlewares');
const commentRouter = express.Router();

commentRouter.post('/', authenticateToken, createComment);
commentRouter.post('/reply', authenticateToken, createReplyComment);
commentRouter.get('/image/:imageId', getAllComments);
commentRouter.delete('/:id', authenticateToken, deleteComment);

module.exports = commentRouter;
