const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    customerName: { type: String }, 
    email: { type: String },
    phone: { type: String },
    addressDetails: {
        city: String,
        place: String,
        pincode: String,
        street: String,
        nearby: String
    },
    address: { type: String }, 
    items: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        quantity: { type: Number, default: 1 },
        price: { type: Number }
    }],
    totalAmount: { type: Number, required: true },
    token: { type: String },
    status: { 
        type: String, 
        enum: ['pending', 'confirmed', 'delivered', 'requested', 'cancelled', 'completed'], 
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
