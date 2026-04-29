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
            
            const modeMessages = {
                'dine-in': "Please find a comfortable table. Our staff will serve you shortly at your table.",
                'take-away': "Your order is being packed. You can come to restaurant and collect it",
                'delivery': "Sit back and relax! Our delivery partner will be at your doorstep soon."
            };

            const html = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; background-color: #ffffff;">
                    <div style="text-align: center; padding-bottom: 20px;">
                        <h2 style="color: #8C231F; margin: 0; font-size: 24px; text-transform: uppercase; letter-spacing: 2px;">Order Confirmed</h2>
                        <p style="color: #666; font-size: 12px; margin-top: 5px;">Thank you for choosing Madeena Restaurant</p>
                    </div>
                    
                    <div style="background: #fdfdfd; border: 1px solid #f0f0f0; padding: 20px; border-radius: 15px; margin: 20px 0; text-align: center;">
                        <p style="margin: 0; font-size: 12px; color: #888; text-transform: uppercase; letter-spacing: 1px;">Your Order Token</p>
                        <h1 style="margin: 10px 0; font-size: 48px; color: #333; letter-spacing: -2px;">${token}</h1>
                        <p style="margin: 0; font-size: 14px; color: #555; font-weight: bold;">${modeMessages[mode] || "Your delicacy is being prepared."}</p>
                    </div>

                    <div style="color: #444; line-height: 1.6; font-size: 14px;">
                        <p>Hi <strong>${customerName || 'Valued Guest'}</strong>,</p>
                        <p>We've received your request and our chefs have started preparing your selection. We'll keep you updated on the status.</p>
                        
                        <div style="margin-top: 25px; padding: 15px; background-color: #f9f9f9; border-radius: 10px; border-left: 4px solid #8C231F;">
                            <p style="margin: 0; font-weight: bold; color: #333;">Need to make updates or contact us?</p>
                            <p style="margin: 5px 0; color: #555;">📞 Phone: <strong>95945674</strong></p>
                            <p style="margin: 5px 0; color: #555;">📍 Location: Ruwi, Near Badr Al Samaa Hospital, Muscat</p>
                            <p style="margin: 5px 0; color: #555;">📧 Email: <a href="madeenarestaurantoman@gmail.com" style="color: #8C231F; text-decoration: none;">madeenarestaurantoman@gmail.com</a></p>
                        </div>
                    </div>

                    <hr style="border: 0; border-top: 1px solid #eee; margin: 25px 0;">
                    
                    <div style="text-align: center; font-size: 12px; color: #999;">
                        <p style="margin: 0;">Madeena Restaurant & Cafe</p>
                        <p style="margin: 5px 0;">Salalah, Oman</p>
                    </div>
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
