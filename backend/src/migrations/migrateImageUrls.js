const Image = require('../models/Image');
require('dotenv').config();

// Function to fetch the latest image URL from Discord
const getLatestImageUrl = async (messageId, channel) => {
  try {
    const message = await channel.messages.fetch(messageId);
    if (message.attachments.size > 0) {
      return message.attachments.first().url;
    }
    throw new Error('No attachments found');
  } catch (error) {
    console.error('Error fetching the latest image URL:', error);
    return null;
  }
};

// Migration function to update image URLs
const migrateImageUrls = async (channel) => {
  try {
    // Retrieve all images in the database
    const images = await Image.find();

    // Loop through each image and update its URL
    for (const image of images) {
      if (image.public_id) {
        // Fetch the latest URL using the public_id (Discord message ID)
        const latestUrl = await getLatestImageUrl(image.public_id, channel);

        if (latestUrl) {
          // Update image URL only if it's different
          if (latestUrl !== image.imageUrl) {
            image.imageUrl = latestUrl;
          }

          // Check and update the thumbnail URL if necessary
          if (image.thumbnailUrl) {
            const latestThumbnailUrl = await getLatestImageUrl(
              image.public_id,
              channel
            ); // You may adjust this logic if needed
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

    console.log('Image URLs migration completed.');
  } catch (error) {
    console.error('Error during the migration:', error);
  }
};

module.exports = { migrateImageUrls };
