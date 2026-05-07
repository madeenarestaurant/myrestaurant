const jwt = require('jsonwebtoken');
const Blacklist = require('../models/Blacklist');

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ message: 'No authentication token, authorization denied' });
        }

        const isBlacklisted = await Blacklist.findOne({ token });
        if (isBlacklisted) {
            return res.status(401).json({ message: 'Token is invalid (blacklisted). Please login again.' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.adminId = decoded.id;
        req.token = token;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

module.exports = authMiddleware;
