const Reservation = require('../models/Reservation');
const Visitor = require('../models/Visitor');
const Otp = require('../models/Otp');
const nodemailer = require('nodemailer');

// Initialize NodeMailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS ? process.env.EMAIL_PASS.replace(/\s/g, '') : ''
  }
});

// @route   POST /api/reservations/send-otp
exports.sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    await Otp.deleteMany({ email });

    const newOtp = new Otp({ email, otp: otpCode, isVerified: false });
    await newOtp.save();

    const mailOptions = {
      from: `"Madeena Restaurant" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your OTP Code',
      html: `
        <div style="font-family:Arial,sans-serif;max-width:400px;margin:auto;padding:40px 30px;text-align:center;background:#fff;">
          <p style="font-size:13px;color:#999;letter-spacing:3px;text-transform:uppercase;margin-bottom:4px;">MADEENA RESTAURANT</p>
          <p style="font-size:13px;color:#555;margin:0 0 30px;">Your verification code</p>
          <div style="background:#0a0a0a;border-radius:16px;padding:24px 36px;display:inline-block;margin-bottom:24px;">
            <span style="font-size:48px;font-weight:700;letter-spacing:16px;color:#fff;font-family:'Courier New',monospace;">${otpCode}</span>
          </div>
          <p style="font-size:12px;color:#aaa;margin:0;">Expires in <strong>10 minutes</strong>. Do not share this code.</p>
        </div>
      `
    };

    if (process.env.EMAIL_USER) {
      await transporter.sendMail(mailOptions);
    } else {
      console.log(`[SIMULATED EMAIL] To: ${email}, OTP: ${otpCode}`);
    }

    res.status(200).json({ message: 'OTP successfully sent to ' + email });
  } catch (error) {
    res.status(500).json({ message: 'Failed to send OTP.' });
  }
};

// @route   POST /api/reservations/verify-otp
exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp, visitorId } = req.body;
    if (!email || !otp) return res.status(400).json({ message: 'Email and OTP inputs are required' });

    const existingOtp = await Otp.findOne({ email, otp });
    if (!existingOtp) {
      return res.status(400).json({ message: 'Invalid or expired OTP.' });
    }

    existingOtp.isVerified = true;
    await existingOtp.save();

    // Mark visitor as email verified
    if (visitorId) {
        await Visitor.findOneAndUpdate({ visitorId }, { emailVerified: true });
    }

    res.status(200).json({ message: 'Email verified successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Server error while verifying OTP.' });
  }
};

// @route   POST /api/reservations/book
exports.createReservation = async (req, res) => {
  try {
    const { 
        fullName, email, phone, eventDate, startTime, endTime, 
        guests, reservationType, type, venueDetails, specialRequirements, visitorId 
    } = req.body;

    // Support both 'reservationType' and 'type' for compatibility
    let finalType = reservationType || type;
    if (finalType === 'Party') finalType = 'Normal Party'; // Align with enum

    // Enforce OTP Email verification
    const verifiedOtp = await Otp.findOne({ email, isVerified: true });
    if (!verifiedOtp) {
      return res.status(400).json({ message: 'Email is not verified.' });
    }

    const newReservation = new Reservation({
      fullName, email, phone, eventDate, startTime, endTime, 
      guests, reservationType: finalType, venueDetails, specialRequirements,
      status: 'Requested'
    });

    await newReservation.save();

    // Link to Visitor if ID provided
    if (visitorId) {
        await Visitor.findOneAndUpdate(
            { visitorId },
            { $push: { reservations: newReservation._id } }
        );
    }

    // Emit socket event for real-time update
    if (req.io) {
        req.io.emit('new_reservation', newReservation);
    }

    // Notify user that request is received
    const userMailOptions = {
        from: `"Madeena Restaurant" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Reservation Request Received - Madeena Restaurant',
        html: `<h3>Hi ${fullName}, your reservation request has been submitted. We'll confirm it shortly.</h3>`
    };
    
    if (process.env.EMAIL_USER) {
        await transporter.sendMail(userMailOptions);
    }

    await Otp.deleteMany({ email });

    res.status(201).json({
      message: 'Reservation request sent to admin for confirmation.',
      reservation: newReservation
    });

  } catch (error) {
    console.error('Booking Validation Error:', error);
    res.status(500).json({ message: 'Database failure. Unable to create reservation.', error: error.message });
  }
};

// @route   GET /api/reservations
exports.getAllReservations = async (req, res) => {
    try {
        const reservations = await Reservation.find().sort({ createdAt: -1 });
        res.json(reservations);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @route   GET /api/reservations/:id
exports.getReservationById = async (req, res) => {
    try {
        const reservation = await Reservation.findById(req.params.id);
        if (!reservation) return res.status(404).json({ message: 'Reservation not found' });
        res.json(reservation);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @route   PUT /api/reservations/:id
exports.updateReservation = async (req, res) => {
    try {
        const { status, messageToUser, totalPrice, paymentStatus } = req.body;
        const reservation = await Reservation.findById(req.params.id);
        
        if (!reservation) return res.status(404).json({ message: 'Reservation not found' });

        const oldStatus = reservation.status;
        reservation.status = status || reservation.status;
        reservation.messageToUser = messageToUser || reservation.messageToUser;
        reservation.totalPrice = totalPrice || reservation.totalPrice;
        reservation.paymentStatus = paymentStatus || reservation.paymentStatus;

        await reservation.save();

        // If status changed to Confirmed, send acceptance email
        if (oldStatus !== 'Confirmed' && status === 'Confirmed') {
            const acceptanceMailOptions = {
                from: `"Madeena Restaurant" <${process.env.EMAIL_USER}>`,
                to: reservation.email,
                subject: '🎉 Reservation Confirmed — Madeena Restaurant',
                html: `
                    <div style="font-family:Arial,sans-serif;max-width:480px;margin:auto;padding:40px 30px;text-align:center;">
                        <h2>Reservation Confirmed! 🎉</h2>
                        <p>Hi <strong>${reservation.fullName}</strong>, your hall reservation has been confirmed.</p>
                        <p>${messageToUser || 'We look forward to hosting you!'}</p>
                        <div style="background:#f7f7f7;padding:20px;text-align:left;">
                            <p>📅 <strong>${reservation.eventDate.toDateString()}</strong></p>
                            <p>⏰ ${reservation.startTime} – ${reservation.endTime}</p>
                            <p>👥 ${reservation.guests} Guests</p>
                        </div>
                    </div>
                `
            };
            if (process.env.EMAIL_USER) {
                await transporter.sendMail(acceptanceMailOptions);
            }
        }

        res.json(reservation);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @route   DELETE /api/reservations/:id
exports.deleteReservation = async (req, res) => {
    try {
        const reservation = await Reservation.findByIdAndDelete(req.params.id);
        if (!reservation) return res.status(404).json({ message: 'Reservation not found' });
        res.json({ message: 'Reservation deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getOccupiedSlots = async (req, res) => {
  try {
    const { date } = req.params;
    const bookings = await Reservation.find({ eventDate: date }).select('startTime endTime -_id');
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching availability' });
  }
};
