import React from 'react';
import Sidebar from '../components/common/Sidebar';
import MobileNav from '../components/common/MobileNav';
import Header from '../components/common/Header';
import Dashboard from '../pages/Dashboard';
import Orders from '../pages/Orders';
import Products from '../pages/Products';
import Reservations from '../pages/Reservations';
import Profile from '../pages/Profile';
import Notifications from '../pages/Notifications';
import Visitors from '../pages/Visitors';
import useAdminStore from '../store/useAdminStore';
import { motion, AnimatePresence } from 'framer-motion';

import { io } from 'socket.io-client';
import { useEffect } from 'react';

const AdminLayout = () => {
  const { activeTab, initSocket } = useAdminStore();

  useEffect(() => {
    const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
    const socketUrl = apiBase.endsWith('/api') ? apiBase.replace('/api', '') : apiBase;
    
    const socket = io(socketUrl);
    initSocket(socket);

    return () => {
      socket.disconnect();
    };
  }, []);


  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'orders': return <Orders />;
      case 'products': return <Products />;
      case 'reservations': return <Reservations />;
      case 'profile': return <Profile />;
      case 'notifications': return <Notifications />;
      case 'visitors': return <Visitors />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-surface-light font-sans selection:bg-primary-100 selection:text-primary-900">
      {/* Fixed Sidebar for Desktop */}
      <div className="hidden md:block shrink-0">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative">
        {/* Decorative shadow layer */}
        <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-gray-100/50 to-transparent pointer-events-none z-0" />
        
        <Header />
        
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-6 md:p-10 custom-scrollbar relative z-10 pb-40 md:pb-10">
          <div className="max-w-[1600px] mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
        
        {/* Bottom Nav for Mobile */}
        <MobileNav />
      </div>
    </div>
  );
};

export default AdminLayout;
