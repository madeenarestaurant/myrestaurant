import React, { useState, useEffect } from 'react';
import ProductCard from '../components/products/ProductCard';
import useAdminStore from '../store/useAdminStore';
import { FiSearch, FiPlus, FiFilter, FiImage, FiX, FiLoader, FiTag } from 'react-icons/fi';
import axiosInstance from '../api/axiosInstance';
import Toast from '../components/common/Toast';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';

const Products = () => {
  const { products, categories, fetchStats } = useAdminStore();
  const [showAddForm, setShowAddForm] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'success' });
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
    isFeatured: false,
    status: 'available'
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const data = new FormData();
    data.append('name', formData.name);
    data.append('price', formData.price);
    data.append('description', formData.description);
    data.append('category', formData.category);
    data.append('isFeatured', formData.isFeatured);
    data.append('status', formData.status);
    if (imageFile) data.append('img', imageFile);

    try {
        await axiosInstance.post('/products', data, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        setToast({ message: 'Product added successfully!', type: 'success' });
        setShowAddForm(false);
        fetchStats(); 
        resetForm();
    } catch (err) {
        setToast({ message: err.response?.data?.message || 'Failed to add product', type: 'error' });
    } finally {
        setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', price: '', description: '', category: '', isFeatured: false, status: 'available' });
    setImageFile(null);
    setImagePreview(null);
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name?.toLowerCase().includes(search.toLowerCase());
    const catId = typeof p.category === 'object' ? p.category._id : p.category;
    const matchesCat = selectedCat === 'all' || catId === selectedCat;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-8 pb-10">
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />

      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
            <h2 className="text-3xl font-black text-gray-800 tracking-tighter">Kitchen Inventory</h2>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Found {products.length} items in your catalog</p>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
                <FiSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                <input 
                    type="text" 
                    placeholder="Search for dishes, items..." 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-white border border-gray-100 rounded-2xl py-3.5 pl-14 pr-6 text-sm font-bold shadow-sm focus:ring-2 focus:ring-[#8B3B3B]/20 outline-none transition-all" 
                />
            </div>
            <button 
                onClick={() => setShowAddForm(true)} 
                className="px-6 py-3.5 brand-gradient text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all shrink-0"
            >
              <FiPlus size={20} />
              <span className="hidden sm:inline">New Item</span>
            </button>
        </div>
      </div>

      {/* Categories Tabs */}
      <div className="flex gap-3 p-2 bg-gray-50 rounded-[2.5rem] w-fit overflow-x-auto max-w-full no-scrollbar">
        <button 
            onClick={() => setSelectedCat('all')}
            className={clsx(
                "px-8 py-2.5 rounded-[2rem] font-bold text-xs uppercase tracking-widest transition-all",
                selectedCat === 'all' ? "bg-white text-[#8B3B3B] shadow-sm" : "text-gray-400 hover:text-gray-600"
            )}
        >
            All Items
        </button>
        {categories.map(cat => (
          <button 
            key={cat._id} 
            onClick={() => setSelectedCat(cat._id)}
            className={clsx(
                "px-8 py-2.5 rounded-[2rem] font-bold text-xs uppercase tracking-widest transition-all shrink-0",
                selectedCat === cat._id ? "bg-white text-[#8B3B3B] shadow-sm" : "text-gray-400 hover:text-gray-600"
            )}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
        {filteredProducts.length > 0 ? filteredProducts.map(product => (
          <ProductCard key={product._id} product={product} />
        )) : (
            <div className="col-span-full py-40 bg-white rounded-[3rem] border-2 border-dashed border-gray-100 flex flex-col items-center justify-center text-gray-300">
                <FiBox size={64} className="mb-4 opacity-10" />
                <p className="font-black uppercase tracking-[0.2em] text-sm">No items matching your criteria</p>
            </div>
        )}
      </div>

      {/* Slide-over Add Form */}
      <AnimatePresence>
        {showAddForm && (
            <>
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setShowAddForm(false)}
                    className="fixed inset-0 bg-brand-dark/40 backdrop-blur-md z-[60]" 
                />
                <motion.div 
                    initial={{ x: '100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '100%' }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    className="fixed top-0 right-0 bottom-0 w-full max-w-[500px] bg-white z-[70] shadow-[-20px_0_50px_rgba(0,0,0,0.1)] flex flex-col"
                >
                    <div className="p-10 flex justify-between items-center border-b border-gray-50">
                        <div>
                            <h3 className="text-2xl font-black text-gray-800 tracking-tighter">Add Dish</h3>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Fill in the details to list a new item</p>
                        </div>
                        <button onClick={() => setShowAddForm(false)} className="p-3 bg-gray-50 hover:bg-rose-50 hover:text-rose-500 rounded-2xl transition-all"><FiX size={24} /></button>
                    </div>

                    <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-10 space-y-8 custom-scrollbar">
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Hero Image</label>
                            <label className="h-56 border-2 border-dashed border-gray-200 rounded-[2rem] flex flex-col items-center justify-center gap-3 bg-gray-50 hover:bg-gray-100/50 transition-all cursor-pointer group overflow-hidden relative">
                                {imagePreview ? (
                                    <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
                                ) : (
                                    <>
                                        <div className="p-4 bg-white rounded-2xl shadow-sm text-gray-400 group-hover:text-[#8B3B3B] group-hover:scale-110 transition-all">
                                            <FiImage size={32} />
                                        </div>
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Tap to upload photo</span>
                                    </>
                                )}
                                <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                            </label>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Item Name</label>
                                <input name="name" value={formData.name} onChange={handleInputChange} type="text" placeholder="e.g. Classic Burger" className="w-full bg-gray-50 border-2 border-transparent focus:border-[#8B3B3B] rounded-2xl p-4 text-sm font-bold outline-none transition-all" required />
                            </div>
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Price (₹)</label>
                                <input name="price" value={formData.price} onChange={handleInputChange} type="number" placeholder="0" className="w-full bg-gray-50 border-2 border-transparent focus:border-[#8B3B3B] rounded-2xl p-4 text-sm font-bold outline-none transition-all" required />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Category</label>
                                <div className="relative">
                                    <select name="category" value={formData.category} onChange={handleInputChange} className="w-full bg-gray-50 border-2 border-transparent focus:border-[#8B3B3B] rounded-2xl p-4 text-sm font-bold outline-none appearance-none cursor-pointer" required>
                                        <option value="">Select Menu</option>
                                        {categories.map(cat => (
                                            <option key={cat._id} value={cat._id}>{cat.name}</option>
                                        ))}
                                    </select>
                                    <FiTag className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Stock Status</label>
                                <select name="status" value={formData.status} onChange={handleInputChange} className="w-full bg-gray-50 border-2 border-transparent focus:border-[#8B3B3B] rounded-2xl p-4 text-sm font-bold outline-none appearance-none cursor-pointer">
                                    <option value="available">In Stock</option>
                                    <option value="out of stock">Sold Out</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Ingredients / Description</label>
                            <textarea name="description" value={formData.description} onChange={handleInputChange} rows="4" placeholder="Briefly describe your dish..." className="w-full bg-gray-50 border-2 border-transparent focus:border-[#8B3B3B] rounded-[2rem] p-6 text-sm font-medium outline-none resize-none transition-all"></textarea>
                        </div>
                        
                        <div className="pt-6">
                            <button type="submit" disabled={loading} className="w-full py-5 brand-gradient text-white rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-xl shadow-[#8B3B3B]/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3">
                                {loading ? <FiLoader className="animate-spin" /> : 'Confirm & Add Dish'}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Products;
