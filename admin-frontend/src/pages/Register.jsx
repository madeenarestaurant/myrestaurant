import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff, FiLoader, FiCheckCircle } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import axiosInstance from '../api/axiosInstance';
import Toast from '../components/common/Toast';

const Register = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // 1: Info, 2: OTP, 3: New Password
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        otp: '',
        password: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState({ message: '', type: 'success' });

    const validateEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const validatePassword = (password) => {
        // Alphabet, numeric and a symbol
        const hasAlpha = /[a-zA-Z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        return hasAlpha && hasNumber && hasSymbol && password.length >= 6;
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSendOTP = async (e) => {
        e.preventDefault();
        if (!validateEmail(formData.email)) {
            setToast({ message: 'Please enter a valid email (eg: example@gmail.com)', type: 'error' });
            return;
        }
        setLoading(true);
        try {
            await axiosInstance.post('/admin/send-otp', {
                email: formData.email,
                name: formData.name
            });
            setToast({ message: 'OTP sent to your email!', type: 'success' });
            setStep(2);
        } catch (err) {
            setToast({ message: err.response?.data?.message || 'Failed to send OTP.', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = (e) => {
        e.preventDefault();
        if (formData.otp.length !== 6) {
            setToast({ message: 'Please enter a valid 6-digit OTP', type: 'error' });
            return;
        }
        setStep(3);
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (!validatePassword(formData.password)) {
            setToast({ message: 'Password must contain alphabets, numbers, and at least one symbol.', type: 'error' });
            return;
        }
        if (formData.password !== formData.confirmPassword) {
            setToast({ message: 'Passwords do not match.', type: 'error' });
            return;
        }

        setLoading(true);
        try {
            await axiosInstance.post('/admin/reset-password', {
                email: formData.email,
                otp: formData.otp,
                newPassword: formData.password
            });
            setToast({ message: 'Password updated successfully!', type: 'success' });
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setToast({ message: err.response?.data?.message || 'Failed to reset password.', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-brand-dark flex items-center justify-center relative overflow-hidden font-sans">
            <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />

            {/* Background Image */}
            <div className="absolute inset-0 z-0 scale-110 blur-[2px]">
                <img
                    src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200"
                    className="w-full h-full object-cover opacity-40"
                    alt="background"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/80 to-transparent" />
            </div>

            <div className="relative z-10 w-full max-w-lg px-6 flex flex-col items-center pt-20 md:pt-0">
                {/* Logo */}
                <motion.div
                    initial={{ y: -30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="mb-10 text-center"
                >
                    <div className="relative group">
                        {/* Soft Brand Glow */}
                        <div className="absolute inset-0 bg-[#c59d5f]/10 blur-[30px] rounded-[2rem] scale-110 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                        
                        {/* Professional Rounded Frame */}
                        <div className="relative overflow-hidden rounded-[1.2rem] border-2 border-[#c59d5f]/40 bg-[#3a1515] shadow-xl transition-all duration-500 group-hover:scale-[1.02]">
                            <img 
                                src="https://madeena-res-bucket.s3.us-east-1.amazonaws.com/res-files/titlename.jpeg" 
                                alt="Madeena Logo" 
                                className="w-full h-auto max-w-[180px] md:max-w-[240px] object-contain transition-transform duration-700 group-hover:scale-105"
                            />
                            
                            {/* Premium Shine Animation */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />
                        </div>
                    </div>
                </motion.div>

                {/* Form Container */}
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="w-full bg-white rounded-[2.5rem] md:rounded-[3rem] p-6 md:p-10 shadow-2xl relative overflow-hidden"
                >
                    <div className="mb-8 text-center">
                        <h2 className="text-2xl font-black text-gray-800">Reset Password</h2>
                        <p className="text-gray-500 text-sm font-medium mt-1">Follow the steps to secure your account</p>
                    </div>

                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.form
                                key="step1"
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -20, opacity: 0 }}
                                onSubmit={handleSendOTP}
                                className="space-y-5"
                            >
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                                    <div className="relative">
                                        <input
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="Enter your name"
                                            className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-[#8B3B3B] rounded-2xl text-gray-800 outline-none transition-all placeholder:text-gray-400 font-medium"
                                            required
                                        />
                                        <FiUser className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300" />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                                    <div className="relative">
                                        <input
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            type="email"
                                            placeholder="example@gmail.com"
                                            className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-[#8B3B3B] rounded-2xl text-gray-800 outline-none transition-all placeholder:text-gray-400 font-medium"
                                            required
                                        />
                                        <FiMail className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300" />
                                    </div>
                                </div>

                                <button
                                    disabled={loading}
                                    className="w-full py-5 brand-gradient text-white rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 mt-4"
                                >
                                    {loading ? <FiLoader className="animate-spin" /> : 'Send OTP'}
                                </button>
                            </motion.form>
                        )}

                        {step === 2 && (
                            <motion.form
                                key="step2"
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -20, opacity: 0 }}
                                onSubmit={handleVerifyOTP}
                                className="space-y-5"
                            >
                                <div className="bg-green-50 p-4 rounded-2xl border border-green-100 mb-6 flex items-start gap-4">
                                    <FiCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                                    <p className="text-xs text-green-700 font-medium leading-relaxed">
                                        We've sent a 6-digit verification code to <span className="font-bold">{formData.email}</span>. Please enter it below.
                                    </p>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Safety Code</label>
                                    <input
                                        name="otp"
                                        value={formData.otp}
                                        onChange={handleChange}
                                        placeholder="0 0 0 0 0 0"
                                        className="w-full px-6 py-5 bg-gray-50 border-2 border-transparent focus:border-[#8B3B3B] rounded-2xl text-gray-800 text-center text-2xl font-black tracking-[0.5em] outline-none transition-all placeholder:text-gray-200"
                                        required
                                        maxLength={6}
                                    />
                                </div>

                                <button
                                    className="w-full py-5 brand-gradient text-white rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 mt-4"
                                >
                                    Verify OTP
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className="w-full text-xs font-bold text-gray-400 hover:text-[#8B3B3B] transition-colors"
                                >
                                    Change Email Address
                                </button>
                            </motion.form>
                        )}

                        {step === 3 && (
                            <motion.form
                                key="step3"
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -20, opacity: 0 }}
                                onSubmit={handleResetPassword}
                                className="space-y-5"
                            >
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">New Password</label>
                                    <div className="relative">
                                        <input
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            type={showPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-[#8B3B3B] rounded-2xl text-gray-800 outline-none transition-all placeholder:text-gray-400 font-medium"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300"
                                        >
                                            {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                                        </button>
                                    </div>
                                    <p className="text-[9px] text-gray-400 font-bold ml-1 italic uppercase tracking-tighter">
                                        Use letters, numbers & symbols (eg: Pass@123)
                                    </p>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Confirm New Password</label>
                                    <div className="relative">
                                        <input
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            type={showPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-[#8B3B3B] rounded-2xl text-gray-800 outline-none transition-all placeholder:text-gray-400 font-medium"
                                            required
                                        />
                                    </div>
                                </div>

                                <button
                                    disabled={loading}
                                    className="w-full py-5 brand-gradient text-white rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 mt-4"
                                >
                                    {loading ? <FiLoader className="animate-spin" /> : 'Update Password'}
                                </button>
                            </motion.form>
                        )}
                    </AnimatePresence>

                    <p className="mt-8 text-center text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        Remembered it? <Link to="/login" className="text-[#8B3B3B] hover:underline">Back to Login</Link>
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default Register;
