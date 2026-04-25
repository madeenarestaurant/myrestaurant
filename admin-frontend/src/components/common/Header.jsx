import React, { useEffect, useState, useRef } from 'react';
import { FiSearch, FiBell, FiUser, FiMoon, FiSun, FiMic, FiChevronRight, FiMail, FiLogOut, FiSettings, FiShoppingBag, FiCalendar, FiX } from 'react-icons/fi';
import useThemeStore from '../../store/useThemeStore';
import useAdminStore from '../../store/useAdminStore';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import Cookies from 'js-cookie';


const Header = () => {
  const { darkMode, toggleDarkMode, notifications } = useThemeStore();
  const { activeTab, setActiveTab, profile, fetchProfile, newNotification } = useAdminStore();
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const popupRef = useRef(null);

  useEffect(() => {
    if (!profile) fetchProfile();
    
    const handleClickOutside = (event) => {
        if (popupRef.current && !popupRef.current.contains(event.target)) {
            setShowProfilePopup(false);
        }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavigateToProfile = () => {
    setActiveTab('profile');
    setShowProfilePopup(false);
  };

  const handleLogout = () => {
    Cookies.remove('token');
    window.location.href = '/login';
  };


  return (
    <header className="h-16 md:h-20 flex items-center px-6 md:px-10 bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-40">
      <div className="flex items-center justify-between w-full">
        {/* Logo Section */}
        <div className="flex items-center group cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <img 
                src="https://madeena-res-bucket.s3.us-east-1.amazonaws.com/res-files/titlename.jpeg" 
                alt="Madeena Title" 
                className="h-8 md:h-12 w-auto object-contain rounded-lg transition-all duration-300 group-hover:brightness-110" 
            />
        </div>

        {/* Right Side Icons */}
        <div className="flex items-center gap-4 md:gap-8">
            <button 
                onClick={() => setActiveTab('notifications')}
                className={clsx(
                    "text-gray-400 hover:text-[#8B3B3B] transition-colors relative p-2 rounded-xl",
                    activeTab === 'notifications' && "text-[#8B3B3B] bg-[#8B3B3B]/5"
                )}
            >
                <FiBell size={20} />
                {notifications && (
                    <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white" />
                )}
            </button>
            
            <div className="flex items-center gap-3 pl-4 border-l border-gray-100 relative" ref={popupRef}>
                <div className="text-right hidden sm:block">
                    <p className="text-xs font-black text-gray-800 leading-none">{profile?.name?.split(' ')[0] || 'Admin'}</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Management</p>
                </div>
                <button 
                    onClick={() => setShowProfilePopup(!showProfilePopup)}
                    className="w-8 h-8 md:w-10 md:h-10 rounded-full p-0.5 border-2 border-[#8B3B3B]/10 transition-all hover:border-[#8B3B3B]/30 active:scale-95 overflow-hidden bg-gray-50"
                >
                    {profile?.profileimg ? (
                        <img src={profile.profileimg} className="w-full h-full object-cover rounded-full" alt="Admin" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#8B3B3B]">
                            <FiUser size={18} />
                        </div>
                    )}
                </button>

                {/* Profile Quick-view Popup */}
                <AnimatePresence>
                    {showProfilePopup && (
                        <motion.div 
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute top-full right-0 mt-4 w-72 bg-white rounded-[2rem] shadow-2xl border border-gray-100 overflow-hidden z-50 p-2"
                        >
                            <div className="p-4 bg-gray-50/50 rounded-[1.5rem] flex items-center gap-4 mb-2">
                                <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-white shadow-sm shrink-0">
                                    {profile?.profileimg ? (
                                        <img src={profile.profileimg} className="w-full h-full object-cover" alt="Admin" />
                                    ) : (
                                        <div className="w-full h-full bg-[#8B3B3B]/5 flex items-center justify-center text-[#8B3B3B]">
                                            <FiUser size={24} />
                                        </div>
                                    )}
                                </div>
                                <div className="min-w-0">
                                    <p className="font-black text-gray-800 text-sm truncate tracking-tight">{profile?.name || 'Admin User'}</p>
                                    <p className="text-[10px] font-bold text-gray-400 truncate mt-0.5">{profile?.email || 'admin@madeena.com'}</p>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <button 
                                    onClick={handleNavigateToProfile}
                                    className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-[1.2rem] transition-all group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-xl bg-white shadow-sm flex items-center justify-center text-gray-400 group-hover:text-[#8B3B3B] group-hover:bg-[#8B3B3B]/5 transition-all">
                                            <FiUser size={14} />
                                        </div>
                                        <span className="text-xs font-bold text-gray-600 group-hover:text-gray-800 transition-colors">My Profile</span>
                                    </div>
                                    <FiChevronRight size={14} className="text-gray-300 group-hover:text-[#8B3B3B] transition-colors" />
                                </button>
                                
                                <button 
                                    onClick={() => { setActiveTab('settings'); setShowProfilePopup(false); }}
                                    className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-[1.2rem] transition-all group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-xl bg-white shadow-sm flex items-center justify-center text-gray-400 group-hover:text-amber-500 group-hover:bg-amber-50 transition-all">
                                            <FiSettings size={14} />
                                        </div>
                                        <span className="text-xs font-bold text-gray-600 group-hover:text-gray-800 transition-colors">Settings</span>
                                    </div>
                                    <FiChevronRight size={14} className="text-gray-300 group-hover:text-amber-500 transition-colors" />
                                </button>
                            </div>

                            <div className="mt-2 pt-2 border-t border-gray-50">
                                <button 
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 p-4 hover:bg-rose-50 rounded-[1.2rem] transition-all group"
                                >
                                    <div className="w-8 h-8 rounded-xl bg-rose-50/50 flex items-center justify-center text-rose-400 group-hover:text-rose-600 group-hover:bg-rose-100/50 transition-all">
                                        <FiLogOut size={14} />
                                    </div>
                                    <span className="text-xs font-bold text-rose-500">Sign Out</span>
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
      </div>

      {/* Real-time Notification Toast */}
      <AnimatePresence>
        {newNotification && (
          <motion.div
            initial={{ opacity: 0, x: 100, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.9 }}
            className="fixed top-4 right-4 z-[100] w-full max-w-[320px]"
          >
            <div className="bg-white/95 backdrop-blur-sm border border-gray-100 shadow-2xl rounded-3xl p-4 flex items-start gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                newNotification.type === 'order' ? 'bg-amber-50 text-amber-600' : 'bg-indigo-50 text-indigo-600'
              }`}>
                {newNotification.type === 'order' ? <FiShoppingBag size={20} /> : <FiCalendar size={20} />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-black uppercase tracking-widest text-[#8B3B3B] mb-1">
                  New {newNotification.type}
                </p>
                <p className="text-xs font-bold text-gray-800 leading-tight">
                  {newNotification.message}
                </p>
                <button 
                  onClick={() => setActiveTab('notifications')}
                  className="mt-2 text-[10px] font-black text-[#8B3B3B] uppercase hover:underline"
                >
                  View Details
                </button>
              </div>
              <button 
                onClick={() => useAdminStore.setState({ newNotification: null })}
                className="text-gray-300 hover:text-gray-500 transition-colors"
              >
                <FiX size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
