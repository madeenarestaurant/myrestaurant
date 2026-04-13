const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');
const auth = require('../middleware/auth');

router.post('/send-otp', reservationController.sendOtp);
router.post('/verify-otp', reservationController.verifyOtp);
router.post('/book', reservationController.createReservation);
router.get('/occupied-slots/:date', reservationController.getOccupiedSlots);

// Admin Routes
router.get('/', auth, reservationController.getAllReservations);
router.get('/:id', auth, reservationController.getReservationById);
router.put('/:id', auth, reservationController.updateReservation);
router.delete('/:id', auth, reservationController.deleteReservation);

module.exports = router;
