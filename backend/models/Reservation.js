const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  eventDate: { type: String, required: true }, // Format expected: YYYY-MM-DD
  startTime: { type: String, required: true }, // Format expected: HH:mm (e.g. 09:00, 14:00)
  endTime: { type: String, required: true },   // Format expected: HH:mm (e.g. 13:00, 18:00)
  guests: { type: Number, required: true },
  type: { 
    type: String, 
    required: true,
    enum: ['Family Function', 'Party']
  },
  notes: { type: String },
  status: { type: String, default: 'Pending', enum: ['Pending', 'Confirmed', 'Rejected'] }
}, {
  timestamps: true
});

module.exports = mongoose.model('Reservation', reservationSchema);
