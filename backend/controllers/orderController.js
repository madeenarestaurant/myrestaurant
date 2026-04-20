const Order = require('../models/Order');
const Visitor = require('../models/Visitor');

exports.createOrder = async (req, res) => {
    try {
        const { 
            customerName, email, phone, address, addressDetails, items, 
            totalAmount, note, visitorId, mode, paymentMethod 
        } = req.body;

        const newOrder = new Order({
            customerName, email, phone, address, addressDetails, 
            items, totalAmount, note, mode, paymentMethod, status: 'requested'
        });
        await newOrder.save();


        // Link to Visitor if ID provided
        if (visitorId) {
            await Visitor.findOneAndUpdate(
                { visitorId },
                { $push: { orders: newOrder._id } }
            );
        }
        
        // Emit socket event for real-time update

        if (req.io) {
            req.io.emit('new_order', newOrder);
        }

        // Here you could add logic to send an email notification to admin
        res.status(201).json(newOrder);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate('items.product').sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('items.product');
        if (!order) return res.status(404).json({ message: 'Order not found' });
        res.json(order);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
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
