const mongoose = require("mongoose");

const visitorSchema = new mongoose.Schema({
  visitorId: { type: String, required: true },
  ip: String,
  country: String,
  city: String,
  region: String,
  timezone: String,
  userAgent: String,
  device: String,
  browser: String,
  os: String,
  pagesVisited: [{
    path: String,
    timestamp: { type: Date, default: Date.now },
    timeSpent: { type: Number, default: 0 } 
  }],
  clicks: [{
    path: String,
    x: Number,
    y: Number,
    element: String,
    timestamp: { type: Date, default: Date.now }
  }],
  visitCount: { type: Number, default: 1 },
  lastVisit: { type: Date, default: Date.now },
  isOnline: { type: Boolean, default: false },
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
  reservations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Reservation' }],
  emailVerified: { type: Boolean, default: false }
}, { timestamps: true });


visitorSchema.index({ visitorId: 1 });
visitorSchema.index({ ip: 1 });

module.exports = mongoose.model("Visitor", visitorSchema);
