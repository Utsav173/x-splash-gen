const Image = require("../models/Image");
require("dotenv").config();
const sharp = require("sharp");
const { Client, GatewayIntentBits } = require("discord.js");
const { default: mongoose } = require("mongoose");
const Like = require("../models/Like");
const Collection = require("../models/Collection");
const Comment = require("../models/Comment");
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent],
});
client.login(process.env.BOT_TOKEN);

const uploadToDescord = async (channel, chunk, fileName) => {
  try {
    const sentMessage = await channel.send({
      files: [
        {
          attachment: chunk,
          name: fileName,
        },
      ],
      content: fileName,
    });

    return {
      url: sentMessage.attachments.first().url,
      success: true,
      id: sentMessage.id,
    };
  } catch (error) {
    console.log(error);
    return { success: false, errorMessage: error.message };
  }
};

const getAllImages = async (req, res) => {
  try {
    const { page = 1, limit = 10, q } = req.query;

    const pipeline = [];

    pipeline.push(
      {
        $lookup: {
          from: "users", // Assuming your user collection is named 'users'
          localField: "uploadedBy",
          foreignField: "_id",
          as: "uploadedBy",
        },
      },
      { $unwind: "$uploadedBy" },
      {
        $lookup: {
          from: "users", // Assuming your user collection is named 'users'
          localField: "likes",
          foreignField: "_id",
          as: "likes",
        },
      },
      {
        $lookup: {
          from: "tags", // Assuming your tag collection is named 'tags'
          localField: "tags",
          foreignField: "_id",
          as: "tags",
        },
      },
      { $sort: { createdAt: -1 } },
      { $skip: (parseInt(page) - 1) * parseInt(limit) },
      { $limit: parseInt(limit) },
      {
        $project: {
          title: 1,
          description: 1,
          imageUrl: 1,
          thumbnailUrl: 1,
          uploadedBy: {
            _id: 1,
            username: 1,
            email: 1,
          },
          likes: {
            _id: 1,
            username: 1,
          },
          tags: {
            name: 1,
          },
          createdAt: 1,
          updatedAt: 1,
        },
      }
    );
    if (q && typeof q === "string") {
      pipeline.push({
        $match: {
          $or: [
            { title: { $regex: q, $options: "i" } },
            { description: { $regex: q, $options: "i" } },
            { "uploadedBy.username": { $regex: q, $options: "i" } },
            { "tags.name": { $regex: q, $options: "i" } },
          ],
        },
      });
    }
    const images = await Image.aggregate(pipeline);
    let totalRecords;

    if (q && typeof q === "string") {
      totalRecords = await Image.countDocuments({
        $or: [
          { title: { $regex: q, $options: "i" } },
          { description: { $regex: q, $options: "i" } },
          { "uploadedBy.username": { $regex: q, $options: "i" } },
          { "tags.name": { $regex: q, $options: "i" } },
        ],
      });
    } else {
      totalRecords = await Image.countDocuments();
    }

    const totalPages = Math.ceil(totalRecords / limit);

    return res.status(200).json({
      images,
      page,
      totalPages,
      totalRecords,
      perPage: parseInt(limit),
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
};

const uploadImages = async (req, res) => {
  try {
    const { title, description, tags } = req.body;

    if (!title || !description || !tags) {
      return res
        .status(400)
        .json({ message: "All fields are required : title, description" });
    }

    if (title.length > 20) {
      return res
        .status(400)
        .json({ message: "Title must be less than 20 characters" });
    }
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    if (req.file.size > 13 * 1024 * 1024) {
      return res.status(400).json({ message: "File size too large" });
    }

    const channel = client.channels.cache.get(process.env.CHANNEL_ID);

    if (!channel) {
      return res.status(404).json({
        message: "Discord channel not found or invalid channel type.",
      });
    }
    let thumbnailUrl;
    const result = await uploadToDescord(
      channel,
      req.file.buffer,
      req.file.originalname
    );

    if (req.file.mimetype.startsWith("image")) {
      const compressedBuffer = await sharp(req.file.buffer)
        .resize(250)
        .webp({ quality: 25 })
        .toBuffer();

      const compressedResult = await uploadToDescord(
        channel,
        compressedBuffer,
        `thumbnail_${req.file.originalname}`
      );

      thumbnailUrl = compressedResult.url;
    }

    if (result?.success === false) {
      return res.status(500).json({ message: "Error uploading image" });
    }

    // Save the Cloudinary URL to your Image model
    const newImage = new Image({
      title: req.body.title,
      description: req.body.description,
      imageUrl: result.url,
      thumbnailUrl: thumbnailUrl || null,
      uploadedBy: req.user._id,
      public_id: result.id,
    });

    if (req.body.tags && req.body.tags.length > 0) {
      newImage.tags.push(...JSON.parse(req.body.tags));
    }
    await newImage.save();

    return res.status(200).json({ message: "Image uploaded successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
};

const likeImage = async (req, res) => {
  try {
    const imageId = req.params.id;

    if (!imageId) {
      return res.status(404).json({ message: "Image ID is required" });
    }

    const image = await Image.findById(imageId);

    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }

    const userLiked = image.likes.includes(req.user._id);

    if (userLiked) {
      await Image.findByIdAndUpdate(
        imageId,
        { $pull: { likes: req.user._id } }, // Remove user from 'likes' array
        { new: true }
      );
      return res.status(200).json({ message: "Image unliked successfully" });
    } else {
      await Image.findByIdAndUpdate(
        imageId,
        { $addToSet: { likes: req.user._id } }, // Add user to 'likes' array
        { new: true }
      );
      return res.status(200).json({ message: "Image liked successfully" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const addTagsToImage = async (req, res) => {
  try {
    const imageId = req.params.id;
    const tags = req.body.tags;

    if (!imageId) {
      return res.status(404).json({ message: "Image ID is required" });
    }
    if (!tags) {
      return res.status(404).json({ message: "Tags are required" });
    }

    const updatedImage = await Image.findByIdAndUpdate(
      imageId,
      { $addToSet: { tags: { $each: tags } } }, // Add tags to 'tags' array if not already present
      { new: true }
    );

    res.status(200).json({ message: "Tags added successfully", updatedImage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const deleteImage = async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Image ID is required" });
    }

    const image = await Image.findById(id);
    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }

    // Delete likes associated with the image
    await Like.deleteMany({ image: id });

    // Update collections to remove the image reference using $pull and $in operator
    await Collection.updateMany(
      { images: { $in: [id] } },
      { $pull: { images: id } }
    );

    // Delete comments associated with the image
    await Comment.deleteMany({ image: id });
    const channel = client.channels.cache.get(process.env.CHANNEL_ID);

    const fetchImage = await channel.messages.fetch(image.public_id);
    await fetchImage.delete();

    const deletedImage = await Image.findByIdAndDelete(id);

    if (!deletedImage) {
      return res.status(404).json({ message: "Image not found" });
    }

    return res.status(200).json({ message: "Image deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const getImageById = async (messageId) => {
  try {
    const channel = client.channels.cache.get(process.env.CHANNEL_ID);
    if (!channel) {
      throw new Error("Channel not found");
    }

    // Fetch the message from the channel using the message ID
    const message = await channel.messages.fetch(messageId);

    // Check if there is an attachment in the message
    if (message.attachments.size > 0) {
      const attachment = message.attachments.first();
      return attachment.url;
    }

    throw new Error("No attachments found");
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching image by ID");
  }
};

const getSingleImage = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ message: "Image ID is required" });
    }

    const imageData = await Image.findById(id)
      .populate("uploadedBy", "_id username email")
      .populate("likes", "_id username email")
      .populate("tags", "_id name");

    if (!imageData) {
      return res.status(404).json({ message: "Image not found" });
    }

    const imageUrl = await getImageById(imageData.public_id);

    imageData.imageUrl = imageUrl;
    return res.status(200).json(imageData);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
};

const fixImagesUrl = async (req, res) => {
  try {
    // Retrieve all images in the database
    const images = await Image.find();

    // Loop through each image and update its URL
    for (const image of images) {
      if (image.public_id) {
        // Fetch the latest URL using the public_id (Discord message ID)
        const latestUrl = await getImageById(image.public_id);

        if (latestUrl) {
          // Update image URL only if it's different
          if (latestUrl !== image.imageUrl) {
            image.imageUrl = latestUrl;
          }

          // Check and update the thumbnail URL if necessary
          if (image.thumbnailUrl) {
            const latestThumbnailUrl = await getImageById(image.public_id); // You may adjust this logic if needed
            if (
              latestThumbnailUrl &&
              latestThumbnailUrl !== image.thumbnailUrl
            ) {
              image.thumbnailUrl = latestThumbnailUrl;
         
            }
          }

          // Save the updated image document
          await image.save();
        } else {
          console.log(`Could not retrieve new URL for image: ${image.title}`);
        }
      }
    }

    return res.status(200).json({ message: "Image URLs updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllImages,
  uploadImages,
  likeImage,
  addTagsToImage,
  deleteImage,
  getSingleImage,
  fixImagesUrl,
};
