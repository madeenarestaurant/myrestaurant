import React from 'react';
import { FiArrowUpRight, FiArrowDownRight } from 'react-icons/fi';
import { clsx } from 'clsx';

const StatsCard = ({ title, value, icon: Icon, trend, positive = true }) => {
  return (
    <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all duration-300">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
            <div className="p-2 bg-gray-50 text-gray-400 rounded-lg group-hover:text-primary-600 transition-colors">
                <Icon size={16} />
            </div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{title}</p>
        </div>
        
        <div className={clsx(
            "px-2 py-0.5 rounded-lg text-[9px] font-black flex items-center gap-1",
            positive ? "bg-emerald-100/60 text-emerald-600" : "bg-rose-100/60 text-rose-600"
        )}>
            {positive ? <FiArrowUpRight size={10} /> : <FiArrowDownRight size={10} />}
            +{trend}
        </div>
      </div>

      <div className="flex flex-col">
        <h3 className="text-4xl font-black text-gray-800 tracking-tight leading-none mb-1">
            {typeof value === 'number' ? value.toLocaleString() : value}
        </h3>
        <p className="text-[9px] font-bold text-gray-300 uppercase tracking-widest leading-none">from last month</p>
      </div>

      {positive ? (
        <div className="absolute -right-2 -bottom-2 w-16 h-16 bg-emerald-50 rounded-full blur-2xl opacity-40 group-hover:opacity-60 transition-opacity" />
      ) : (
        <div className="absolute -right-2 -bottom-2 w-16 h-16 bg-rose-50 rounded-full blur-2xl opacity-40 group-hover:opacity-60 transition-opacity" />
      )}
    </div>
  );
};

export default StatsCard;
