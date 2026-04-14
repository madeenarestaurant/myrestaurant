import React, { useEffect } from 'react';
import { FiSearch, FiBell, FiUser, FiMoon, FiSun, FiMic } from 'react-icons/fi';
import useThemeStore from '../../store/useThemeStore';
import useAdminStore from '../../store/useAdminStore';

const Header = () => {
  const { darkMode, toggleDarkMode, notifications } = useThemeStore();
  const { activeTab, profile, fetchProfile } = useAdminStore();

  useEffect(() => {
    if (!profile) fetchProfile();
  }, []);

  return (
    <header className="h-28 flex flex-col justify-center px-10 bg-surface-light sticky top-0 z-40 transition-all duration-300">
      <div className="flex items-center justify-between w-full mb-4">
        {/* Logo at Top Left as per Image */}
        <div className="flex items-center gap-2 group cursor-pointer">
            <div className="w-10 h-10 brand-gradient rounded-xl flex items-center justify-center text-white shadow-md">
                <span className="font-black text-sm">M</span>
            </div>
            <div>
                <h1 className="text-sm font-black text-primary-600 tracking-tighter leading-none">MADEENA</h1>
                <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest leading-none mt-1">Restaurant</p>
            </div>
        </div>

        {/* Right Side Icons as per Image */}
        <div className="flex items-center gap-6">
            <button className="text-gray-400 hover:text-primary-500 transition-colors relative">
                <FiBell size={22} strokeWidth={2.5} />
                {notifications && (
                    <span className="absolute top-0 right-0 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
                )}
            </button>
            <div className="w-10 h-10 rounded-full p-0.5 border-2 border-primary-500/20">
                {profile?.profileimg ? (
                    <img src={profile.profileimg} className="w-full h-full object-cover rounded-full" alt="Admin" />
                ) : (
                    <div className="w-full h-full bg-primary-50 flex items-center justify-center text-primary-500 rounded-full">
                        <FiUser size={20} />
                    </div>
                )}
            </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
