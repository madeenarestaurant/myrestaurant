import React, { useEffect, useState } from 'react';
import useAdminStore from '../store/useAdminStore';
import { 
    FiSearch, 
    FiFilter, 
    FiChevronLeft, 
    FiBell, 
    FiUser, 
    FiPlus, 
    FiArrowUpRight, 
    FiArrowDownRight,
    FiMoreHorizontal,
    FiShoppingBag
} from 'react-icons/fi';
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
        setToast({ message: `Order marked as ${status}`, type: 'success' });
    };

    const orders = recentOrders?.length > 0 ? recentOrders : [
        {
            _id: '24567876',
            customerName: 'stephn levisata',
            method: 'delivery',
            date: '12-4-2026',
            items: [{ name: 'Grilled chicken', quantity: 1 }],
            totalAmount: 650,
            status: 'pending',
            type: 'Dine in',
            time: '3:30pm'
        }
    ];

    const filteredOrders = orders.filter(o => {
        const matchesSearch = o._id?.includes(search) || o.customerName?.toLowerCase().includes(search.toLowerCase());
        const matchesFilter = filter === 'all' || o.status === filter;
        return matchesSearch && matchesFilter;
    });

    const formatPrice = (p) => `₹${p?.toLocaleString()}`;

    return (
        <div className="space-y-6 md:space-y-8 pb-32 md:pb-10">
            <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />

            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-[2rem] border border-gray-100 p-6 md:p-8 shadow-sm">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h4 className="text-sm font-bold text-gray-400 capitalize">Order overview</h4>
                            <p className="text-[10px] text-gray-300 font-bold uppercase tracking-widest mt-1">Today order</p>
                        </div>
                        <div className="px-3 py-1 bg-gray-50 border border-gray-100 rounded-xl text-[10px] font-black uppercase text-gray-400">week</div>
                    </div>
                    <div className="flex items-end gap-3 mb-6">
                        <h2 className="text-3xl font-black text-gray-800 tracking-tight leading-none">2,250</h2>
                        <span className="text-xs font-black text-emerald-500 flex items-center gap-1 mb-1">
                            <FiArrowUpRight size={14} /> +10.5%
                        </span>
                        <span className="text-[10px] font-bold text-gray-300 mb-1 ml-auto">compare to last week</span>
                    </div>
                    <div className="flex gap-1.5 md:gap-2">
                        {[
                            { color: 'bg-indigo-400', label: 'Active order', count: 0 },
                            { color: 'bg-orange-400', label: 'Pending order', count: 6 },
                            { color: 'bg-emerald-400', label: 'On delivery', count: 0 },
                            { color: 'bg-indigo-100', label: 'Delivered', count: 1750 }
                        ].map((box, i) => (
                            <div key={i} className="flex-1">
                                <div className={clsx("h-2.5 rounded-sm mb-1.5", box.color)} />
                                <p className="text-[7px] md:text-[8px] font-black text-gray-400 uppercase tracking-tighter whitespace-nowrap">{box.label}({box.count})</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-[2rem] border border-gray-100 p-6 md:p-8 shadow-sm relative overflow-hidden">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h4 className="text-sm font-bold text-gray-400">Revenue</h4>
                            <p className="text-[10px] text-gray-300 font-bold uppercase tracking-widest mt-1">Total revenue</p>
                        </div>
                        <div className="px-3 py-1 bg-gray-50 border border-gray-100 rounded-xl text-[10px] font-black uppercase text-gray-400">last month</div>
                    </div>
                    <div className="flex items-end gap-3 mb-4">
                        <h2 className="text-3xl font-black text-gray-800 tracking-tight leading-none">15k</h2>
                        <span className="text-xs font-black text-rose-500 flex items-center gap-1 mb-1">
                            <FiArrowDownRight size={14} /> -07.5%
                        </span>
                        <span className="text-[10px] font-bold text-gray-300 mb-1 ml-auto">compare to last week</span>
                    </div>
                    {/* Semi-Circle Gauge SVG */}
                    <div className="flex justify-center relative -mb-10 mt-4">
                        <svg className="w-48 h-24" viewBox="0 0 100 50">
                            <path d="M 10 50 A 40 40 0 1 1 90 50" fill="none" stroke="#f1f5f9" strokeWidth="12" />
                            <path d="M 10 50 A 40 40 0 0 1 70 15" fill="none" stroke="#c59d5f" strokeWidth="12" strokeLinecap="round" />
                            <path d="M 72 17 A 40 40 0 0 1 90 50" fill="none" stroke="#fb7185" strokeWidth="12" strokeLinecap="round" />
                        </svg>
                        <div className="absolute bottom-10 flex gap-10">
                            <div className="text-center">
                                <p className="text-[8px] font-black text-gray-400 uppercase">Online(10K)</p>
                            </div>
                            <div className="text-center">
                                <p className="text-[8px] font-black text-gray-400 uppercase">Cash(5K)</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-8 border-b border-gray-100 px-4 md:px-0 overflow-x-auto no-scrollbar">
                {[
                    { id: 'all', label: 'All Orders' },
                    { id: 'pending', label: 'pending', count: 3 },
                    { id: 'complete', label: 'completed', count: 20 },
                    { id: 'cancelled', label: 'cancelled' }
                ].map((t) => (
                    <button 
                        key={t.id}
                        onClick={() => setFilter(t.id)}
                        className={clsx(
                            "pb-4 font-bold text-sm md:text-base capitalize transition-all relative shrink-0",
                            filter === t.id ? "text-rose-800" : "text-gray-300 hover:text-gray-500"
                        )}
                    >
                        {t.label} 
                        {t.count && <span className="ml-1 text-[#8B3B3B]/40">[{t.count}]</span>}
                        {filter === t.id && (
                            <motion.div layoutId="orderTab" className="absolute bottom-0 left-0 right-0 h-1 bg-[#8B3B3B] rounded-full" />
                        )}
                    </button>
                ))}
            </div>

            {/* Order Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-6 md:gap-8">
                <AnimatePresence mode="popLayout">
                    {filteredOrders.map((order, idx) => (
                        <motion.div 
                            key={order._id || idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-[2.5rem] p-6 md:p-8 shadow-sm border border-gray-100 hover:shadow-xl hover:shadow-gray-200/50 transition-all group relative"
                        >
                            {/* Card Header */}
                            <div className="flex justify-between items-start mb-8 relative">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center text-[#8B3B3B] transition-transform group-hover:rotate-12">
                                        <FiShoppingBag size={22} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-rose-800 text-sm">{order.type || 'Dine in'}</h3>
                                        <p className="text-[10px] text-gray-400 font-medium">Table no:03 / Token no:08</p>
                                        <p className="text-[10px] text-gray-400 font-medium">Time:{order.time || '3:30pm'}</p>
                                    </div>
                                </div>
                                <FiMoreHorizontal className="text-gray-300" />
                            </div>

                            {/* Details List */}
                            <div className="space-y-4 mb-8">
                                <DetailRow label="Id:" value={order._id?.slice(-8)} />
                                <DetailRow label="Name:" value={order.customerName} />
                                <DetailRow label="Method:" value={order.method} highlight />
                                <DetailRow label="Date:" value={order.date} />
                                <DetailRow label="Items:" value={`${order.items?.[0]?.name} (1)`} />
                                <DetailRow label="Price:" value={formatPrice(order.totalAmount)} bold />
                                <DetailRow label="Status:" value={order.status} status />
                            </div>

                            {/* Divider Dot Line */}
                            <div className="border-t border-dashed border-gray-200 pt-6 flex justify-between items-center">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-bold text-gray-300 uppercase">Billed</span>
                                    <span className="text-[11px] font-black text-emerald-500 uppercase">completed</span>
                                </div>
                                
                                {order.status === 'pending' && (
                                    <button 
                                        onClick={() => handleStatusChange(order._id, 'complete')}
                                        className="px-8 py-3 bg-[#8B3B3B]/5 text-[#8B3B3B] hover:bg-[#8B3B3B] hover:text-white rounded-xl transition-all font-black text-[10px] uppercase tracking-widest shadow-sm hover:shadow-lg"
                                    >
                                        Approve
                                    </button>
                                )}
                            </div>

                            {/* Subtle Decorative Gradient */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#8B3B3B]/5 to-transparent rounded-tr-[2.5rem] -z-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
            
            {filteredOrders.length === 0 && (
                <div className="py-20 text-center animate-pulse">
                    <p className="text-gray-300 font-black uppercase tracking-widest text-sm">No orders found in this section</p>
                </div>
            )}
        </div>
    );
};

const DetailRow = ({ label, value, highlight, bold, status }) => (
    <div className="flex justify-between items-center group/row">
        <span className="text-xs font-bold text-gray-300">{label}</span>
        <span className={clsx(
            "text-xs transition-all",
            highlight ? "text-orange-400" : "text-gray-600",
            bold && "font-black text-gray-800",
            status && "bg-gray-50 px-3 py-1 rounded-lg text-[10px] font-black uppercase text-gray-400 border border-gray-100",
            !bold && !status && "font-bold"
        )}>
            {value}
        </span>
    </div>
);

export default Orders;
