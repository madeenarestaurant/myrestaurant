import React, { useState, useEffect } from 'react';
import useAdminStore from '../store/useAdminStore';
import ProductCard from '../components/products/ProductCard';
import CategoryCard from '../components/products/CategoryCard';
import { FiSearch, FiPlus, FiX, FiLoader, FiBox, FiLayers, FiUpload, FiCheck, FiTrash2 } from 'react-icons/fi';
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
    updateCategory,
    deleteProduct,
    deleteCategory
  } = useAdminStore();

  const [activeMode, setActiveMode] = useState('products'); // 'products' or 'categories'
  const [showDrawer, setShowDrawer] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'success' });
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

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
        category: item.category && typeof item.category === 'object' ? item.category._id : (item.category || ''),
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

    const nameToCheck = formData.name.trim().toLowerCase();
    if (activeMode === 'products') {
        const isDuplicate = products.some(p => p.name.toLowerCase() === nameToCheck && (!editingItem || p._id !== editingItem._id));
        if (isDuplicate) {
            setToast({ message: 'Product with this name already exists', type: 'error' });
            return;
        }
    } else {
        const isDuplicate = categories.some(c => c.name.toLowerCase() === nameToCheck && (!editingItem || c._id !== editingItem._id));
        if (isDuplicate) {
            setToast({ message: 'Category with this name already exists', type: 'error' });
            return;
        }
    }

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
        result = activeMode === 'products' 
            ? await updateProduct(editingItem._id, data) 
            : await updateCategory(editingItem._id, data);
    } else {
        result = activeMode === 'products' 
            ? await createProduct(data) 
            : await createCategory(data);
    }

    if (result.success) {
        setToast({ message: `${activeMode === 'products' ? 'Product' : 'Category'} saved!`, type: 'success' });
        setShowDrawer(false);
        resetForm();
    } else {
        setToast({ message: result.error || 'Operation failed', type: 'error' });
    }
    setLoading(false);
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || 
                           (p.category && typeof p.category === 'object' ? p.category._id : p.category) === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredCategories = categories.filter(c => 
    c.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-10">
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />

      {/* Header Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex bg-gray-100 p-1.5 rounded-[2.2rem] w-fit shadow-inner">
            <button 
                onClick={() => { setActiveMode('products'); setSearch(''); setSelectedCategory('All'); }}
                className={clsx(
                    "px-8 py-3 rounded-[2rem] font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-3",
                    activeMode === 'products' ? "bg-white text-[#8B3B3B] shadow-sm" : "text-gray-400 hover:text-gray-600"
                )}
            >
                <FiBox size={14} /> Products
            </button>
            <button 
                onClick={() => { setActiveMode('categories'); setSearch(''); }}
                className={clsx(
                    "px-8 py-3 rounded-[2rem] font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-3",
                    activeMode === 'categories' ? "bg-white text-[#8B3B3B] shadow-sm" : "text-gray-400 hover:text-gray-600"
                )}
            >
                <FiLayers size={14} /> Categories
            </button>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-72">
                <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                <input 
                    type="text" 
                    placeholder={`Search ${activeMode}...`} 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-white border border-gray-100 rounded-2xl py-3 pl-12 pr-6 text-sm font-bold shadow-sm outline-none focus:ring-2 focus:ring-[#8B3B3B]/10 transition-all" 
                />
            </div>
            <button onClick={() => handleOpenDrawer()} className="p-3.5 brand-gradient text-white rounded-2xl shadow-xl flex items-center justify-center hover:scale-[1.05] active:scale-[0.95] transition-all">
                <FiPlus size={20} />
            </button>
        </div>
      </div>

      {/* Category Pills */}
      <AnimatePresence>
        {activeMode === 'products' && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            <FilterPill label="All" count={products.length} active={selectedCategory === 'All'} onClick={() => setSelectedCategory('All')} />
            {categories.map(cat => {
              const catProductCount = products.filter(p => (p.category && typeof p.category === 'object' ? p.category._id : p.category) === cat._id).length;
              return (
                <FilterPill key={cat._id} label={cat.name} count={catProductCount} active={selectedCategory === cat._id} onClick={() => setSelectedCategory(cat._id)} />
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col lg:flex-row gap-8 items-start relative">
        {/* Creation Form - Responsive */}
        <AnimatePresence>
            {showDrawer && (
                <motion.div 
                    initial={{ opacity: 0, y: -20, x: 20 }} animate={{ opacity: 1, y: 0, x: 0 }} exit={{ opacity: 0, y: -20, x: 20 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    className={clsx(
                        "bg-white z-40 flex flex-col transition-all duration-300",
                        "relative w-full mb-8 rounded-[2.5rem] border border-gray-100 shadow-xl", // Mobile View
                        "lg:fixed lg:top-20 lg:right-0 lg:bottom-0 lg:w-[480px] lg:mb-0 lg:rounded-none lg:border-l lg:shadow-[-20px_0_40px_rgba(0,0,0,0.05)]" // Desktop View
                    )}
                >
                    <div className="p-6 sm:p-10 flex justify-between items-center border-b border-gray-50 bg-gray-50/20 rounded-t-[2.5rem] lg:rounded-none">
                        <div>
                            <h3 className="text-xl sm:text-2xl font-black text-gray-800 tracking-tighter">
                                {editingItem ? 'Update Item' : `Create ${activeMode === 'products' ? 'Product' : 'Category'}`}
                            </h3>
                            <p className="text-[10px] sm:text-[11px] font-black text-gray-400 uppercase tracking-widest mt-1 opacity-50">
                                {editingItem ? 'Edit existing record' : 'Add new entry to database'}
                            </p>
                        </div>
                        <button onClick={() => setShowDrawer(false)} className="p-3 bg-white hover:bg-rose-50 hover:text-rose-500 rounded-2xl shadow-sm transition-all border border-gray-100">
                            <FiX size={18} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="flex-1 p-6 sm:p-10 space-y-8 lg:overflow-y-auto custom-scrollbar">
                        {/* Image Upload */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Cover Image</label>
                            <label className="h-44 border-2 border-dashed border-gray-100 rounded-[2rem] flex flex-col items-center justify-center gap-3 bg-gray-50/50 hover:bg-gray-50 hover:border-[#8B3B3B]/20 transition-all cursor-pointer group overflow-hidden relative">
                                {imagePreview ? (
                                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                                ) : (
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="p-4 bg-white rounded-2xl shadow-sm text-gray-300 group-hover:text-[#8B3B3B] transition-colors">
                                            <FiUpload size={24} />
                                        </div>
                                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Select Image</p>
                                    </div>
                                )}
                                <input type="file" onChange={handleImageChange} className="hidden" accept="image/*" />
                            </label>
                        </div>

                        {/* Text Fields */}
                        <div className="space-y-6">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Entry Name</label>
                                <input name="name" value={formData.name} onChange={handleInputChange} className="w-full bg-gray-50/50 border-2 border-transparent focus:border-[#8B3B3B]/10 rounded-2xl p-4 text-sm font-bold outline-none transition-all placeholder:text-gray-300" placeholder="e.g. Signature Biryani" required />
                            </div>

                            {activeMode === 'products' && (
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Price (₹)</label>
                                        <input name="price" type="number" value={formData.price} onChange={handleInputChange} className="w-full bg-gray-50/50 border-2 border-transparent focus:border-[#8B3B3B]/10 rounded-2xl p-4 text-sm font-bold outline-none" placeholder="0" required />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Category</label>
                                        <select name="category" value={formData.category} onChange={handleInputChange} className="w-full bg-gray-50/50 border-2 border-transparent focus:border-[#8B3B3B]/10 rounded-2xl p-4 text-sm font-bold outline-none appearance-none cursor-pointer" required>
                                            <option value="">Choose...</option>
                                            {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
                                        </select>
                                    </div>
                                </div>
                            )}

                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Description</label>
                                <textarea name="description" value={formData.description} onChange={handleInputChange} rows="3" className="w-full bg-gray-50/50 border-2 border-transparent focus:border-[#8B3B3B]/10 rounded-2xl p-4 text-sm font-bold outline-none resize-none transition-all placeholder:text-gray-300" placeholder="Brief details about this entry..." required />
                            </div>
                        </div>

                        {/* Submit */}
                        <div className="pt-4 flex gap-3">
                            {editingItem && (
                                <button 
                                    type="button"
                                    onClick={async () => {
                                        if (window.confirm(`Delete ${editingItem.name}?`)) {
                                            const res = activeMode === 'products' 
                                                ? await deleteProduct(editingItem._id)
                                                : await deleteCategory(editingItem._id);
                                            if (res && !res.success) {
                                                alert(res.error || 'Failed to delete');
                                            } else {
                                                setShowDrawer(false);
                                                resetForm();
                                                setToast({ message: `${activeMode === 'products' ? 'Product' : 'Category'} deleted!`, type: 'success' });
                                            }
                                        }
                                    }}
                                    className="px-6 py-5 bg-rose-50 hover:bg-rose-100 text-rose-500 rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.2em] shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center"
                                    title="Delete"
                                >
                                    <FiTrash2 size={18} />
                                </button>
                            )}
                            <button type="submit" disabled={loading} className="flex-1 py-5 brand-gradient text-white rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-[#8B3B3B]/15 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3">
                                {loading ? <FiLoader className="animate-spin" /> : editingItem ? <><FiCheck /> Update Details</> : <><FiPlus /> Save to Cloud</>}
                            </button>
                        </div>
                    </form>
                </motion.div>
            )}
        </AnimatePresence>

        {/* Grid Area */}
        <div className={clsx(
            "transition-all duration-500",
            showDrawer ? "lg:w-[calc(100%-480px)]" : "w-full"
        )}>
            <div className={clsx("transition-all duration-500", showDrawer && "lg:scale-[0.98] origin-top-left")}>
                <AnimatePresence mode="popLayout text-center">
                    {activeMode === 'products' ? (
                        <div className={clsx(
                            "grid gap-6 transition-all duration-500",
                            showDrawer ? "grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4" : "grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6"
                        )}>
                            {filteredProducts.length > 0 ? filteredProducts.map(p => (
                                <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} key={p._id}>
                                    <ProductCard product={p} onEdit={handleOpenDrawer} />
                                </motion.div>
                            )) : <NoItems msg="No dishes found" />}
                        </div>
                    ) : (
                        <div className={clsx(
                            "grid gap-6 transition-all duration-500",
                            showDrawer ? "grid-cols-1 xl:grid-cols-2" : "grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
                        )}>
                            {filteredCategories.length > 0 ? filteredCategories.map(c => (
                                <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} key={c._id}>
                                    <CategoryCard category={c} onEdit={handleOpenDrawer} />
                                </motion.div>
                            )) : <NoItems msg="No categories found" />}
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
      </div>
    </div>
  );
};

const FilterPill = ({ label, count, active, onClick }) => (
    <button
        onClick={onClick}
        className={clsx(
            "flex items-center gap-2 px-6 py-2.5 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all whitespace-nowrap border-2",
            active ? "bg-[#8B3B3B] border-[#8B3B3B] text-white shadow-lg" : "bg-white border-gray-50 text-gray-400 hover:border-gray-100"
        )}
    >
        <span>{label}</span>
        {count !== undefined && (
            <span className={clsx(
                "px-2 py-0.5 rounded-full text-[8px]",
                active ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"
            )}>
                {count}
            </span>
        )}
    </button>
);

const NoItems = ({ msg }) => (
    <div className="col-span-full py-40 border-2 border-dashed border-gray-100 rounded-[3rem] flex flex-col items-center justify-center text-gray-300">
        <FiBox size={48} className="mb-4 opacity-10" />
        <p className="font-black uppercase tracking-widest text-[10px] italic">{msg}</p>
    </div>
);

export default Products;
