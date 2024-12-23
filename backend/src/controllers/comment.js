const Comment = require('../models/Comment');

const createComment = async (req, res) => {
  try {
    const { content, image } = req.body; // Assuming user, content, image, and comment are sent in the request body

    if (!content || !image) {
      return res
        .status(400)
        .json({ message: 'All fields are required : content, image' });
    }

    const newComment = new Comment({
      user: req.user._id,
      content,
      image,
    });

    await newComment.save();

    res
      .status(201)
      .json({ message: 'Comment created successfully', _id: newComment._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const createReplyComment = async (req, res) => {
  try {
    const { content, comment, image } = req.body; // Assuming content, image, and parentComment (ID of original comment) are sent in the request body

    if (!content || !comment || !image) {
      return res.status(400).json({
        message: 'All fields are required : content, comment, image',
      });
    }

    const findParentComment = await Comment.findById(comment);

    if (!findParentComment) {
      return res.status(404).json({ message: 'Parent comment not found' });
    }

    const newReply = new Comment({
      user: req.user._id,
      content,
      image,
      replyTo: comment,
    });

    await newReply.save();

    res.status(201).json({
      message: 'Reply comment created successfully',
      _id: newReply._id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const getAllComments = async (req, res) => {
  try {
    const imageId = req.params.imageId;
    let commentsData = await Comment.find({
      image: imageId,
    })
      .populate({ path: 'user', select: '_id username' })
      .populate({ path: 'replyTo', select: '_id content' })
      .select('-__v -updatedAt');

    if (!commentsData) {
      return res.status(404).json({ message: 'Comments not found' });
    }

    res.status(200).json(commentsData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const deleteComment = async (req, res) => {
  try {
    const commentId = req.params.id;

    if (!commentId) {
      return res.status(400).json({ message: 'Comment ID is required' });
    }

    const deletedComment = await Comment.findByIdAndDelete(commentId);

    if (!deletedComment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createComment,
  getAllComments,
  deleteComment,
  createReplyComment,
};
