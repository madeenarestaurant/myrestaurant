import React from 'react';
import { 
  FiGrid, 
  FiBox, 
  FiCreditCard, 
  FiLayers, 
  FiUsers
} from 'react-icons/fi';
import useAdminStore from '../../store/useAdminStore';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';

const MobileNav = () => {
  const { activeTab, setActiveTab } = useAdminStore();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: FiGrid },
    { id: 'orders', label: 'Order', icon: FiBox },
    { id: 'reservations', label: 'Reservation', icon: FiCreditCard },
    { id: 'products', label: 'Items', icon: FiLayers },
    { id: 'visitors', label: 'Visitors', icon: FiUsers },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-4 rounded-t-[2.5rem] flex items-center justify-around z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
      {menuItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;

        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={clsx(
              "flex flex-col items-center justify-center gap-1.5 transition-all w-16",
              isActive ? "text-[#8B3B3B]" : "text-gray-400"
            )}
          >
            <div className={clsx(
                "transition-transform duration-300",
                isActive && "scale-110"
            )}>
                <Icon size={28} strokeWidth={isActive ? 2.5 : 2} />
            </div>
            <span className={clsx(
                "text-[10px] font-black tracking-tight",
                isActive ? "text-[#8B3B3B]" : "text-gray-400"
            )}>
                {item.label}
            </span>
            
            {isActive && (
                <motion.div 
                    layoutId="mobileNavActiveTick"
                    className="absolute -bottom-1 w-1 h-1 bg-[#8B3B3B] rounded-full"
                />
            )}
          </button>
        );
      })}
    </nav>
  );
};

export default MobileNav;
