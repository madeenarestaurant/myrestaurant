import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import Cookies from 'js-cookie';
import { FiMail, FiLock, FiEye, FiEyeOff, FiLoader } from 'react-icons/fi';
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
      const { data } = await api.auth.login({ email, password });
      Cookies.set('token', data.token, { expires: 7 }); // Expires in 7 days
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
        <div className="bg-white rounded-[2.5rem] md:rounded-[3rem] shadow-2xl p-6 md:p-14 relative overflow-hidden">
            {/* Logo Section exactly like image */}
            <div className="flex flex-col items-center mb-6">
                <div className="relative group">
                    <div className="absolute inset-0 bg-[#c59d5f]/10 blur-[30px] rounded-[2rem] scale-110 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                    <div className="relative overflow-hidden rounded-[1.2rem] border-2 border-[#c59d5f]/40 bg-[#3a1515] shadow-xl transition-all duration-500 group-hover:scale-[1.02]">
                        <img 
                            src="https://madeena-res-bucket.s3.us-east-1.amazonaws.com/res-files/titlename.jpeg" 
                            alt="Madeena Logo" 
                            className="w-full h-auto max-w-[160px] md:max-w-[220px] object-contain transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />
                    </div>
                </div>
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
                        <button 
                            type="button" 
                            onClick={() => navigate('/register')}
                            className="text-[10px] font-black text-primary-600 uppercase hover:underline"
                        >
                            Forgot?
                        </button>
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
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
