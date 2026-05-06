import React from 'react';
import { FiEdit3, FiTrash2, FiLayers } from 'react-icons/fi';
import useAdminStore from '../../store/useAdminStore';

const CategoryCard = ({ category, onEdit }) => {
  const { deleteCategory } = useAdminStore();

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (window.confirm(`Delete ${category.name}? This will affect all products in this category.`)) {
      const res = await deleteCategory(category._id);
      if (res && !res.success) {
        alert(res.error || 'Failed to delete category');
      }
    }
  };



  return (
    <div
      className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden group relative transition-all duration-300 hover:shadow-xl hover:border-[#8B3B3B]/10 p-4 cursor-pointer"
      onClick={() => onEdit(category)}
    >
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-[#8B3B3B]/5 flex items-center justify-center text-[#8B3B3B] group-hover:bg-[#8B3B3B] group-hover:text-white transition-all duration-500 overflow-hidden shadow-inner uppercase font-black text-xl">
          {category.img ? (
            <img 
              src={category.img} 
              className="w-full h-full object-cover" 
              alt={category.name} 
            />
          ) : (
            category.name?.charAt(0)
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-black text-gray-800 text-sm tracking-tight truncate group-hover:text-[#8B3B3B] transition-colors">{category.name}</h4>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Category</p>
        </div>
        <div className="flex gap-1">
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(category); }}
            className="p-2.5 bg-gray-50 text-gray-400 hover:text-[#8B3B3B] hover:bg-[#8B3B3B]/5 rounded-xl transition-all"
          >
            <FiEdit3 size={14} />
          </button>
          <button
            onClick={handleDelete}
            className="p-2.5 bg-gray-50 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
          >
            <FiTrash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryCard;
