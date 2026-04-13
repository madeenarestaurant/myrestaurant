import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { FiMail, FiLock, FiEye, FiEyeOff, FiLoader, FiFacebook } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await axiosInstance.post('/admin/login', { email, password });
      localStorage.setItem('token', data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center overflow-hidden bg-brand-dark">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0 scale-110 blur-[2px]"
        style={{ 
            backgroundImage: 'url("https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=2070")',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-lg mx-auto p-4 md:p-8"
      >
        {/* Mobile View - Slide up white container as per image */}
        <div className="bg-white rounded-[3rem] shadow-2xl p-10 md:p-14 relative overflow-hidden">
            {/* Logo Section exactly like image */}
            <div className="flex flex-col items-center mb-12">
                <div className="w-20 h-20 rounded-2xl brand-gradient flex items-center justify-center p-0.5 shadow-xl mb-4 rotate-3">
                    <div className="w-full h-full bg-[#8B3B3B] rounded-2xl border-4 border-[#C19A6B]/30 flex items-center justify-center text-white font-black text-2xl">
                        M
                    </div>
                </div>
                <h1 className="text-3xl font-black text-gray-800 tracking-tighter leading-none">MADEENA</h1>
                <p className="text-[10px] font-black text-[#C19A6B] uppercase tracking-[0.3em] mt-2">Restaurant Since 1975</p>
                
                <div className="w-16 h-1 brand-gradient rounded-full mt-6 opacity-30" />
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                    <div className="relative">
                        <input 
                            type="email" 
                            placeholder="Enter Email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-6 py-4 bg-white border-2 border-[#8B3B3B] rounded-2xl text-gray-800 focus:ring-2 focus:ring-brand-orange outline-none transition-all placeholder:text-gray-400 font-medium"
                            required
                        />
                        <FiMail className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300" />
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between items-center px-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Secret Key</label>
                        <button type="button" className="text-[10px] font-black text-primary-600 uppercase hover:underline">Forgot?</button>
                    </div>
                    <div className="relative">
                        <input 
                            type={showPassword ? 'text' : 'password'} 
                            placeholder="Password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-6 py-4 bg-white border-2 border-[#8B3B3B] rounded-2xl text-gray-800 focus:ring-2 focus:ring-brand-orange outline-none transition-all placeholder:text-gray-400 font-medium"
                            required
                        />
                        <button 
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors"
                        >
                            {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                        </button>
                    </div>
                </div>

                {error && (
                    <motion.p initial={{ x: -10 }} animate={{ x: 0 }} className="text-rose-500 text-xs font-bold text-center bg-rose-50 p-3 rounded-xl border border-rose-100">{error}</motion.p>
                )}

                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full py-5 brand-gradient text-white rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-primary-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                >
                    {loading ? <FiLoader className="animate-spin" /> : 'Sign In Now'}
                </button>
            </form>

            <div className="mt-12">
                <div className="relative flex items-center justify-center mb-8">
                    <div className="absolute w-full h-[1px] bg-gray-100" />
                    <span className="relative bg-white px-4 text-[10px] font-black text-gray-300 uppercase tracking-widest">or continue with</span>
                </div>
                
                <div className="flex gap-4">
                    <button className="flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl border-2 border-gray-50 hover:bg-gray-50 transition-all group">
                        <FcGoogle size={20} />
                        <span className="text-xs font-black text-gray-700 uppercase tracking-tight">Google</span>
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl border-2 border-gray-50 hover:bg-gray-50 transition-all group">
                        <FiFacebook size={20} className="text-[#1877F2]" />
                        <span className="text-xs font-black text-gray-700 uppercase tracking-tight">Facebook</span>
                    </button>
                </div>
            </div>

            <p className="mt-12 text-center text-xs font-bold text-gray-400">
                New to Madeena? <button onClick={() => navigate('/register')} className="text-primary-600 hover:underline">Create an account</button>
            </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
