import React from 'react';
import { 
  FiGrid, 
  FiBox, 
  FiCreditCard, 
  FiLayers, 
  FiSettings,
  FiLogOut,
  FiCoffee
} from 'react-icons/fi';
import axiosInstance from '../../api/axiosInstance';
import useAdminStore from '../../store/useAdminStore';
import { useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion } from 'framer-motion';

const Sidebar = () => {
  const { activeTab, setActiveTab } = useAdminStore();
  const navigate = useNavigate();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: FiGrid },
    { id: 'orders', label: 'Order', icon: FiBox },
    { id: 'reservations', label: 'Payment', icon: FiCreditCard },
    { id: 'products', label: 'Items', icon: FiLayers },
    { id: 'settings', label: 'Settings', icon: FiSettings },
  ];

  const handleLogout = async () => {
    try {
        await axiosInstance.post('/admin/logout');
    } catch (err) {
        console.error('Logout failed:', err);
    }
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-100 flex flex-col h-screen sticky top-0 z-50">
      {/* Branding Section */}
      <div className="p-8 mb-6">
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 brand-gradient rounded-xl flex items-center justify-center text-white shadow-lg shrink-0">
                <FiCoffee size={20} />
            </div>
            <div>
                <h1 className="text-lg font-black tracking-tighter text-[#8B3B3B]">MADEENA</h1>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Admin Panel</p>
            </div>
        </div>
      </div>

      {/* Navigation Section - Vertical with Names shown */}
      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={twMerge(
                clsx(
                  "w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 group relative",
                  isActive 
                    ? "bg-[#8B3B3B]/5 text-[#8B3B3B]" 
                    : "text-gray-400 hover:bg-gray-50 hover:text-gray-600"
                )
              )}
            >
              <Icon size={22} className={clsx(isActive ? "scale-110" : "group-hover:scale-110 transition-transform")} />
              <span className={clsx(
                "text-sm font-bold tracking-tight",
                isActive ? "opacity-100" : "opacity-80"
              )}>
                {item.label}
              </span>
              
              {isActive && (
                <motion.div 
                    layoutId="activeSideNavIndicator"
                    className="absolute left-0 w-1.5 h-8 bg-[#8B3B3B] rounded-r-full"
                />
              )}
            </button>
          );
        })}
      </nav>

      {/* Logout Section */}
      <div className="p-6">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-rose-500 hover:bg-rose-50 transition-all group font-bold text-sm"
        >
          <FiLogOut size={22} className="group-hover:translate-x-1 transition-all" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
