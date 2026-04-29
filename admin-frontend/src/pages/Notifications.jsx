import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import { motion, AnimatePresence } from 'framer-motion';
import { FiBell, FiTrash2, FiCheck, FiX, FiClock, FiShoppingBag, FiCalendar, FiAlertCircle } from 'react-icons/fi';
import useAdminStore from '../store/useAdminStore';
import { clsx } from 'clsx';
import { format } from 'date-fns'; // date-fns is installed, please restart dev server if error persists

const Notifications = () => {
    const { setActiveTab } = useAdminStore();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchNotifications = async () => {
        try {
            const res = await axiosInstance.get('/notifications');
            setNotifications(res.data);
        } catch (err) {
            console.error('Error fetching notifications:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const deleteNotification = async (id) => {
        try {
            await axiosInstance.delete(`/notifications/${id}`);
            setNotifications(notifications.filter(n => n._id !== id));
        } catch (err) {
            console.error('Error deleting notification:', err);
        }
    };

    const clearAll = async () => {
        try {
            await axiosInstance.delete('/notifications');
            setNotifications([]);
        } catch (err) {
            console.error('Error clearing notifications:', err);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
                <div className="w-16 h-16 border-4 border-[#8B3B3B]/10 border-t-[#8B3B3B] rounded-full animate-spin" />
                <span className="font-black text-gray-400 uppercase tracking-widest text-[10px]">Loading Alerts...</span>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 max-w-4xl mx-auto pb-20">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-black text-gray-800 flex items-center gap-3">
                        <FiBell className="text-[#8B3B3B]" /> Notifications
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">Manage your order and reservation alerts</p>
                </div>
                {notifications.length > 0 && (
                    <button 
                        onClick={clearAll}
                        className="flex items-center gap-2 px-4 py-2 bg-rose-50 text-rose-600 rounded-xl font-bold text-xs hover:bg-rose-100 transition-colors"
                    >
                        <FiTrash2 size={14} /> Clear All
                    </button>
                )}
            </div>

            <div className="space-y-4">
                <AnimatePresence mode='popLayout'>
                    {notifications.length === 0 ? (
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-[2.5rem] p-12 text-center border-2 border-dashed border-gray-100"
                        >
                            <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-gray-300">
                                <FiBell size={32} />
                            </div>
                            <p className="text-gray-400 font-bold">No new notifications</p>
                        </motion.div>
                    ) : (
                        notifications.map((notification) => (
                            <motion.div
                                key={notification._id}
                                layout
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                onClick={() => setActiveTab(notification.type === 'reservation' ? 'reservations' : 'orders')}
                                className={clsx(
                                    "p-6 rounded-[1.5rem] shadow-sm border flex items-start gap-4 group cursor-pointer transition-all duration-300",
                                    notification.type === 'reservation' 
                                        ? "bg-indigo-50/30 border-indigo-100 hover:bg-indigo-50/50 hover:shadow-indigo-200/20" 
                                        : "bg-white border-gray-100 hover:shadow-xl hover:shadow-gray-200/40"
                                )}
                            >
                                <div className={clsx(
                                    "w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
                                    notification.type === 'order' ? 'bg-amber-50 text-amber-600' : 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                                )}>
                                    {notification.type === 'order' ? <FiShoppingBag size={20} /> : <FiCalendar size={20} />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <p className={clsx(
                                            "text-sm font-bold leading-snug",
                                            notification.type === 'reservation' ? "text-indigo-900" : "text-gray-800"
                                        )}>
                                            {notification.message}
                                        </p>
                                        {notification.type === 'reservation' && (
                                            <span className="px-2 py-0.5 rounded-full bg-indigo-600 text-[8px] font-black uppercase tracking-widest text-white shrink-0">
                                                Action Required
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-3 mt-2">
                                        <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                                            <FiClock size={12} /> {format(new Date(notification.createdAt), 'hh:mm a')}
                                        </span>
                                        <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                                            <FiCalendar size={12} /> {format(new Date(notification.createdAt), 'MMM dd, yyyy')}
                                        </span>
                                    </div>
                                </div>
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        deleteNotification(notification._id);
                                    }}
                                    className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-rose-50 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all shrink-0"
                                >
                                    <FiX size={18} />
                                </button>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Notifications;

