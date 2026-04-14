import React from 'react';
import { FiEdit3, FiTrash2, FiLayers } from 'react-icons/fi';
import { clsx } from 'clsx';
import useAdminStore from '../../store/useAdminStore';

const ProductCard = ({ product, onEdit }) => {
  const { deleteProduct } = useAdminStore();

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm(`Delete ${product.name}?`)) {
      deleteProduct(product._id);
    }
  };



  const categoryName = typeof product.category === 'object' ? product.category.name : 'Uncategorized';

  return (
    <div
      className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden group relative transition-all duration-300 hover:shadow-xl hover:border-[#8B3B3B]/10 p-3 cursor-pointer h-full flex flex-col"
      onClick={() => onEdit(product)}
    >
      <div className="h-44 rounded-2xl overflow-hidden relative mb-4 bg-gray-50 flex items-center justify-center">
        {product.img ? (
            <img
            src={product.img}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
        ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 text-gray-300">
                <FiLayers size={32} className="mb-2 opacity-20" />
                <span className="text-[10px] font-black uppercase tracking-widest">No Image</span>
            </div>
        )}
        
        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
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

        {/* Category Pill - Centered per screenshot */}
        <div className="absolute inset-x-0 bottom-4 flex justify-center px-4">
          <span className="px-5 py-2.5 bg-gray-800/80 backdrop-blur-md text-white text-[9px] font-black rounded-xl uppercase tracking-[0.1em] border border-white/10 flex items-center gap-2 shadow-lg max-w-[90%] text-center leading-none">
            <FiLayers size={10} className="shrink-0" />
            <span className="truncate">{categoryName}</span>
          </span>
        </div>
      </div>

      <div className="px-2 pb-2 flex-1 flex flex-col justify-between">
        <div className="flex justify-between items-start gap-2 mb-2">
          <h4 className="font-black text-gray-800 text-sm tracking-tight line-clamp-2 leading-relaxed">{product.name}</h4>
          <span className="text-[#8B3B3B] font-black text-sm whitespace-nowrap">₹{product.price}</span>
        </div>

        <div className="flex items-center gap-1.5 pt-2 border-t border-gray-50">
          <div className={clsx(
            "w-2.5 h-2.5 rounded-full shadow-inner",
            product.status === 'available' ? 'bg-emerald-500' : 'bg-rose-500'
          )} />
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{product.status}</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
