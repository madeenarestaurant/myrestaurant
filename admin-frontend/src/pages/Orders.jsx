import React, { useEffect, useState } from 'react';
import useAdminStore from '../store/useAdminStore';
import { FiSearch, FiFilter, FiCheckCircle, FiClock, FiXCircle, FiTrendingUp, FiMoreVertical, FiTruck, FiBox, FiPackage } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import Toast from '../components/common/Toast';

const Orders = () => {
    const { recentOrders, fetchOrders, updateOrderStatus } = useAdminStore();
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all');
    const [toast, setToast] = useState({ message: '', type: 'success' });

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleStatusChange = async (id, status) => {
        await updateOrderStatus(id, status);
        setToast({ message: `Order status updated to ${status}`, type: 'success' });
    };

    const filteredOrders = recentOrders.filter(o => {
        const matchesSearch = o._id?.includes(search) || o.customerName?.toLowerCase().includes(search.toLowerCase());
        const matchesFilter = filter === 'all' || o.status === filter;
        return matchesSearch && matchesFilter;
    });

    const formatPrice = (p) => `₹${p?.toLocaleString()}`;

    return (
        <div className="space-y-8 pb-10">
            <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />

            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h2 className="text-3xl font-black text-gray-800 tracking-tighter">Live Orders</h2>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Managing {filteredOrders.length} orders in real-time</p>
                </div>
                
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:w-80">
                        <FiSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search Order ID or Name..." 
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-white border border-gray-100 rounded-2xl py-4 pl-14 pr-6 text-sm font-bold shadow-sm focus:ring-2 focus:ring-[#8B3B3B]/20 outline-none transition-all" 
                        />
                    </div>
                </div>
            </div>

            {/* Part 1: Status Filters */}
            <div className="flex gap-4 p-2 bg-white rounded-[2.5rem] w-fit border border-gray-100 shadow-sm overflow-x-auto max-w-full no-scrollbar">
                {[
                    { id: 'all', label: 'All Orders', icon: FiPackage },
                    { id: 'pending', label: 'Pending', icon: FiClock },
                    { id: 'processing', label: 'Kitchen', icon: FiActivity },
                    { id: 'delivered', label: 'Delivered', icon: FiCheckCircle },
                    { id: 'cancelled', label: 'Cancelled', icon: FiXCircle }
                ].map((f) => (
                    <button 
                        key={f.id}
                        onClick={() => setFilter(f.id)}
                        className={clsx(
                            "px-8 py-3 rounded-[2rem] font-bold text-xs uppercase tracking-widest transition-all flex items-center gap-3 shrink-0",
                            filter === f.id ? "bg-[#8B3B3B] text-white shadow-lg" : "text-gray-400 hover:bg-gray-50"
                        )}
                    >
                        {filter === f.id && <motion.div layoutId="orderFilterIcon"><f.icon /></motion.div>}
                        {f.label}
                    </button>
                ))}
            </div>

            {/* Part 2: Detailed Order Grid/Table */}
            <div className="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50">
                                <th className="px-10 py-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Customer / Details</th>
                                <th className="px-10 py-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Kitchen Queue</th>
                                <th className="px-10 py-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Amount</th>
                                <th className="px-10 py-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Status</th>
                                <th className="px-10 py-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            <AnimatePresence>
                                {filteredOrders.map((order, i) => (
                                    <motion.tr 
                                        key={order._id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="group hover:bg-gray-50/10 transition-colors"
                                    >
                                        <td className="px-10 py-8">
                                            <div className="flex items-center gap-5">
                                                <div className="w-14 h-14 rounded-2xl bg-brand-dark/5 flex items-center justify-center font-black text-[#8B3B3B] text-xl">
                                                    {order.customerName?.[0] || 'O'}
                                                </div>
                                                <div>
                                                    <h5 className="text-base font-black text-gray-800">{order.customerName || 'Walk-in Customer'}</h5>
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">ID: #{order._id?.slice(-8)}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className="flex -space-x-2">
                                                {order.items?.slice(0, 3).map((item, idx) => (
                                                    <div key={idx} className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-[10px] font-black text-gray-500 overflow-hidden">
                                                        {item.productImg ? <img src={item.productImg} className="w-full h-full object-cover" /> : item.name?.[0]}
                                                    </div>
                                                ))}
                                                {(order.items?.length || 0) > 3 && (
                                                    <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-800 flex items-center justify-center text-[8px] font-black text-white">
                                                        +{(order.items?.length || 0) - 3}
                                                    </div>
                                                )}
                                            </div>
                                            <p className="text-[10px] font-bold text-gray-300 mt-2 uppercase tracking-widest">
                                                {order.items?.[0]?.productName || 'Food Item'} {order.items?.length > 1 ? `& ${order.items.length - 1} more` : ''}
                                            </p>
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className="px-4 py-2 bg-emerald-50 rounded-xl w-fit">
                                                <span className="text-sm font-black text-emerald-600 tracking-tight">{formatPrice(order.totalAmount)}</span>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className={clsx(
                                                "w-3 h-3 rounded-full mb-1",
                                                order.status === 'delivered' ? 'bg-emerald-500' : 
                                                order.status === 'pending' ? 'bg-orange-400 animate-pulse' : 
                                                order.status === 'processing' ? 'bg-indigo-500' : 'bg-rose-500'
                                            )} />
                                            <span className="text-[10px] font-black text-gray-800 uppercase tracking-widest">{order.status}</span>
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className="flex items-center gap-2">
                                                {order.status === 'pending' && (
                                                    <button 
                                                        onClick={() => handleStatusChange(order._id, 'processing')}
                                                        className="p-3 bg-indigo-50 text-indigo-500 rounded-xl hover:bg-indigo-500 hover:text-white transition-all shadow-sm"
                                                        title="Send to Kitchen"
                                                    >
                                                        <FiTruck size={18} />
                                                    </button>
                                                )}
                                                {(order.status === 'pending' || order.status === 'processing') && (
                                                    <button 
                                                        onClick={() => handleStatusChange(order._id, 'delivered')}
                                                        className="p-3 bg-emerald-50 text-emerald-500 rounded-xl hover:bg-emerald-500 hover:text-white transition-all shadow-sm"
                                                        title="Mark as Delivered"
                                                    >
                                                        <FiCheckCircle size={18} />
                                                    </button>
                                                )}
                                                <button className="p-3 bg-gray-50 text-gray-400 rounded-xl hover:bg-gray-800 hover:text-white transition-all shadow-sm">
                                                    <FiMoreVertical size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>

                {filteredOrders.length === 0 && (
                    <div className="py-40 flex flex-col items-center justify-center text-gray-300">
                        <FiPackage size={64} className="mb-4 opacity-10" />
                        <p className="font-black uppercase tracking-[0.2em] text-sm italic">Nothing on the menu right now...</p>
                    </div>
                )}
            </div>
        </div>
    );
};

// Internal dummy icon for Activity since I switched to Fi
const FiActivity = (props) => (
    <svg 
        stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" {...props}
    >
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
    </svg>
);

export default Orders;
