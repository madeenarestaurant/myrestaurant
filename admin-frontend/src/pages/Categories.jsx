import React, { useState, useEffect } from 'react';
import useAdminStore from '../store/useAdminStore';
import { FiPlus, FiTrash2, FiSearch, FiLayers, FiLoader, FiX } from 'react-icons/fi';
import axiosInstance from '../api/axiosInstance';
import Toast from '../components/common/Toast';
import { motion, AnimatePresence } from 'framer-motion';

const Categories = () => {
  const { categories, fetchStats } = useAdminStore();
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'success' });
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name) return;
    setLoading(true);
    try {
      await axiosInstance.post('/categories', { name });
      setToast({ message: 'Category created!', type: 'success' });
      setName('');
      setShowAdd(false);
      fetchStats();
    } catch (err) {
      setToast({ message: 'Error creating category', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure? This may affect products in this category.')) return;
    try {
      await axiosInstance.delete(`/categories/${id}`);
      setToast({ message: 'Category deleted!', type: 'success' });
      fetchStats();
    } catch (err) {
      setToast({ message: 'Error deleting category', type: 'error' });
    }
  };

  return (
    <div className="space-y-8">
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />

      <div className="flex justify-between items-center">
        <div>
            <h2 className="text-3xl font-black text-gray-800 tracking-tighter">Menu Categories</h2>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Manage your restaurant menu structure</p>
        </div>
        <button 
            onClick={() => setShowAdd(!showAdd)} 
            className="px-6 py-3 brand-gradient text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          {showAdd ? <FiX size={18} /> : <FiPlus size={18} />}
          {showAdd ? 'Cancel' : 'Add Category'}
        </button>
      </div>

      <AnimatePresence>
        {showAdd && (
            <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
            >
                <form onSubmit={handleCreate} className="bg-white p-8 rounded-[2rem] border-2 border-dashed border-[#8B3B3B]/20 flex gap-4 items-center">
                    <div className="flex-1 relative">
                        <FiLayers className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300" />
                        <input 
                            type="text" 
                            placeholder="Type category name (e.g. Italian, Drinks, Desserts)"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-gray-50 border-2 border-transparent focus:border-[#8B3B3B] rounded-2xl py-4 pl-14 pr-8 text-sm font-bold outline-none transition-all"
                        />
                    </div>
                    <button 
                        type="submit" 
                        disabled={loading || !name}
                        className="px-10 py-4 bg-gray-800 text-white rounded-2xl font-black text-xs uppercase tracking-widest disabled:opacity-50 transition-all hover:bg-[#8B3B3B]"
                    >
                        {loading ? <FiLoader className="animate-spin" /> : 'Create Now'}
                    </button>
                </form>
            </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {categories.length > 0 ? categories.map((cat, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            key={cat._id} 
            className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center justify-between group hover:border-[#8B3B3B]/20 hover:shadow-lg transition-all"
          >
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-[#8B3B3B]/5 group-hover:text-[#8B3B3B] transition-colors">
                    <FiLayers size={20} />
                </div>
                <div>
                    <h4 className="font-black text-gray-800 group-hover:text-[#8B3B3B] transition-colors">{cat.name}</h4>
                    <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Active Menu</p>
                </div>
            </div>
            <button 
                onClick={() => handleDelete(cat._id)} 
                className="p-3 text-gray-200 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
            >
              <FiTrash2 size={18} />
            </button>
          </motion.div>
        )) : (
            <div className="col-span-full py-20 bg-gray-50/50 rounded-[3rem] border-2 border-dashed border-gray-100 flex flex-col items-center justify-center text-gray-300">
                <FiLayers size={48} className="mb-4 opacity-20" />
                <p className="font-black uppercase tracking-widest text-xs">No categories found yet</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default Categories;
