const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  imageUrl: { type: String, required: true },
  thumbnailUrl: { type: String },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
  public_id: { type: String },
},{
  timestamps: true
});

const Image = mongoose.model('Image', imageSchema);

module.exports = Image;
