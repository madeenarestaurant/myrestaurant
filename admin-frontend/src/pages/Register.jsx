import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff, FiLoader } from 'react-icons/fi';
import { motion } from 'framer-motion';
import axiosInstance from '../api/axiosInstance';
import Toast from '../components/common/Toast';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    lastName: '',
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'success' });

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
        await axiosInstance.post('/admin/register', {
            name: `${formData.name} ${formData.lastName}`,
            email: formData.email,
            password: formData.password
        });
        setToast({ message: 'Registration successful! Please login.', type: 'success' });
        setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
        setToast({ message: err.response?.data?.message || 'Registration failed.', type: 'error' });
    } finally {
        setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-brand-dark flex items-center justify-center relative overflow-hidden font-sans">
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />
      
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
            src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200" 
            className="w-full h-full object-cover opacity-60"
            alt="background"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-transparent to-transparent" />
      </div>

      <div className="relative z-10 w-full max-w-lg px-6 flex flex-col items-center pt-20 md:pt-0">
        {/* Logo */}
        <motion.div 
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="mb-10 text-center"
        >
            <div className="relative inline-block p-4 border-2 border-primary-500 rounded-lg">
                <div className="absolute -top-3 -left-3 w-6 h-6 border-t-2 border-l-2 border-primary-500" />
                <div className="absolute -top-3 -right-3 w-6 h-6 border-t-2 border-r-2 border-primary-500" />
                <div className="absolute -bottom-3 -left-3 w-6 h-6 border-b-2 border-l-2 border-primary-500" />
                <div className="absolute -bottom-3 -right-3 w-6 h-6 border-b-2 border-r-2 border-primary-500" />
                <h1 className="text-3xl font-black text-primary-500 tracking-tighter">MADEENA</h1>
                <p className="text-[10px] font-bold text-primary-400 tracking-[0.3em] uppercase mt-1">Restaurant</p>
            </div>
        </motion.div>

        {/* Form Container */}
        <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="w-full bg-white rounded-t-[3rem] md:rounded-[3rem] p-10 shadow-2xl"
        >
            <form onSubmit={handleRegister} className="space-y-5">
                <input 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="First name" 
                    className="w-full px-6 py-4 bg-white border-2 border-[#8B3B3B] rounded-2xl text-gray-800 focus:ring-2 focus:ring-brand-orange outline-none transition-all placeholder:text-gray-400 font-medium"
                    required
                />
                <input 
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Last name" 
                    className="w-full px-6 py-4 bg-white border-2 border-[#8B3B3B] rounded-2xl text-gray-800 focus:ring-2 focus:ring-brand-orange outline-none transition-all placeholder:text-gray-400 font-medium"
                    required
                />
                <input 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    type="email"
                    placeholder="Email" 
                    className="w-full px-6 py-4 bg-white border-2 border-[#8B3B3B] rounded-2xl text-gray-800 focus:ring-2 focus:ring-brand-orange outline-none transition-all placeholder:text-gray-400 font-medium"
                    required
                />
                <div className="relative">
                    <input 
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        type={showPassword ? "text" : "password"}
                        placeholder="password" 
                        className="w-full px-6 py-4 bg-white border-2 border-[#8B3B3B] rounded-2xl text-gray-800 focus:ring-2 focus:ring-brand-orange outline-none transition-all placeholder:text-gray-400 font-medium"
                        required
                    />
                    <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400"
                    >
                        {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                    </button>
                </div>

                <div className="pt-4">
                    <button 
                        disabled={loading}
                        className="w-full py-4 brand-gradient text-white rounded-2xl font-bold shadow-xl hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                    >
                        {loading ? <FiLoader className="animate-spin" /> : 'Sign up'}
                    </button>
                </div>
            </form>

            <p className="mt-8 text-center text-sm font-medium text-gray-500">
                Already have an account? <Link to="/login" className="text-brand-orange font-bold hover:underline">Sign in</Link>
            </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
