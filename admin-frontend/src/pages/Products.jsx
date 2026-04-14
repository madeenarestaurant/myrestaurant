import React, { useState, useEffect } from 'react';
import useAdminStore from '../store/useAdminStore';
import ProductCard from '../components/products/ProductCard';
import CategoryCard from '../components/products/CategoryCard';
import { FiSearch, FiPlus, FiX, FiLoader, FiImage, FiTag, FiBox, FiLayers } from 'react-icons/fi';
import Toast from '../components/common/Toast';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';

const Products = () => {
  const { 
    products, 
    categories, 
    fetchStats, 
    createProduct, 
    updateProduct, 
    createCategory, 
    updateCategory 
  } = useAdminStore();

  const [activeMode, setActiveMode] = useState('products'); // 'products' or 'categories'
  const [showDrawer, setShowDrawer] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'success' });
  const [search, setSearch] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
    status: 'available',
    isFeatured: false
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      description: '',
      category: '',
      status: 'available',
      isFeatured: false
    });
    setEditingItem(null);
    setImageFile(null);
    setImagePreview(null);
  };

  const handleOpenDrawer = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        name: item.name || '',
        price: item.price || '',
        description: item.description || '',
        category: typeof item.category === 'object' ? item.category._id : (item.category || ''),
        status: item.status || 'available',
        isFeatured: item.isFeatured || false
      });
      setImagePreview(item.img || null);
    } else {
      resetForm();
    }
    setShowDrawer(true);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append('name', formData.name);
    if (activeMode === 'products') {
        data.append('price', formData.price);
        data.append('category', formData.category);
        data.append('isFeatured', formData.isFeatured);
    }
    data.append('description', formData.description);
    data.append('status', formData.status);
    if (imageFile) data.append('img', imageFile);

    let result;
    if (editingItem) {
        if (activeMode === 'products') {
            result = await updateProduct(editingItem._id, data);
        } else {
            result = await updateCategory(editingItem._id, data);
        }
    } else {
        if (activeMode === 'products') {
            result = await createProduct(data);
        } else {
            result = await createCategory(data);
        }
    }

    if (result.success) {
        setToast({ message: `${activeMode === 'products' ? 'Product' : 'Category'} ${editingItem ? 'updated' : 'created'}!`, type: 'success' });
        setShowDrawer(false);
        resetForm();
    } else {
        setToast({ message: result.error || 'Operation failed', type: 'error' });
    }
    setLoading(false);
  };

  const filteredProducts = products.filter(p => 
    p.name?.toLowerCase().includes(search.toLowerCase())
  );

  const filteredCategories = categories.filter(c => 
    c.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-10">
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />

      {/* Header & Main Tabs */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex bg-gray-100 p-1.5 rounded-[2rem] w-fit shadow-inner">
            <button 
                onClick={() => { setActiveMode('products'); setSearch(''); }}
                className={clsx(
                    "px-8 py-3 rounded-[1.8rem] font-black text-xs uppercase tracking-widest transition-all flex items-center gap-3",
                    activeMode === 'products' ? "bg-white text-[#8B3B3B] shadow-sm" : "text-gray-400 hover:text-gray-600"
                )}
            >
                <FiBox size={16} /> Products
            </button>
            <button 
                onClick={() => { setActiveMode('categories'); setSearch(''); }}
                className={clsx(
                    "px-8 py-3 rounded-[1.8rem] font-black text-xs uppercase tracking-widest transition-all flex items-center gap-3",
                    activeMode === 'categories' ? "bg-white text-[#8B3B3B] shadow-sm" : "text-gray-400 hover:text-gray-600"
                )}
            >
                <FiLayers size={16} /> Categories
            </button>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-72">
                <FiSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                <input 
                    type="text" 
                    placeholder={`Search ${activeMode}...`} 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-white border border-gray-100 rounded-2xl py-3.5 pl-14 pr-6 text-sm font-bold shadow-sm focus:ring-2 focus:ring-[#8B3B3B]/10 outline-none transition-all" 
                />
            </div>
            <button 
                onClick={() => handleOpenDrawer()}
                className="px-6 py-3.5 brand-gradient text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all shrink-0"
            >
              <FiPlus size={20} />
              <span className="hidden sm:inline">Add {activeMode === 'products' ? 'Product' : 'Category'}</span>
            </button>
        </div>
      </div>

      {/* Items Grid */}
      <div className={clsx(
          "grid gap-6",
          activeMode === 'products' 
            ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6" 
            : "grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
      )}>
        <AnimatePresence mode="popLayout">
            {activeMode === 'products' ? (
                filteredProducts.length > 0 ? filteredProducts.map(product => (
                    <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} key={product._id}>
                        <ProductCard product={product} onEdit={handleOpenDrawer} />
                    </motion.div>
                )) : (
                    <NoItems msg="No dishes found" />
                )
            ) : (
                filteredCategories.length > 0 ? filteredCategories.map(cat => (
                    <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} key={cat._id}>
                        <CategoryCard category={cat} onEdit={handleOpenDrawer} />
                    </motion.div>
                )) : (
                    <NoItems msg="No categories found" />
                )
            )}
        </AnimatePresence>
      </div>

      {/* Slide-over Drawer Form */}
      <AnimatePresence>
        {showDrawer && (
            <>
                <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    onClick={() => setShowDrawer(false)}
                    className="fixed inset-0 bg-[#8B3B3B]/10 backdrop-blur-sm z-[100]" 
                />
                <motion.div 
                    initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    className="fixed top-0 right-0 bottom-0 w-full max-w-[450px] bg-white z-[101] shadow-2xl flex flex-col"
                >
                    <div className="p-8 flex justify-between items-center border-b border-gray-50 bg-gray-50/50">
                        <div>
                            <h3 className="text-xl font-black text-gray-800 tracking-tighter">
                                {editingItem ? `Update ${activeMode === 'products' ? 'Dish' : 'Menu'}` : `New ${activeMode === 'products' ? 'Dish' : 'Menu'}`}
                            </h3>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                                {editingItem ? 'Modify existing details' : 'List a new entry'}
                            </p>
                        </div>
                        <button onClick={() => setShowDrawer(false)} className="p-3 bg-white hover:bg-rose-50 hover:text-rose-500 rounded-xl shadow-sm transition-all">
                            <FiX size={20} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Cover Image</label>
                            <label className="h-44 border-2 border-dashed border-gray-200 rounded-[2rem] flex flex-col items-center justify-center gap-3 bg-gray-50 hover:bg-gray-100 hover:border-[#8B3B3B]/20 transition-all cursor-pointer group overflow-hidden relative">
                                {imagePreview ? (
                                    <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
                                ) : (
                                    <>
                                        <div className="p-3 bg-white rounded-xl shadow-sm text-gray-400 group-hover:text-[#8B3B3B] transition-all">
                                            <FiImage size={24} />
                                        </div>
                                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Select photo</span>
                                    </>
                                )}
                                <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                            </label>
                            {imagePreview && (
                                <button type="button" onClick={() => { setImageFile(null); setImagePreview(null); }} className="text-[9px] font-black text-rose-500 uppercase tracking-widest ml-1 hover:underline">Remove image</button>
                            )}
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Name</label>
                            <input name="name" value={formData.name} onChange={handleInputChange} type="text" placeholder={`e.g. ${activeMode === 'products' ? 'Classic Burger' : 'Italian Cuisine'}`} className="w-full bg-gray-50 border-2 border-transparent focus:border-[#8B3B3B]/20 rounded-2xl p-4 text-sm font-bold outline-none transition-all placeholder:text-gray-300" required />
                        </div>

                        {activeMode === 'products' && (
                            <>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Price (₹)</label>
                                        <input name="price" value={formData.price} onChange={handleInputChange} type="number" placeholder="0" className="w-full bg-gray-50 border-2 border-transparent focus:border-[#8B3B3B]/20 rounded-2xl p-4 text-sm font-bold outline-none transition-all placeholder:text-gray-300" required />
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Category</label>
                                        <div className="relative">
                                            <select name="category" value={formData.category} onChange={handleInputChange} className="w-full bg-gray-50 border-2 border-transparent focus:border-[#8B3B3B]/20 rounded-2xl p-4 text-sm font-bold outline-none appearance-none cursor-pointer" required>
                                                <option value="">Select Category</option>
                                                {categories.map(cat => (
                                                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                                                ))}
                                            </select>
                                            <FiTag className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl">
                                    <input type="checkbox" id="isFeatured" name="isFeatured" checked={formData.isFeatured} onChange={handleInputChange} className="w-5 h-5 accent-[#8B3B3B] cursor-pointer" />
                                    <label htmlFor="isFeatured" className="text-xs font-bold text-gray-600 cursor-pointer">Featured item (Show on top)</label>
                                </div>
                            </>
                        )}

                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Status</label>
                            <select name="status" value={formData.status} onChange={handleInputChange} className="w-full bg-gray-50 border-2 border-transparent focus:border-[#8B3B3B]/20 rounded-2xl p-4 text-sm font-bold outline-none appearance-none cursor-pointer">
                                <option value="available">In Stock / Active</option>
                                <option value="out of stock">Out of Stock / Inactive</option>
                            </select>
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Description</label>
                            <textarea name="description" value={formData.description} onChange={handleInputChange} rows="3" placeholder="Brief details about this entry..." className="w-full bg-gray-50 border-2 border-transparent focus:border-[#8B3B3B]/20 rounded-[1.5rem] p-5 text-sm font-medium outline-none resize-none transition-all placeholder:text-gray-300"></textarea>
                        </div>
                    </form>

                    <div className="p-8 border-t border-gray-50 bg-gray-50/30">
                        <button 
                            onClick={handleSubmit}
                            disabled={loading} 
                            className="w-full py-4 brand-gradient text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-[#8B3B3B]/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                        >
                            {loading ? <FiLoader className="animate-spin" /> : editingItem ? 'Update Changes' : `Create ${activeMode === 'products' ? 'Product' : 'Category'}`}
                        </button>
                    </div>
                </motion.div>
            </>
        )}
      </AnimatePresence>
    </div>
  );
};

const NoItems = ({ msg }) => (
    <div className="col-span-full py-32 bg-white rounded-[2.5rem] border border-dashed border-gray-100 flex flex-col items-center justify-center text-gray-300">
        <FiBox size={48} className="mb-4 opacity-10" />
        <p className="font-black uppercase tracking-widest text-xs italic">{msg}</p>
    </div>
);

export default Products;
