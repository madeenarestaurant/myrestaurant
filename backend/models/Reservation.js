const mongoose = require('mongoose');

const ReservationSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    eventDate: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    guests: { type: Number, required: true },
    reservationType: { 
        type: String, 
        required: true,
        enum: ['Family Function', 'Normal Party', 'Other'] 
    },
    venueDetails: { type: String },
    specialRequirements: { type: String },
    status: { 
        type: String, 
        default: 'Pending', 
        enum: ['Pending', 'Confirmed', 'Rejected', 'Cancelled', 'Requested', 'Completed', 'No Occasion Found'] 
    },
    adminSelection: { type: String }, 
    totalPrice: { type: Number },
    paymentStatus: { type: String, default: 'Unpaid', enum: ['Unpaid', 'Paid'] },
    messageToUser: { type: String }, 
    createdDate: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Reservation', ReservationSchema);
