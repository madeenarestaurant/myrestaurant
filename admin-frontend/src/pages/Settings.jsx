import React, { useState, useEffect } from 'react';
import { LuMoon, LuBell, LuEye, LuShield, LuUser, LuMail, LuPhone, LuBuilding, LuMapPin, LuImage, LuLoader } from 'react-icons/lu';
import useThemeStore from '../store/useThemeStore';
import useAdminStore from '../store/useAdminStore';
import Toast from '../components/common/Toast';

const Settings = () => {
  const { darkMode, toggleDarkMode, notifications, setNotifications, showDetails, setShowDetails } = useThemeStore();
  const { profile, fetchProfile, updateProfile } = useAdminStore();
  const [toast, setToast] = useState({ message: '', type: 'success' });
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    number: '',
    address: '',
    business: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (!profile) fetchProfile();
  }, []);

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        email: profile.email || '',
        number: profile.number || '',
        address: profile.address || '',
        business: profile.business || ''
      });
      if (profile.profileimg) setImagePreview(profile.profileimg);
    }
  }, [profile]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        setImageFile(file);
        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result);
        reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    if (imageFile) data.append('profileimg', imageFile);

    const result = await updateProfile(data, true);
    if (result.success) {
        setToast({ message: 'Profile updated successfully!', type: 'success' });
    } else {
        setToast({ message: result.error || 'Failed to update profile', type: 'error' });
    }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl space-y-8 pb-10">
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />
      
      <div>
        <h3 className="text-2xl font-black dark:text-white tracking-tight">System Settings</h3>
        <p className="text-sm text-gray-500 font-medium">Manage your administrative preferences and profile details.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="md:col-span-2 space-y-6">
            <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm p-8">
                <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6">Administrative Profile</h4>
                <form onSubmit={handleSaveProfile} className="space-y-6">
                    <div className="flex flex-col sm:flex-row items-center gap-8">
                        <label className="relative group cursor-pointer">
                            <div className="w-24 h-24 rounded-[2rem] bg-gray-100 dark:bg-gray-800 overflow-hidden border-4 border-white dark:border-gray-900 shadow-xl group-hover:opacity-80 transition-all">
                                {imagePreview ? <img src={imagePreview} className="w-full h-full object-cover" /> : <LuUser size={40} className="m-6 text-gray-400" />}
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <LuImage className="text-white drop-shadow-lg" size={24} />
                            </div>
                            <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                        </label>
                        <div className="flex-1 space-y-4 w-full">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Full Name</label>
                                <input name="name" value={formData.name} onChange={handleInputChange} className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-primary-500 outline-none dark:text-white" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Business Name</label>
                                <input name="business" value={formData.business} onChange={handleInputChange} className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-primary-500 outline-none dark:text-white" />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Email Address</label>
                            <input name="email" value={formData.email} disabled className="w-full bg-gray-100 dark:bg-gray-800/50 border-none rounded-2xl p-4 text-sm outline-none text-gray-500" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Phone Number</label>
                            <input name="number" value={formData.number} onChange={handleInputChange} className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-primary-500 outline-none dark:text-white" />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Office Address</label>
                        <input name="address" value={formData.address} onChange={handleInputChange} className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-primary-500 outline-none dark:text-white" />
                    </div>

                    <button disabled={loading} className="w-full py-4 bg-primary-600 text-white rounded-2xl font-black text-xs shadow-xl shadow-primary-500/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2">
                        {loading ? <LuLoader className="animate-spin" /> : 'SAVE CHANGES'}
                    </button>
                </form>
            </div>
        </div>

        {/* System Toggles */}
        <div className="space-y-6">
            <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 p-6 shadow-sm overflow-hidden">
                <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6">Preferences</h4>
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <LuMoon size={20} className="text-primary-600" />
                            <span className="text-sm font-bold dark:text-white">Dark Theme</span>
                        </div>
                        <button onClick={toggleDarkMode} className={`w-12 h-6 rounded-full transition-all ${darkMode ? 'bg-primary-600' : 'bg-gray-200'} relative`}>
                            <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-all ${darkMode ? 'translate-x-6' : ''}`} />
                        </button>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <LuBell size={20} className="text-primary-600" />
                            <span className="text-sm font-bold dark:text-white">Notifications</span>
                        </div>
                        <button onClick={() => setNotifications(!notifications)} className={`w-12 h-6 rounded-full transition-all ${notifications ? 'bg-primary-600' : 'bg-gray-200'} relative`}>
                            <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-all ${notifications ? 'translate-x-6' : ''}`} />
                        </button>
                    </div>
                </div>
            </div>

            <div className="bg-amber-100 dark:bg-amber-900/30 rounded-[2.5rem] p-6 border border-amber-200 dark:border-amber-800/40">
                <LuShield size={24} className="text-amber-600 mb-4" />
                <h5 className="font-black text-amber-800 dark:text-amber-400 text-xs uppercase tracking-widest mb-2">Security Warning</h5>
                <p className="text-[10px] font-bold text-amber-700/70 dark:text-amber-500/70 leading-relaxed">Ensure you use strong credentials. System will auto-logout after 24 hours of inactivity.</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
