const Order = require('../models/Order');
const Visitor = require('../models/Visitor');
const Notification = require('../models/Notification');
const { sendEmail } = require('../utils/emailService');

exports.createOrder = async (req, res) => {
    try {
        const { 
            customerName, email, phone, address, addressDetails, items, 
            totalAmount, note, visitorId, mode, paymentMethod 
        } = req.body;

        // Generate 4-digit token
        const token = Math.floor(1000 + Math.random() * 9000).toString();

        const newOrder = new Order({
            customerName, email, phone, address, addressDetails, 
            items, totalAmount, note, mode, paymentMethod, status: 'requested',
            token
        });
        await newOrder.save();

        // Link to Visitor if ID provided
        if (visitorId) {
            await Visitor.findOneAndUpdate(
                { visitorId },
                { $push: { orders: newOrder._id } }
            );
        }
        
        // Create Notification
        const notification = new Notification({
            type: 'order',
            message: `New order from ${customerName || 'Customer'} - Token: ${token}`,
            relatedId: newOrder._id
        });
        await notification.save();

        // Populate for socket emission
        const populatedOrder = await Order.findById(newOrder._id).populate({
            path: 'items.product',
            populate: { path: 'category' }
        });

        // Emit socket events
        if (req.io) {
            req.io.emit('new_order', populatedOrder);
            req.io.emit('new_notification', notification);
        }

        // Send confirmation email to user
        if (email) {
            const subject = 'Order Received - Madeena Restaurant';
            const html = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px;">
                    <h2 style="color: #333;">Order Received!</h2>
                    <p>Hi ${customerName || 'Customer'},</p>
                    <p>Thank you for your order. Your request has been received and is waiting for confirmation.</p>
                    <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
                        <p style="margin: 0; font-size: 18px;"><strong>Unique Token:</strong> <span style="color: #e67e22; font-size: 24px;">${token}</span></p>
                    </div>
                    <p>Please wait for further updates on your order status.</p>
                    <hr>
                    <p style="font-size: 12px; color: #888;">Madeena Restaurant Team</p>
                </div>
            `;
            try {
                await sendEmail(email, subject, '', html);
            } catch (err) {
                console.error('Email sending failed:', err);
            }
        }

        res.status(201).json(newOrder);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate({
                path: 'items.product',
                populate: { path: 'category' }
            })
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate({
                path: 'items.product',
                populate: { path: 'category' }
            });
        if (!order) return res.status(404).json({ message: 'Order not found' });
        res.json(order);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateOrderStatus = async (req, res) => {
    try {
        const { status, paymentStatus } = req.body;
        const updateData = {};
        if (status) updateData.status = status;
        if (paymentStatus) updateData.paymentStatus = paymentStatus;

        const order = await Order.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!order) return res.status(404).json({ message: 'Order not found' });
        res.json(order);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.deleteOrder = async (req, res) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);
        if (!order) return res.status(404).json({ message: 'Order not found' });
        res.json({ message: 'Order deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
