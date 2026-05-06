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

    const isSuccess = type === 'success';

    return (
        <AnimatePresence>
            {message && (
                <motion.div
                    initial={{ opacity: 0, y: -20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    className={`fixed top-24 right-4 md:top-28 md:right-8 z-[10000] min-w-[200px] max-w-[320px] flex items-center justify-between gap-3 px-4 py-3 rounded-xl shadow-lg backdrop-blur-md border ${
                        isSuccess 
                        ? 'bg-emerald-500/95 border-emerald-400 text-white shadow-emerald-500/20' 
                        : 'bg-rose-500/95 border-rose-400 text-white shadow-rose-500/20'
                    }`}
                >
                    <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-[10px] bg-white/20 flex items-center justify-center shrink-0">
                            {isSuccess ? <LuCheck size={14} strokeWidth={3} /> : <LuInfo size={14} strokeWidth={3} />}
                        </div>
                        <span className="text-xs font-bold leading-tight">{message}</span>
                    </div>
                    <button 
                      onClick={onClose} 
                      className="p-1.5 rounded-lg transition-all shrink-0 hover:bg-white/20 active:scale-90"
                    >
                        <LuX size={14} strokeWidth={3} />
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Toast;
