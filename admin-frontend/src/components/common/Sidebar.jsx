import React from 'react';
import { 
  FiGrid, 
  FiBox, 
  FiCreditCard, 
  FiLayers, 
  FiSettings,
  FiLogOut,
  FiCoffee,
  FiBell
} from 'react-icons/fi';
import axiosInstance from '../../api/axiosInstance';
import useAdminStore from '../../store/useAdminStore';
import { useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion } from 'framer-motion';
import Cookies from 'js-cookie';


const Sidebar = () => {
  const { activeTab, setActiveTab } = useAdminStore();
  const navigate = useNavigate();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: FiGrid },
    { id: 'orders', label: 'Order', icon: FiBox },
    { id: 'reservations', label: 'Reservation', icon: FiCreditCard },
    { id: 'products', label: 'Items', icon: FiLayers },
    { id: 'notifications', label: 'Notifications', icon: FiBell },
    { id: 'settings', label: 'Settings', icon: FiSettings },
  ];

  const handleLogout = async () => {
    try {
        await axiosInstance.post('/admin/logout');
    } catch (err) {
        console.error('Logout failed:', err);
    }
    Cookies.remove('token');
    navigate('/login');

  };

  return (
    <aside className="w-20 hover:w-64 bg-white border-r border-gray-100 flex flex-col h-screen sticky top-0 z-50 transition-all duration-500 ease-in-out group overflow-hidden">
      {/* Branding Section */}
      <div className="p-4 mb-6 pt-8">
        <div className="flex items-center gap-4 overflow-hidden">
            <div className="w-12 h-12 flex items-center justify-center shrink-0">
                <img 
                    src="https://madeena-res-bucket.s3.us-east-1.amazonaws.com/res-files/logo.png" 
                    alt="Logo" 
                    className="w-10 h-10 object-contain drop-shadow-sm" 
                />
            </div>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                <h1 className="text-sm font-black tracking-tighter text-[#8B3B3B]">MADEENA</h1>
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none">Restaurant</p>
            </div>
        </div>
      </div>

      {/* Navigation Section */}
      <nav className="flex-1 px-3 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={twMerge(
                clsx(
                  "w-full flex items-center gap-6 px-4 py-4 rounded-2xl transition-all duration-300 relative overflow-hidden",
                  isActive 
                    ? "bg-[#8B3B3B]/5 text-[#8B3B3B]" 
                    : "text-gray-400 hover:bg-gray-50 hover:text-gray-600"
                )
              )}
            >
              <div className="shrink-0 w-6 flex justify-center">
                <Icon size={22} className={clsx(isActive ? "scale-110" : "hover:scale-110 transition-transform")} />
              </div>
              
              <span className={clsx(
                "text-sm font-bold tracking-tight whitespace-nowrap transition-all duration-300",
                "opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0"
              )}>
                {item.label}
              </span>
              
              {isActive && (
                <motion.div 
                    layoutId="activeSideNavIndicator"
                    className="absolute left-0 w-1 h-6 bg-[#8B3B3B] rounded-r-full"
                />
              )}
            </button>
          );
        })}
      </nav>

      {/* Logout Section */}
      <div className="p-3 mb-4">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-6 px-4 py-4 rounded-2xl text-rose-500 hover:bg-rose-50 transition-all font-bold text-sm overflow-hidden"
        >
          <div className="shrink-0 w-6 flex justify-center">
             <FiLogOut size={22} />
          </div>
          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
