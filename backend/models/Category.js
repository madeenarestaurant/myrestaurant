const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    img: { type: String },
    description: { type: String },
    status: { type: String, default: 'active' },
    createdDate: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Category', CategorySchema);
