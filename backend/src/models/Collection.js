const { default: mongoose } = require('mongoose');

const collectionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    title: { type: String, required: true },
    images: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Image' }],
  },
  {
    timestamps: true,
  }
);

const Collection = mongoose.model('Collection', collectionSchema);
module.exports = Collection;
