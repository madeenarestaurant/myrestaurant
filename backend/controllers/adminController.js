const Admin = require('../models/Admin');
const Blacklist = require('../models/Blacklist');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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
            updates.profileimg = req.file.location; // S3 URL
        }
        const admin = await Admin.findByIdAndUpdate(req.adminId, updates, { new: true }).select('-password');
        res.json(admin);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
