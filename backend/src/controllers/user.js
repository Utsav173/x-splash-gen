const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Collection = require('../models/Collection');
const Image = require('../models/Image');

const addImageToCollection = async (req, res) => {
  try {
    const userId = req.user._id;
    const collectionId = req.params.collectionId;
    const imageId = req.params.imageId; // Assuming the image ID is sent in the request body

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const collection = await Collection.findById(collectionId);

    if (!collection) {
      return res.status(404).json({ message: 'Collection not found' });
    }

    const imageExists = await Image.findById(imageId);

    if (!imageExists) {
      return res
        .status(400)
        .json({ message: 'Image does not exist in the database' });
    }

    // Check if the imageId already exists in the collection
    const imageInCollection = collection.images.includes(imageId);

    if (imageInCollection) {
      return res
        .status(400)
        .json({ message: 'Image already exists in the collection' });
    }

    collection.images.push(imageId);
    await collection.save();

    res.status(200).json({ message: 'Image added to collection successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const removeImageFromCollection = async (req, res) => {
  try {
    const userId = req.user._id;
    const collectionId = req.params.collectionId;
    const imageId = req.params.imageId;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const collection = await Collection.findById(collectionId);

    if (!collection) {
      return res.status(404).json({ message: 'Collection not found' });
    }

    // Check if the imageId exists in the collection
    const imageInCollection = collection.images.includes(imageId);

    if (!imageInCollection) {
      return res
        .status(400)
        .json({ message: 'Image does not exist in the collection' });
    }

    collection.images.pull(imageId);
    await collection.save();

    res
      .status(200)
      .json({ message: 'Image removed from collection successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Check if the provided password matches
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Create a JWT token for authentication
    const token = jwt.sign({ userId: user._id }, 'secret_key'); // Replace 'secret_key' with your actual secret key

    res.status(200).json({ user, token, message: 'Login successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    // Create a JWT token for authentication
    const token = jwt.sign({ userId: newUser._id }, 'secret_key'); // Replace 'secret_key' with your actual secret key

    res
      .status(201)
      .json({ user: newUser, token, message: 'Registration successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const me = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  login,
  register,
  addImageToCollection,
  removeImageFromCollection,
  me
};
