import React, { useState, useEffect } from 'react';
import useAdminStore from '../store/useAdminStore';
import { FiEdit3, FiPhone, FiMail, FiMapPin, FiBriefcase, FiCheck, FiX, FiCamera, FiLoader, FiUser } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import Toast from '../components/common/Toast';
import { clsx } from 'clsx';

const Profile = () => {
  const { profile, updateProfile, fetchProfile } = useAdminStore();
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'success' });
  const [editingId, setEditingId] = useState(null); // 'personal' or 'business'
  
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
    if (profile) {
      setFormData({
        name: profile.name || '',
        email: profile.email || '',
        number: profile.number || '',
        address: profile.address || '',
        business: profile.business || ''
      });
      setImagePreview(profile.profileimg || null);
    }
  }, [profile]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const compressImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 800; // Optimal for profile pics
          const scaleSize = MAX_WIDTH / img.width;
          canvas.width = MAX_WIDTH;
          canvas.height = img.height * scaleSize;
          
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          
          canvas.toBlob((blob) => {
            resolve(new File([blob], file.name, { type: 'image/jpeg' }));
          }, 'image/jpeg', 0.8); // 80% quality is perfect balance
        };
      };
    });
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

  const handleImageUpload = async () => {
    if (!imageFile) return;
    setLoading(true);
    
    try {
        const compressedFile = await compressImage(imageFile);
        const data = new FormData();
        data.append('profileimg', compressedFile);
        
        const res = await updateProfile(data, true);
        if (res.success) {
          setToast({ message: 'Avatar Updated!', type: 'success' });
          setImageFile(null);
        } else {
          setToast({ message: res.error || 'Upload Failed', type: 'error' });
        }
    } catch (err) {
        setToast({ message: 'Compression Failed', type: 'error' });
    } finally {
        setLoading(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    const res = await updateProfile(formData);
    if (res.success) {
      setToast({ message: 'Profile updated successfully!', type: 'success' });
      setEditingId(null);
    } else {
      setToast({ message: res.error || 'Update failed', type: 'error' });
    }
    setLoading(false);
  };

  if (!profile) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <FiLoader className="animate-spin text-[#8B3B3B]" size={32} />
        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Loading Profile...</p>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />

      {/* Profile Header Card */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden mb-8">
        <div className="h-40 md:h-48 brand-gradient relative rounded-t-[2.5rem] mx-4 mt-4">
           <div className="absolute inset-0 bg-black/5" />
           {/* Decorative shape like in screenshot */}
           <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/10 [clip-path:polygon(100%_0,0%_100%,100%_100%)]" />
        </div>
        
        <div className="px-8 pb-8 relative">
           {/* Avatar Section */}
           <div className="flex flex-col md:flex-row items-center md:items-end gap-4 md:gap-6 -mt-14 md:-mt-16 mb-4">
              <div className="relative group mx-auto md:mx-0">
                <div className="w-28 h-28 md:w-36 md:h-36 rounded-[2.5rem] border-[6px] border-white shadow-xl overflow-hidden bg-gray-50 flex items-center justify-center">
                   {imagePreview ? (
                     <img src={imagePreview} className="w-full h-full object-cover" alt="Profile" />
                   ) : (
                     <div className="text-gray-300">
                        <FiUser size={48} />
                     </div>
                   )}
                </div>
                <label className="absolute bottom-1 right-1 p-2.5 bg-white hover:bg-gray-50 rounded-xl shadow-lg text-[#8B3B3B] cursor-pointer transition-all hover:scale-110 active:scale-95 border border-gray-50 group-hover:shadow-2xl">
                  <FiCamera size={16} />
                  <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                </label>

                {/* Confirm Upload Button */}
                <AnimatePresence>
                  {imageFile && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      onClick={handleImageUpload}
                      className="absolute -bottom-10 left-1/2 -translate-x-1/2 px-4 py-2 bg-emerald-500 text-white text-[9px] font-black uppercase tracking-widest rounded-lg shadow-lg hover:bg-emerald-600 transition-all flex items-center gap-2 whitespace-nowrap z-10"
                    >
                      {loading ? <FiLoader className="animate-spin" /> : <><FiCheck /> Confirm Selection</>}
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex-1 text-center md:text-left mb-2">
                <h1 className="text-xl md:text-2xl font-black text-gray-800 tracking-tighter capitalize md:mb-2 -mb-1">{profile.name}</h1>
                <p className="text-[11px] font-bold text-gray-400 mt-1 md:mb-7">{profile.email}</p>
                <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-4 md:mt-3">
                   <span className="px-4 py-1.5 md:px-1 md:py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] md:text-[9px] font-black uppercase tracking-widest border border-emerald-100">
                     Admin
                   </span>
                </div>
              </div>
           </div>
        </div>
      </div>

      {/* Detailed Info Sections */}
      <div className="grid grid-cols-1 gap-8">
        {/* Personal Information */}
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8 sm:p-10">
           <div className="flex justify-between items-center mb-10">
              <div>
                <h2 className="text-xl font-black text-gray-800 tracking-tighter">Personal Information</h2>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Manage your public and contact details</p>
              </div>
              <button 
                onClick={() => setEditingId(editingId === 'personal' ? null : 'personal')}
                className={clsx(
                    "flex items-center gap-2 px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all",
                    editingId === 'personal' ? "bg-gray-100 text-gray-500" : "bg-[#8B3B3B] text-white shadow-lg shadow-[#8B3B3B]/20"
                )}
              >
                {editingId === 'personal' ? <><FiX /> Cancel</> : <><FiEdit3 /> Edit</>}
              </button>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <ProfileField 
                label="Full Name" 
                name="name" 
                value={formData.name} 
                editing={editingId === 'personal'} 
                onChange={handleInputChange}
                placeholder="e.g. John Doe"
                icon={<FiUser />}
              />
              <ProfileField 
                label="Email Address" 
                name="email" 
                value={formData.email} 
                editing={editingId === 'personal'} 
                onChange={handleInputChange}
                placeholder="email@example.com"
                type="email"
                icon={<FiMail />}
              />
              <ProfileField 
                label="Phone Number" 
                name="number" 
                value={formData.number} 
                editing={editingId === 'personal'} 
                onChange={handleInputChange}
                placeholder="+91 00000 00000"
                icon={<FiPhone />}
              />
              <div className="md:col-span-2">
                <ProfileField 
                  label="Office Address" 
                  name="address" 
                  value={formData.address} 
                  editing={editingId === 'personal'} 
                  onChange={handleInputChange}
                  placeholder="Street, City, Country"
                  isTextArea
                  icon={<FiMapPin />}
                />
              </div>
           </div>

           {editingId === 'personal' && (
             <motion.div 
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               className="mt-12 flex items-center gap-4"
             >
                <button 
                  onClick={handleSave}
                  disabled={loading}
                  className="px-10 py-4 brand-gradient text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-[#8B3B3B]/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-3"
                >
                  {loading ? <FiLoader className="animate-spin" /> : <><FiCheck size={18} /> Save Changes</>}
                </button>
                <button 
                  onClick={() => setEditingId(null)}
                  className="px-8 py-4 bg-gray-50 text-gray-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-100 transition-all"
                >
                  Discard
                </button>
             </motion.div>
           )}
        </div>


        {/* Security / Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8">
              <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6 border-b border-gray-50 pb-4">Last Activity</h3>
              <div className="space-y-6">
                <ActivityItem label="Last Login" value={new Date(profile.lastlogin).toLocaleString()} />
                <ActivityItem label="Member Since" value={new Date(profile.createdtimes).toLocaleDateString()} />
                <ActivityItem label="Account Status" value={profile.status} badge="emerald" />
              </div>
           </div>

           <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8 flex flex-col justify-center items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-[#8B3B3B]/5 text-[#8B3B3B] flex items-center justify-center mb-4">
                 <FiBriefcase size={24} />
              </div>
              <h3 className="text-lg font-black text-gray-800 tracking-tighter">Restaurant Details</h3>
              <p className="text-[10px] font-medium text-gray-400 mt-1 max-w-[200px]">View and manage specific details of your establishment.</p>
              <button className="mt-6 px-8 py-3 bg-white text-[#8B3B3B] border border-[#8B3B3B]/20 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 transition-all flex items-center gap-2">
                 <FiEdit3 size={14} /> Edit Details
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

const ProfileField = ({ label, name, value, editing, onChange, placeholder, icon, type = "text", isTextArea = false }) => (
  <div className="space-y-3">
    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{label}</label>
    <div className="relative group">
      {icon && (
        <div className="absolute left-6 top-[1.3rem] text-gray-300 group-focus-within:text-[#8B3B3B] transition-colors pointer-events-none">
          {icon}
        </div>
      )}
      {editing ? (
        isTextArea ? (
          <textarea 
            name={name} 
            value={value} 
            onChange={onChange} 
            placeholder={placeholder}
            rows="3"
            className={clsx(
                "w-full bg-gray-50 border-2 border-transparent focus:border-[#8B3B3B]/20 rounded-2xl p-4 text-sm font-bold outline-none transition-all placeholder:text-gray-300 resize-none",
                icon && "pl-14"
            )}
          />
        ) : (
          <input 
            type={type} 
            name={name} 
            value={value} 
            onChange={onChange} 
            placeholder={placeholder}
            className={clsx(
                "w-full bg-gray-50 border-2 border-transparent focus:border-[#8B3B3B]/20 rounded-2xl p-4 text-sm font-bold outline-none transition-all placeholder:text-gray-300",
                icon && "pl-14"
            )}
          />
        )
      ) : (
        <div className={clsx(
            "p-4 bg-gray-50/50 rounded-2xl border border-gray-50 min-h-[56px] flex items-center",
            icon && "pl-14"
        )}>
          <p className="text-sm font-bold text-gray-700">{value || <span className="text-gray-300 italic">Not provided</span>}</p>
        </div>
      )}
    </div>
  </div>
);

const ActivityItem = ({ label, value, badge }) => (
  <div className="flex justify-between items-center">
    <span className="text-xs font-bold text-gray-500">{label}</span>
    {badge ? (
      <span className={clsx(
        "px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border",
        badge === 'emerald' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-gray-50 text-gray-400 border-gray-100"
      )}>
        {value}
      </span>
    ) : (
      <span className="text-[11px] font-black text-gray-800">{value}</span>
    )}
  </div>
);

export default Profile;
