import React from 'react';
import { FiArrowUpRight, FiArrowDownRight } from 'react-icons/fi';
import { clsx } from 'clsx';

const StatsCard = ({ title, value, icon: Icon, trend, positive = true }) => {
  return (
    <div className="bg-white rounded-[1.5rem] md:rounded-[2rem] p-4 md:p-8 border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all duration-300 h-full flex flex-col justify-between">
      <div className="flex items-start justify-between mb-4 md:mb-6">
        <div className="flex items-center gap-1.5 md:gap-3">
            <div className="p-1.5 md:p-2 bg-gray-50 text-gray-400 rounded-lg group-hover:text-primary-600 transition-colors shrink-0">
                <Icon size={14} className="md:w-5 md:h-5" />
            </div>
            <p className="text-[8px] md:text-[10px] font-black text-gray-400 uppercase tracking-wider md:tracking-widest whitespace-nowrap">{title}</p>
        </div>
        
        <div className={clsx(
            "px-1.5 py-0.5 rounded-md md:rounded-lg text-[8px] md:text-[9px] font-black flex items-center gap-0.5 md:gap-1 shrink-0",
            positive ? "bg-emerald-100/60 text-emerald-600" : "bg-rose-100/60 text-rose-600"
        )}>
            {positive ? <FiArrowUpRight size={8} className="md:w-3 md:h-3" /> : <FiArrowDownRight size={8} className="md:w-3 md:h-3" />}
            {trend}%
        </div>
      </div>

      <div className="relative z-10">
        <h3 className="text-2xl md:text-3xl lg:text-4xl font-black text-gray-800 tracking-tight leading-none mb-1.5">
            {typeof value === 'number' ? value.toLocaleString() : value}
        </h3>
        <p className="text-[8px] md:text-[9px] font-bold text-gray-300 uppercase tracking-[0.05em] leading-none whitespace-nowrap">from last month</p>
      </div>

      <div className="absolute -right-2 -bottom-2 w-12 h-12 md:w-16 md:h-16 bg-emerald-50 rounded-full blur-2xl opacity-40 group-hover:opacity-60 transition-opacity pointer-events-none" />
    </div>
  );
};

export default StatsCard;
