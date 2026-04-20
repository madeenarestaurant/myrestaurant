import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LuCheck, LuInfo, LuX } from 'react-icons/lu';

const Toast = ({ message, type = 'success', onClose }) => {
    React.useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                onClose();
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [message, onClose]);

    if (!message) return null;

    const isSuccess = type === 'success';

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: -50, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -50, scale: 0.95 }}
                transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                className={`fixed top-4 left-1/2 -translate-x-1/2 z-[10000] min-w-[200px] flex items-center justify-between gap-6 px-5 py-3 rounded-full shadow-[0_20px_40px_rgba(0,0,0,0.15)] border ${
                    isSuccess 
                    ? 'bg-white border-emerald-100 text-emerald-600' 
                    : 'bg-white border-rose-100 text-rose-500'
                }`}
            >
                <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        isSuccess ? 'bg-emerald-50' : 'bg-rose-50'
                    }`}>
                        {isSuccess ? <LuCheck size={16} /> : <LuInfo size={16} />}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest">{message}</span>
                </div>
                <button 
                  onClick={onClose} 
                  className={`p-1 rounded-full transition-colors ${
                    isSuccess ? 'hover:bg-emerald-50' : 'hover:bg-rose-50'
                  }`}
                >
                    <LuX size={14} />
                </button>
            </motion.div>
        </AnimatePresence>
    );
};

export default Toast;
