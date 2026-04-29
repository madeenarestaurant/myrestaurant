import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiAlertCircle, FiLogIn, FiClock } from 'react-icons/fi';
import useAdminStore from '../../store/useAdminStore';

const SessionTimeoutModal = () => {
    const { sessionExpired, setSessionExpired } = useAdminStore();

    const handleBackToLogin = () => {
        setSessionExpired(false);
        window.location.href = '/login';
    };

    return (
        <AnimatePresence>
            {sessionExpired && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6">
                    {/* Backdrop */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-gray-900/80 backdrop-blur-md"
                    />

                    {/* Modal Content */}
                    <motion.div 
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="bg-white rounded-[3rem] w-full max-w-lg p-10 md:p-16 relative z-10 shadow-2xl text-center border border-gray-100"
                    >
                        {/* Animated Icon */}
                        <div className="relative mx-auto w-24 h-24 mb-10">
                            <motion.div 
                                animate={{ 
                                    scale: [1, 1.1, 1],
                                    rotate: [0, 5, -5, 0]
                                }}
                                transition={{ 
                                    repeat: Infinity, 
                                    duration: 4,
                                    ease: "easeInOut"
                                }}
                                className="w-full h-full bg-[#8B3B3B]/10 rounded-3xl flex items-center justify-center text-[#8B3B3B]"
                            >
                                <FiClock size={48} />
                            </motion.div>
                            <div className="absolute -top-2 -right-2 w-8 h-8 bg-rose-500 rounded-full flex items-center justify-center text-white border-4 border-white">
                                <FiAlertCircle size={16} />
                            </div>
                        </div>

                        <h2 className="text-3xl font-black text-gray-800 tracking-tighter mb-4">
                            Session Timed Out
                        </h2>
                        
                        <p className="text-gray-500 font-medium leading-relaxed mb-12">
                            Your secure administrative session has reached its time limit for security reasons. 
                            Please sign in again to continue managing <span className="text-[#8B3B3B] font-black uppercase tracking-widest text-[10px]">Madeena Restaurant</span>.
                        </p>

                        <button 
                            onClick={handleBackToLogin}
                            className="w-full py-5 brand-gradient text-white rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-[#8B3B3B]/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-4"
                        >
                            <FiLogIn size={20} />
                            Sign In Again
                        </button>

                        <p className="mt-8 text-[10px] font-black text-gray-300 uppercase tracking-widest">
                            Secure Logout Performed Automatically
                        </p>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default SessionTimeoutModal;
