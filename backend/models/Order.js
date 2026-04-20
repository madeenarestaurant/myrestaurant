const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    customerName: { type: String }, // Optional for dine-in
    email: { type: String },
    phone: { type: String },
    addressDetails: {
        city: String,
        place: String,
        pincode: String,
        street: String,
        nearby: String
    },
    address: { type: String }, // Consolidated address string
    items: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        quantity: { type: Number, default: 1 },
        price: { type: Number }
    }],
    totalAmount: { type: Number, required: true },
    status: { 
        type: String, 
        enum: ['pending', 'confirmed', 'delivered', 'requested', 'cancelled'], 
        default: 'requested' 
    },
    mode: {
        type: String,
        enum: ['dine-in', 'take-away', 'delivery'],
        default: "dine-in"
    },
    paymentStatus: { 
        type: String,
        enum: ['Pending', 'Completed', 'Failed'],
        default: 'Pending' 
    },
    paymentMethod: {
        type: String,
        enum: ['COD', 'UPI', 'Card'],
        default: 'COD'
    },
    note: { type: String },
    createdDate: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);
