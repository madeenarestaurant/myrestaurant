const Reservation = require('../models/Reservation');
const Otp = require('../models/Otp');
const nodemailer = require('nodemailer');

// Initialize NodeMailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// @route   POST /api/reservations/send-otp
// @desc    Generate and send OTP to the given email
exports.sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    // Generate 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Remove any previously unverified OTPs for this email to avoid duplicates
    await Otp.deleteMany({ email });

    // Save in database (With 10-minutes TTL set in model)
    const newOtp = new Otp({ email, otp: otpCode, isVerified: false });
    await newOtp.save();

    // Prepare Mail 
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

    // Safely send if credentials exist, otherwise log to console for dev mode
    if (process.env.EMAIL_USER && process.env.EMAIL_USER !== 'your_email@gmail.com') {
      await transporter.sendMail(mailOptions);
    } else {
      console.log(`[SIMULATED EMAIL] To: ${email}, OTP: ${otpCode}`);
    }

    res.status(200).json({ message: 'OTP successfully sent to ' + email });
  } catch (error) {
    console.error('Send OTP Error:', error);
    res.status(500).json({ message: 'Failed to send OTP.' });
  }
};

// @route   POST /api/reservations/verify-otp
// @desc    Verify the email associated with the 6 digit OTP
exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ message: 'Email and OTP inputs are required' });

    const existingOtp = await Otp.findOne({ email, otp });
    if (!existingOtp) {
      return res.status(400).json({ message: 'Invalid or expired OTP.' });
    }

    // Update verified status in DB temporarily
    existingOtp.isVerified = true;
    await existingOtp.save();

    res.status(200).json({ message: 'Email verified successfully! You can now proceed to book.' });
  } catch (error) {
    console.error('Verify OTP Error:', error);
    res.status(500).json({ message: 'Server error while verifying OTP.' });
  }
};

// @route   POST /api/reservations/book
// @desc    Create a reservation if slot is available and email is verified
exports.createReservation = async (req, res) => {
  try {
    const { fullName, email, phone, eventDate, startTime, endTime, guests, type, notes } = req.body;

    // 1) Enforce OTP Email verification
    const verifiedOtp = await Otp.findOne({ email, isVerified: true });
    if (!verifiedOtp) {
      return res.status(400).json({ message: 'Email is not verified. Please verify your OTP to finalize booking.' });
    }

    // 2) Parse standard overlapping 24-hr time blocks (E.g. '09:00', '14:30')
    const timeToMinutes = (timeStr) => {
      const [hours, mins] = timeStr.split(':').map(Number);
      return (hours * 60) + mins;
    };

    const newStart = timeToMinutes(startTime);
    const newEnd = timeToMinutes(endTime);

    if (newStart >= newEnd) {
      return res.status(400).json({ message: 'Reservation end time must occur strictly after the start time.' });
    }

    // 3) Validate Single-Date Exclusivity and Overlaps
    const existingBookings = await Reservation.find({ eventDate });

    for (let booking of existingBookings) {
      const existingStart = timeToMinutes(booking.startTime);
      const existingEnd = timeToMinutes(booking.endTime);

      // Strict standard interval Overlap detection algorithm:
      // (Start A < End B) AND (End A > Start B)
      if (newStart < existingEnd && newEnd > existingStart) {
        return res.status(400).json({
          message: `Conflict detected! An existing event is already safely booked from ${booking.startTime} to ${booking.endTime} on this day. Please select a non-overlapping time section.`
        });
      }
    }

    // 4) Successful validation - Create reservation
    const newReservation = new Reservation({
      fullName, email, phone, eventDate, startTime, endTime, guests, type, notes
    });

    await newReservation.save();

    // 5) Email user - request received (pending)
    const userMailOptions = {
      from: `"Madeena Restaurant" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Reservation Request Received - Madeena Restaurant',
      html: `
        <div style="font-family:Arial,sans-serif;max-width:480px;margin:auto;padding:40px 30px;text-align:center;">
          <p style="font-size:13px;color:#999;letter-spacing:3px;text-transform:uppercase;margin-bottom:4px;">MADEENA RESTAURANT</p>
          <h2 style="color:#0a0a0a;margin:0 0 8px;">Request Received</h2>
          <p style="color:#666;font-size:14px;margin-bottom:30px;">Hi <strong>${fullName}</strong>, your reservation request has been submitted. We'll confirm it shortly.</p>
          <div style="background:#f7f7f7;border-radius:12px;padding:20px 30px;text-align:left;font-size:14px;color:#444;">
            <p style="margin:6px 0;">📅 <strong>${eventDate}</strong></p>
            <p style="margin:6px 0;">⏰ ${startTime} – ${endTime}</p>
            <p style="margin:6px 0;">👥 ${guests} Guests</p>
            <p style="margin:6px 0;">🎉 ${type}</p>
            ${notes ? `<p style="margin:6px 0;">💬 ${notes}</p>` : ''}
          </div>
          <p style="font-size:11px;color:#aaa;margin-top:30px;">Madeena Restaurant · Ruwi, Muscat, Oman</p>
        </div>
      `
    };

    // 6) Email admin - request with Confirm button
    const adminEmail = 'madeenarestaurantoman@gmail.com';
    const confirmUrl = `${process.env.BASE_URL || 'http://localhost:5000'}/api/reservations/confirm/${newReservation._id}`;
    const adminMailOptions = {
      from: `"Reservation System" <${process.env.EMAIL_USER}>`,
      to: adminEmail,
      subject: `New Reservation Request — ${fullName} (${eventDate})`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:520px;margin:auto;padding:40px 30px;">
          <p style="font-size:13px;color:#999;letter-spacing:3px;text-transform:uppercase;margin-bottom:4px;">MADEENA RESTAURANT</p>
          <h2 style="color:#0a0a0a;margin:0 0 24px;">New Hall Booking Request</h2>
          <div style="background:#f7f7f7;border-radius:12px;padding:20px 30px;font-size:14px;color:#444;margin-bottom:28px;">
            <p style="margin:8px 0;"><strong>Name:</strong> ${fullName}</p>
            <p style="margin:8px 0;"><strong>Email:</strong> ${email}</p>
            <p style="margin:8px 0;"><strong>Phone:</strong> ${phone}</p>
            <p style="margin:8px 0;"><strong>Type:</strong> ${type}</p>
            <p style="margin:8px 0;"><strong>Date:</strong> ${eventDate}</p>
            <p style="margin:8px 0;"><strong>Time:</strong> ${startTime} – ${endTime}</p>
            <p style="margin:8px 0;"><strong>Guests:</strong> ${guests}</p>
            ${notes ? `<p style="margin:8px 0;"><strong>Notes:</strong> ${notes}</p>` : ''}
          </div>
          <p style="font-size:11px;color:#aaa;margin-top:28px;text-align:center;">This is an automated notification from the reservation system.</p>
        </div>
      `
    };

    if (process.env.EMAIL_USER && process.env.EMAIL_USER !== 'your_email@gmail.com') {
      await transporter.sendMail(userMailOptions);
      await transporter.sendMail(adminMailOptions);
    }

    // 6) Burn the OTP logic record
    await Otp.deleteMany({ email });

    res.status(201).json({
      message: 'Hall Reservation successfully scheduled & confirmed!',
      reservation: newReservation
    });

  } catch (error) {
    console.error('Booking Validation Error:', error);
    res.status(500).json({ message: 'Database failure. Unable to create reservation at this time.' });
  }
};
// @route   GET /api/reservations/occupied-slots/:date
// @desc    Fetch occupied time slots for a specific date
exports.getOccupiedSlots = async (req, res) => {
  try {
    const { date } = req.params;
    const bookings = await Reservation.find({ eventDate: date }).select('startTime endTime -_id');
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching availability' });
  }
};

// @route   GET /api/reservations/confirm/:id
// @desc    Admin clicks button -> confirms reservation -> sends acceptance email to user
exports.confirmReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) {
      return res.status(404).send('<p style="font-family:Arial;text-align:center;padding:60px;">Reservation not found.</p>');
    }
    if (reservation.status === 'Confirmed') {
      return res.send(`
        <div style="font-family:Arial,sans-serif;text-align:center;padding:80px 30px;">
          <h2>Already Confirmed</h2>
          <p style="color:#666;">This reservation was already confirmed earlier.</p>
        </div>
      `);
    }

    reservation.status = 'Confirmed';
    await reservation.save();

    // Send acceptance email to user
    const acceptanceMailOptions = {
      from: `"Madeena Restaurant" <${process.env.EMAIL_USER}>`,
      to: reservation.email,
      subject: '🎉 Reservation Confirmed — Madeena Restaurant',
      html: `
        <div style="font-family:Arial,sans-serif;max-width:480px;margin:auto;padding:40px 30px;text-align:center;">
          <p style="font-size:13px;color:#999;letter-spacing:3px;text-transform:uppercase;margin-bottom:4px;">MADEENA RESTAURANT</p>
          <h2 style="color:#0a0a0a;margin:0 0 8px;">Reservation Confirmed! 🎉</h2>
          <p style="color:#666;font-size:14px;margin-bottom:30px;">Hi <strong>${reservation.fullName}</strong>, your hall reservation has been confirmed. We look forward to hosting you!</p>
          <div style="background:#f7f7f7;border-radius:12px;padding:20px 30px;text-align:left;font-size:14px;color:#444;">
            <p style="margin:6px 0;">📅 <strong>${reservation.eventDate}</strong></p>
            <p style="margin:6px 0;">⏰ ${reservation.startTime} – ${reservation.endTime}</p>
            <p style="margin:6px 0;">👥 ${reservation.guests} Guests</p>
            <p style="margin:6px 0;">🎉 ${reservation.type}</p>
            ${reservation.notes ? `<p style="margin:6px 0;">💬 ${reservation.notes}</p>` : ''}
          </div>
          <p style="font-size:13px;color:#555;margin-top:28px;">For queries, call us at <strong>📞 95945674</strong></p>
          <p style="font-size:11px;color:#aaa;margin-top:10px;">Madeena Restaurant · Ruwi, Muscat, Oman</p>
        </div>
      `
    };

    if (process.env.EMAIL_USER && process.env.EMAIL_USER !== 'your_email@gmail.com') {
      await transporter.sendMail(acceptanceMailOptions);
    }

    // Return a clean HTML success page to admin's browser
    res.send(`
      <div style="font-family:Arial,sans-serif;text-align:center;padding:80px 30px;max-width:500px;margin:auto;">
        <h1 style="color:#0a0a0a;font-size:28px;">✅ Confirmed</h1>
        <p style="color:#666;font-size:15px;margin-top:12px;">The reservation for <strong>${reservation.fullName}</strong> on <strong>${reservation.eventDate}</strong> has been confirmed.<br/><br/>A confirmation email has been sent to the customer.</p>
      </div>
    `);

  } catch (error) {
    console.error('Confirm Reservation Error:', error);
    res.status(500).send('<p style="font-family:Arial;text-align:center;padding:60px;">Server error. Could not confirm reservation.</p>');
  }
};
