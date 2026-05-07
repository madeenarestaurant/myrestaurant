const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const auth = require('../middleware/auth');

router.post('/', orderController.createOrder); 
router.get('/', auth, orderController.getOrders);
router.get('/:id', auth, orderController.getOrderById);
router.put('/:id', auth, orderController.updateOrderStatus);
router.delete('/:id', auth, orderController.deleteOrder);

module.exports = router;
