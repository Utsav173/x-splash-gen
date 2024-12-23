const Tag = require('../models/Tag');

const createTag = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Tag name is required' });
    }

    const newTag = new Tag({ name });
    await newTag.save();

    res.status(201).json(newTag);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const getAllTags = async (req, res) => {
  try {
    const tags = await Tag.find().select('_id name');
    res.status(200).json(tags);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const getTagById = async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ message: 'Tag ID is required' });
    }
    const tag = await Tag.findById(req.params.id);

    if (!tag) {
      return res.status(404).json({ message: 'Tag not found' });
    }

    res.status(200).json(tag);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const updateTag = async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ message: 'Tag ID is required' });
    }
    if (!req.body.name) {
      return res.status(400).json({ message: 'Tag name is required' });
    }

    const tag = await Tag.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name },
      { new: true }
    );

    if (!tag) {
      return res.status(404).json({ message: 'Tag not found' });
    }

    res.status(200).json(tag);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const deleteTag = async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ message: 'Tag ID is required' });
    }
    const tag = await Tag.findByIdAndDelete(req.params.id);

    if (!tag) {
      return res.status(404).json({ message: 'Tag not found' });
    }

    res.status(200).json({ message: 'Tag deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createTag,
  getAllTags,
  getTagById,
  updateTag,
  deleteTag,
};
