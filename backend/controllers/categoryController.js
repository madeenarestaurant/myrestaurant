const Category = require('../models/Category');
const { generateSignedUrl } = require('../utils/s3Utils');

exports.createCategory = async (req, res) => {
    try {
        const { name, description, status } = req.body;
        const img = req.file ? req.file.location : null;

        const newCategory = new Category({ name, description, status, img });
        await newCategory.save();
        
        const obj = newCategory.toObject();
        obj.img = await generateSignedUrl(obj.img);
        
        res.status(201).json(obj);
    } catch (err) {
        console.error('Error in createCategory:', err);
        res.status(500).json({ message: err.message });
    }
};

exports.getCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        
        const categoriesWithSignedUrls = await Promise.all(categories.map(async (c) => {
            const obj = c.toObject();
            obj.img = await generateSignedUrl(obj.img);
            return obj;
        }));
        
        res.json(categoriesWithSignedUrls);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getCategoryById = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) return res.status(404).json({ message: 'Category not found' });
        
        const obj = category.toObject();
        obj.img = await generateSignedUrl(obj.img);
        
        res.json(obj);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateCategory = async (req, res) => {
    try {
        const updates = req.body;
        if (req.file) {
            updates.img = req.file.location;
        }
        const category = await Category.findByIdAndUpdate(req.params.id, updates, { new: true });
        if (!category) return res.status(404).json({ message: 'Category not found' });
        
        const obj = category.toObject();
        obj.img = await generateSignedUrl(obj.img);
        
        res.json(obj);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);
        if (!category) return res.status(404).json({ message: 'Category not found' });
        res.json({ message: 'Category deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
