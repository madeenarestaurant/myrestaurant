const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');

// Request OTP Route -> Generates and emails the OTP
router.post('/send-otp', reservationController.sendOtp);

// Verify OTP Route -> Flags the user's email verified session active 
router.post('/verify-otp', reservationController.verifyOtp);

// Final Book Route -> Submits form checking Time-overlap validation + Verified Email auth
router.post('/book', reservationController.createReservation);

// Fetch availability route
router.get('/occupied-slots/:date', reservationController.getOccupiedSlots);

// Admin confirmation route (linked from email button)
router.get('/confirm/:id', reservationController.confirmReservation);

module.exports = router;
