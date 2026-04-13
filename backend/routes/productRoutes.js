const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', productController.getProducts);
router.get('/:id', productController.getProductById);
router.post('/', auth, upload.single('img'), productController.createProduct);
router.put('/:id', auth, upload.single('img'), productController.updateProduct);
router.delete('/:id', auth, productController.deleteProduct);

module.exports = router;
