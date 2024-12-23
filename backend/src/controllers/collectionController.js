const Collection = require('../models/Collection');

const createCollection = async (req, res) => {
  try {
    const { title } = req.body;
    const userId = req.user._id;
    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const newCollection = new Collection({
      title,
      user: userId,
    });

    await newCollection.save();

    res.status(201).json({ message: 'Collection created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const getAllCollections = async (req, res) => {
  try {
    const userId = req.user._id; // Assuming user is authenticated

    const collections = await Collection.find({ user: userId });

    res.status(200).json(collections);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const getCollectionById = async (req, res) => {
  try {
    const collectionId = req.params.id;
    const userId = req.user._id; // Assuming user is authenticated

    const collection = await Collection.findOne({
      _id: collectionId,
      user: userId,
    }).populate('images');

    if (!collection) {
      return res.status(404).json({ message: 'Collection not found' });
    }

    res.status(200).json(collection);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const updateCollection = async (req, res) => {
  try {
    const collectionId = req.params.id;
    const userId = req.user._id; // Assuming user is authenticated

    const updatedCollection = await Collection.findOneAndUpdate(
      { _id: collectionId, user: userId },
      { title: req.body.title },
      { new: true }
    );

    if (!updatedCollection) {
      return res
        .status(404)
        .json({ message: 'Collection not found or not authorized' });
    }

    res.status(200).json({ message: 'Collection updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const deleteCollection = async (req, res) => {
  try {
    const collectionId = req.params.id;
    const userId = req.user._id; // Assuming user is authenticated

    const deletedCollection = await Collection.findOneAndDelete({
      _id: collectionId,
      user: userId,
    });

    if (!deletedCollection) {
      return res
        .status(404)
        .json({ message: 'Collection not found or not authorized' });
    }

    res.status(200).json({ message: 'Collection deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createCollection,
  getAllCollections,
  getCollectionById,
  updateCollection,
  deleteCollection,
};
