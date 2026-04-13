import React, { useState } from 'react';
import { FiEdit3, FiTrash2, FiInfo, FiLayers } from 'react-icons/fi';
import { clsx } from 'clsx';
import useAdminStore from '../../store/useAdminStore';

const ProductCard = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { deleteProduct } = useAdminStore();

  const handleDelete = () => {
    if (window.confirm(`Delete ${product.name}?`)) {
      deleteProduct(product._id);
    }
  };

  return (
    <div
      className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden group relative transition-all duration-500 hover:shadow-2xl hover:shadow-primary-500/5 hover:-translate-y-2 p-4"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="h-56 rounded-[2rem] overflow-hidden relative shadow-inner">
        <img
          src={product.img || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500'}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute top-4 right-4 flex flex-col gap-3 transition-all duration-500 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0">
          <button className="p-3 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl text-[#8B3B3B] hover:bg-[#8B3B3B] hover:text-white transition-all transform hover:scale-110">
            <FiEdit3 size={18} />
          </button>
          <button 
            onClick={handleDelete}
            className="p-3 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl text-rose-500 hover:bg-rose-50 hover:text-rose-600 transition-all transform hover:scale-110"
          >
            <FiTrash2 size={18} />
          </button>
        </div>
        <div className="absolute bottom-4 left-4">
          <span className="px-4 py-1.5 bg-brand-dark/40 backdrop-blur-md text-white text-[10px] font-black rounded-xl uppercase tracking-widest border border-white/20 flex items-center gap-2">
            <FiLayers size={10} />
            {typeof product.category === 'object' ? product.category.name : 'Uncategorized'}
          </span>
        </div>
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h4 className="font-black text-gray-800 group-hover:text-[#8B3B3B] transition-colors uppercase text-sm tracking-tighter line-clamp-1">{product.name}</h4>
          <span className="text-[#8B3B3B] font-black text-lg tracking-tight">₹{product.price?.toLocaleString()}</span>
        </div>
        
        <p className="text-[10px] text-gray-400 font-medium line-clamp-2 mt-2 h-8">
            {product.description || 'Nourishing and flavorful dish prepared with hand-picked fresh ingredients.'}
        </p>
        
        <div className="flex justify-between items-center mt-6">
          <div className="flex items-center gap-2">
            <div className={clsx(
                "w-2.5 h-2.5 rounded-full shadow-sm",
                product.status === 'available' ? 'bg-emerald-500' : 'bg-rose-500 animate-pulse'
            )} />
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{product.status}</span>
          </div>
          <button className="px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-400 hover:text-gray-800 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2">
            <FiInfo size={12} />
            Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
