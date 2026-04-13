import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LuCheck, LuInfo, LuX } from 'react-icons/lu';

const Toast = ({ message, type = 'success', onClose }) => {
    if (!message) return null;

    const isSuccess = type === 'success';

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: -20, x: '-50%' }}
                animate={{ opacity: 1, y: 0, x: '-50%' }}
                exit={{ opacity: 0, y: -20, x: '-50%' }}
                className={`fixed top-6 left-1/2 z-[9999] min-w-[300px] flex items-center justify-between gap-4 px-6 py-4 rounded-2xl shadow-2xl backdrop-blur-md border ${
                    isSuccess 
                    ? 'bg-emerald-500/90 border-emerald-400 text-white' 
                    : 'bg-red-500/90 border-red-400 text-white'
                }`}
            >
                <div className="flex items-center gap-3">
                    {isSuccess ? <LuCheck size={20} /> : <LuInfo size={20} />}
                    <span className="text-sm font-bold uppercase tracking-tight">{message}</span>
                </div>
                <button onClick={onClose} className="hover:rotate-90 transition-transform">
                    <LuX size={18} />
                </button>
            </motion.div>
        </AnimatePresence>
    );
};

export default Toast;
