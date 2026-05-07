const Admin = require('../models/Admin');
const Blacklist = require('../models/Blacklist');
const Otp = require('../models/Otp');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendEmail } = require('../utils/emailService');

exports.registerAdmin = async (req, res) => {
    try {
        const { name, email, password, number, address, business } = req.body;
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) return res.status(400).json({ message: 'Admin already exists' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newAdmin = new Admin({
            name, email, password: hashedPassword, number, address, business
        });

        await newAdmin.save();
        res.status(201).json({ message: 'Admin registered successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = await Admin.findOne({ email });
        if (!admin) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET_KEY, { expiresIn: '24h' });

        admin.lastlogin = new Date();
        await admin.save();

        res.json({
            token,
            admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                profileimg: admin.profileimg,
                status: admin.status
            }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.logoutAdmin = async (req, res) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (token) {
            const blacklistedToken = new Blacklist({ token });
            await blacklistedToken.save();
        }
        res.json({ message: 'Logged out successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getAdminProfile = async (req, res) => {
    try {
        const admin = await Admin.findById(req.adminId).select('-password');
        res.json(admin);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateAdminProfile = async (req, res) => {
    try {
        const updates = req.body;
        if (req.file) {
            updates.profileimg = req.file.location; 
        }
        const admin = await Admin.findByIdAndUpdate(req.adminId, updates, { new: true }).select('-password');
        res.json(admin);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.sendAdminOtp = async (req, res) => {
    try {
        const { email, name } = req.body;
        if (!email) return res.status(400).json({ message: 'Email is required' });

        const admin = await Admin.findOne({ email });
        if (!admin) return res.status(404).json({ message: 'Admin with this email does not exist' });

        if (name && admin.name.toLowerCase() !== name.toLowerCase()) {
            return res.status(400).json({ message: 'The name provided does not match our records' });
        }

        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        await Otp.deleteMany({ email });

        const newOtp = new Otp({ email, otp: otpCode, isVerified: false });
        await newOtp.save();

        const html = `
            <div style="font-family:Arial,sans-serif;max-width:400px;margin:auto;padding:40px 30px;text-align:center;background:#fff;">
                <p style="font-size:13px;color:#999;letter-spacing:3px;text-transform:uppercase;margin-bottom:4px;">MADEENA RESTAURANT</p>
                <p style="font-size:13px;color:#555;margin:0 0 30px;">Your password reset verification code</p>
                <div style="background:#8B3B3B;border-radius:16px;padding:24px 36px;display:inline-block;margin-bottom:24px;">
                    <span style="font-size:48px;font-weight:700;letter-spacing:16px;color:#fff;font-family:'Courier New',monospace;">${otpCode}</span>
                </div>
                <p style="font-size:12px;color:#aaa;margin:0;">Expires in <strong>10 minutes</strong>. Do not share this code.</p>
            </div>
        `;

        await sendEmail(email, 'Password Reset OTP', `Your OTP is: ${otpCode}`, html);

        res.status(200).json({ message: 'OTP sent successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.resetAdminPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        if (!email || !otp || !newPassword) {
            return res.status(400).json({ message: 'Email, OTP and new password are required' });
        }

        const existingOtp = await Otp.findOne({ email, otp });
        if (!existingOtp) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        const admin = await Admin.findOne({ email });
        if (!admin) return res.status(404).json({ message: 'Admin not found' });

        const salt = await bcrypt.genSalt(10);
        admin.password = await bcrypt.hash(newPassword, salt);
        await admin.save();

        await Otp.deleteMany({ email });

        res.status(200).json({ message: 'Password updated successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
