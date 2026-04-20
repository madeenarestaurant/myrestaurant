const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/register', adminController.registerAdmin);
router.post('/login', adminController.loginAdmin);
router.post('/logout', auth, adminController.logoutAdmin);
router.get('/profile', auth, adminController.getAdminProfile);
router.put('/profile', auth, upload.single('profileimg'), adminController.updateAdminProfile);

// Password Reset Routes
router.post('/send-otp', adminController.sendAdminOtp);
router.post('/reset-password', adminController.resetAdminPassword);

module.exports = router;
