import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { LuSearchX } from 'react-icons/lu';

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-surface-light dark:bg-surface-dark px-4">
            <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center"
            >
                <div className="w-24 h-24 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center text-primary-600 mx-auto mb-6">
                    <LuSearchX size={48} />
                </div>
                <h1 className="text-6xl font-black text-gray-900 dark:text-white mb-4 tracking-tighter">404</h1>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-300 mb-6">Page Not Found</h2>
                <p className="text-gray-500 max-w-sm mx-auto mb-10 leading-relaxed font-medium">
                    Oops! The page you're looking for doesn't exist or you don't have the necessary permissions to access it.
                </p>
                
                <button 
                    onClick={() => navigate('/')}
                    className="px-8 py-3.5 bg-primary-600 text-white rounded-2xl font-black text-sm hover:bg-primary-700 shadow-xl shadow-primary-500/30 transition-all hover:-translate-y-1 active:scale-95"
                >
                    GO BACK TO DASHBOARD
                </button>
            </motion.div>
        </div>
    );
};

export default NotFound;
