const Product = require('../models/Product');
const { generateSignedUrl } = require('../utils/s3Utils');

exports.createProduct = async (req, res) => {
    try {
        const { name, description, price, category, status, isFeatured } = req.body;
        const img = req.file ? req.file.location : null;

        const newProduct = new Product({
            name, description, price, category, status, isFeatured, img
        });
        await newProduct.save();
        
        // Generate signed URL for response
        const productObj = newProduct.toObject();
        productObj.img = await generateSignedUrl(productObj.img);
        
        res.status(201).json(productObj);
    } catch (err) {
        console.error('Error in createProduct:', err);
        res.status(500).json({ message: err.message });
    }
};

exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find().populate('category');
        
        // Generate signed URLs for all products
        const productsWithSignedUrls = await Promise.all(products.map(async (p) => {
            const obj = p.toObject();
            obj.img = await generateSignedUrl(obj.img);
            if (obj.category && obj.category.img) {
                obj.category.img = await generateSignedUrl(obj.category.img);
            }
            return obj;
        }));
        
        res.json(productsWithSignedUrls);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('category');
        if (!product) return res.status(404).json({ message: 'Product not found' });
        
        const obj = product.toObject();
        obj.img = await generateSignedUrl(obj.img);
        if (obj.category && obj.category.img) {
            obj.category.img = await generateSignedUrl(obj.category.img);
        }
        
        res.json(obj);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const updates = req.body;
        if (req.file) {
            updates.img = req.file.location;
        }
        const product = await Product.findByIdAndUpdate(req.params.id, updates, { new: true }).populate('category');
        if (!product) return res.status(404).json({ message: 'Product not found' });
        
        const obj = product.toObject();
        obj.img = await generateSignedUrl(obj.img);
        
        res.json(obj);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json({ message: 'Product deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
