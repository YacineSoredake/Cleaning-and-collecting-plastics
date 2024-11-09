const mongoose = require('mongoose');

const markerSchema = new mongoose.Schema({
    coordinates: {
        type: { type: String, enum: ['Point'], required: true },
        coordinates: { type: [Number], required: true }
    },
    quantity: { type: String, required: true },
    price: { type: String, required: true },
    status: { type: String, default: 'uncollected' },
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    borrowedBy: { type: Boolean, default: 'false' },
    addedAt: { type: Date, default: Date.now },
    imageUrl: { type: String },    
});

const Marker = mongoose.model('Marker', markerSchema);

module.exports = Marker;
