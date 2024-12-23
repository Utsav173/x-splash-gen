const Tag = require("../models/Tag");

const bootstrapTags = async () => {
  try {
    const tags = ['Nature', 'Travel', 'Food', 'Architecture']; // Add any tags you want to bootstrap

    for (const tagName of tags) {
      const existingTag = await Tag.findOne({ name: tagName });

      if (!existingTag) {
        const newTag = new Tag({ name: tagName });
        await newTag.save();
      }
    }
  } catch (error) {
    console.error('Error bootstrapping tags:', error);
  }
};

module.exports = {
  bootstrapTags
}


