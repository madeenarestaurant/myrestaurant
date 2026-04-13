const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    number: { type: String },
    profileimg: { type: String },
    status: { type: String, default: 'active' },
    lastlogin: { type: Date },
    address: { type: String },
    business: { type: String },
    createdtimes: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Admin', AdminSchema);
