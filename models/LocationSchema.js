const mongoose = require('mongoose');

const LocationSchema = new mongoose.Schema({
  coordinates: {
    type: { type: String, default: 'Point' }, // GeoJSON type
    coordinates: { type: [Number], required: true }, // [longitude, latitude]
  },
  description: { type: String, required: true },
  status: { type: String, default: 'uncollected' }, // 'uncollected' or 'collected'
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  addedAt: { type: Date, default: Date.now },
});

LocationSchema.index({ coordinates: '2dsphere' }); // Indexing for geospatial queries

module.exports = mongoose.model('Location', LocationSchema);
