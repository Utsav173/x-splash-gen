const express = require('express');
const tagRouter = express.Router();
const tagsController = require('../controllers/tags');

// Create a new tag
tagRouter.post('/', tagsController.createTag);

// Get all tags
tagRouter.get('/', tagsController.getAllTags);

// Get a single tag by ID
tagRouter.get('/:id', tagsController.getTagById);

// Update a tag by ID
tagRouter.put('/:id', tagsController.updateTag);

// Delete a tag by ID
tagRouter.delete('/:id', tagsController.deleteTag);

module.exports.tagRouter = tagRouter;
