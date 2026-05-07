import React from 'react';
import { FiEdit3, FiTrash2, FiLayers, FiCheck, FiX } from 'react-icons/fi';
import { clsx } from 'clsx';
import useAdminStore from '../../store/useAdminStore';
import { motion } from 'framer-motion';

const ProductCard = ({ product, onEdit }) => {
  const { deleteProduct, updateProduct } = useAdminStore();
  const isAvailable = product.status === 'available';

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (window.confirm(`Delete ${product.name}?`)) {
      const res = await deleteProduct(product._id);
      if (res && !res.success) {
        alert(res.error || 'Failed to delete product');
      }
    }
  };

  const toggleAvailability = async (e) => {
    e.stopPropagation();
    const newStatus = isAvailable ? 'out of stock' : 'available';
    const data = new FormData();
    data.append('status', newStatus);
    await updateProduct(product._id, data);
  };

  const categoryName = product.category && typeof product.category === 'object' ? product.category.name : 'Uncategorized';

  return (
    <div
      className={clsx(
        "bg-white rounded-[2rem] border border-gray-100 overflow-hidden group relative transition-all duration-500 hover:shadow-2xl hover:border-[#8B3B3B]/20 p-3 h-full flex flex-col cursor-pointer",
        !isAvailable && "opacity-50 grayscale-[0.8]"
      )}
      onClick={() => onEdit(product)}
    >
      <div className="h-44 rounded-2xl overflow-hidden relative mb-4 bg-gray-50 flex items-center justify-center">
        {product.img ? (
            <img
            src={product.img}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
        ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 text-gray-300">
                <FiLayers size={32} className="mb-2 opacity-20" />
                <span className="text-[10px] font-black uppercase tracking-widest">No Image</span>
            </div>
        )}
        
        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(product); }}
            className="p-2.5 bg-white/95 backdrop-blur-md rounded-xl shadow-lg text-[#8B3B3B] hover:bg-[#8B3B3B] hover:text-white transition-all active:scale-95"
          >
            <FiEdit3 size={14} />
          </button>
          <button
            onClick={handleDelete}
            className="p-2.5 bg-white/95 backdrop-blur-md rounded-xl shadow-lg text-rose-500 hover:bg-rose-50 hover:text-rose-600 transition-all active:scale-95"
          >
            <FiTrash2 size={14} />
          </button>
        </div>

        {/* Category Pill */}
        <div className="absolute inset-x-0 bottom-4 flex justify-center px-4">
          <span className="px-5 py-2.5 bg-gray-800/80 backdrop-blur-md text-white text-[9px] font-black rounded-xl uppercase tracking-[0.1em] border border-white/10 flex items-center gap-2 shadow-lg max-w-[90%] text-center">
            <FiLayers size={10} className="shrink-0" />
            <span className="truncate">{categoryName}</span>
          </span>
        </div>
      </div>

      <div className="px-2 pb-2 flex-1 flex flex-col justify-between">
        <div className="flex justify-between items-start gap-2 mb-3">
          <h4 className="font-black text-gray-800 text-sm tracking-tight line-clamp-2 leading-relaxed">{product.name}</h4>
          <span className="text-[#8B3B3B] font-black text-sm whitespace-nowrap">₹{product.price}</span>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-1.5 focus:outline-none">
            <div className={clsx(
              "w-2 h-2 rounded-full",
              isAvailable ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-rose-500'
            )} />
            <span className={clsx(
              "text-[9px] font-black uppercase tracking-widest",
              isAvailable ? "text-emerald-600" : "text-rose-600"
            )}>{product.status}</span>
          </div>

          {/* Toggle Switch */}
          <button 
            onClick={toggleAvailability}
            className={clsx(
              "relative w-10 h-5 rounded-full transition-all duration-300 ring-2 ring-transparent",
              isAvailable ? "bg-emerald-500/10 ring-emerald-100" : "bg-gray-100 ring-gray-100"
            )}
          >
            <motion.div 
               animate={{ x: isAvailable ? 20 : 0 }}
               className={clsx(
                 "absolute top-0.5 left-0.5 w-4 h-4 rounded-full flex items-center justify-center shadow-sm transition-colors",
                 isAvailable ? "bg-emerald-500 text-white" : "bg-gray-400 text-white"
               )}
            >
              {isAvailable ? <FiCheck size={10} strokeWidth={4} /> : <FiX size={10} strokeWidth={4} />}
            </motion.div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
