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
    FiShoppingBag,
    FiCheck,
    FiX,
    FiClock,
    FiHash
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import Toast from '../components/common/Toast';
import { format } from 'date-fns';

const Orders = () => {
    const { recentOrders, fetchOrders, updateOrderStatus, stats, fetchStats } = useAdminStore();
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all');
    const [toast, setToast] = useState({ message: '', type: 'success' });
    const [expandedId, setExpandedId] = useState(null);

    useEffect(() => {
        fetchOrders();
        fetchStats();
    }, []);

    const handleStatusUpdate = async (id, status, paymentStatus) => {
        const updateData = { status };
        if (paymentStatus) updateData.paymentStatus = paymentStatus;
        
        await updateOrderStatus(id, updateData);
        setToast({ message: `Order updated to ${status}`, type: 'success' });
    };

    const filteredOrders = (recentOrders || []).filter(o => {
        const matchesSearch = (o._id || '').includes(search) || (o.customerName || '').toLowerCase().includes(search.toLowerCase()) || (o.token || '').includes(search);
        const matchesFilter = filter === 'all' || o.status === filter;
        return matchesSearch && matchesFilter;
    });

    const formatPrice = (p) => `₹${p?.toLocaleString('en-IN')}`;

    return (
        <div className="space-y-6 md:space-y-8 pb-32 md:pb-10">
            <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />

            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-[2rem] border border-gray-100 p-6 md:p-8 shadow-sm">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h4 className="text-sm font-bold text-gray-400 capitalize">Order overview</h4>
                            <p className="text-[10px] text-gray-300 font-bold uppercase tracking-widest mt-1">Live Statistics</p>
                        </div>
                    </div>
                    <div className="flex items-end gap-3 mb-6">
                        <h2 className="text-3xl font-black text-gray-800 tracking-tight leading-none">{stats.totalOrders}</h2>
                        <span className="text-xs font-black text-emerald-500 flex items-center gap-1 mb-1">
                            Total Orders
                        </span>
                    </div>
                    <div className="flex gap-1.5 md:gap-2">
                        {[
                            { color: 'bg-amber-400', label: 'Requested', count: stats.pendingOrders },
                            { color: 'bg-emerald-400', label: 'Completed', count: stats.completeOrders },
                            { color: 'bg-rose-400', label: 'Cancelled', count: stats.cancelledOrders },
                        ].map((box, i) => (
                            <div key={i} className="flex-1">
                                <div className={clsx("h-2.5 rounded-sm mb-1.5", box.color)} />
                                <p className="text-[7px] md:text-[8px] font-black text-gray-400 uppercase tracking-tighter whitespace-nowrap">{box.label}({box.count})</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-[2rem] border border-gray-100 p-6 md:p-8 shadow-sm">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h4 className="text-sm font-bold text-gray-400">Revenue</h4>
                            <p className="text-[10px] text-gray-300 font-bold uppercase tracking-widest mt-1">Total earnings</p>
                        </div>
                    </div>
                    <div className="flex items-end gap-3 mb-4">
                        <h2 className="text-3xl font-black text-gray-800 tracking-tight leading-none">₹{stats.totalRevenue.toLocaleString()}</h2>
                        <span className="text-xs font-black text-emerald-500 flex items-center gap-1 mb-1">
                            Current Period
                        </span>
                    </div>
                    <div className="w-full bg-gray-50 h-12 rounded-2xl flex items-center px-4 mt-6">
                         <div className="flex items-center gap-2">
                             <div className="w-2 h-2 rounded-full bg-[#8B3B3B]"></div>
                             <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Revenue Tracking Active</span>
                         </div>
                    </div>
                </div>
            </div>

            {/* Search & Filter */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex gap-4 md:gap-8 border-b border-gray-100 px-4 md:px-0 overflow-x-auto no-scrollbar w-full md:w-auto">
                    {[
                        { id: 'all', label: 'All' },
                        { id: 'requested', label: 'Requested' },
                        { id: 'completed', label: 'Completed' },
                        { id: 'cancelled', label: 'Cancelled' }
                    ].map((t) => (
                        <button 
                            key={t.id}
                            onClick={() => setFilter(t.id)}
                            className={clsx(
                                "pb-4 font-bold text-sm md:text-base capitalize transition-all relative shrink-0",
                                filter === t.id ? "text-[#8B3B3B]" : "text-gray-300 hover:text-gray-500"
                            )}
                        >
                            {t.label} 
                            {filter === t.id && (
                                <motion.div layoutId="orderTab" className="absolute bottom-0 left-0 right-0 h-1 bg-[#8B3B3B] rounded-full" />
                            )}
                        </button>
                    ))}
                </div>

                <div className="relative w-full md:w-72">
                    <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                        type="text"
                        placeholder="Search ID, Name or Token..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-white border border-gray-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#8B3B3B]/10 transition-all shadow-sm"
                    />
                </div>
            </div>

            {/* Order List (Table Style) */}
            <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                    {filteredOrders.map((order) => (
                        <motion.div 
                            key={order._id}
                            layout
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            className="bg-white rounded-[1.5rem] md:rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden"
                        >
                            {/* Quick View Row (Header-like) */}
                            <div className="p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex items-center gap-4 flex-1">
                                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-[#8B3B3B]/5 flex items-center justify-center text-[#8B3B3B] shrink-0">
                                        <FiShoppingBag size={20} />
                                    </div>
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">#{order._id?.slice(-6)}</span>
                                            <span className="w-1 h-1 rounded-full bg-gray-200"></span>
                                            <h3 className="font-black text-gray-800 text-sm truncate">{order.customerName || 'Walk-in'}</h3>
                                        </div>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-[10px] text-gray-400 font-bold flex items-center gap-1">
                                                <FiClock size={10} /> {format(new Date(order.createdAt), 'hh:mm a')}
                                            </span>
                                            <span className="w-1 h-1 rounded-full bg-gray-200"></span>
                                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">{order.mode || 'dine-in'}</span>
                                        </div>
                                        {/* Items Summary (Requested: show all items ordered) */}
                                        <div className="mt-2 flex flex-wrap gap-1">
                                            {order.items?.map((item, i) => (
                                                <span key={i} className="text-[9px] font-bold text-gray-400 bg-gray-50 px-2 py-0.5 rounded-md border border-gray-100">
                                                    {item.product?.name} <span className="text-[#8B3B3B]/40">x{item.quantity}</span>
                                                </span>
                                            ))}
                                            {!order.items?.length && <span className="text-[9px] text-gray-300 italic">No items listed</span>}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between md:justify-end gap-6 md:gap-12 flex-1">
                                    <div className="text-left md:text-right">
                                        <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest mb-1">Token</p>
                                        <div className="flex items-center gap-1.5 text-[#8B3B3B]">
                                            <FiHash size={12} />
                                            <span className="text-xs font-black tracking-widest">{order.token || 'N/A'}</span>
                                        </div>
                                    </div>

                                    <div className="text-left md:text-right">
                                        <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest mb-1">Total</p>
                                        <p className="text-sm md:text-base font-black text-gray-800">{formatPrice(order.totalAmount)}</p>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <span className={clsx(
                                            "px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border",
                                            order.status === 'requested' ? "bg-amber-50 text-amber-600 border-amber-100" :
                                            order.status === 'completed' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                                            "bg-rose-50 text-rose-600 border-rose-100"
                                        )}>
                                            {order.status}
                                        </span>
                                        <button 
                                            onClick={() => setExpandedId(expandedId === order._id ? null : order._id)}
                                            className="p-2 hover:bg-gray-50 rounded-xl transition-colors text-gray-400 hover:text-gray-800"
                                        >
                                            <motion.div animate={{ rotate: expandedId === order._id ? 180 : 0 }}>
                                                <FiChevronLeft className="-rotate-90" />
                                            </motion.div>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Actions bar for Requested */}
                            {order.status === 'requested' && expandedId !== order._id && (
                                <div className="px-6 pb-6 flex gap-3">
                                    <button 
                                        onClick={() => handleStatusUpdate(order._id, 'cancelled')}
                                        className="px-6 h-10 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 transition-all flex items-center justify-center gap-2 font-black text-[9px] uppercase tracking-widest"
                                    >
                                        <FiX size={14} /> Cancel
                                    </button>
                                    <button 
                                        onClick={() => handleStatusUpdate(order._id, 'completed', 'Completed')}
                                        className="px-8 h-10 rounded-xl bg-[#8B3B3B] text-white hover:bg-[#6D2E2E] shadow-lg shadow-[#8B3B3B]/10 transition-all flex items-center justify-center gap-2 font-black text-[9px] uppercase tracking-widest"
                                    >
                                        <FiCheck size={14} /> Mark as Paid & Done
                                    </button>
                                </div>
                            )}

                            {/* Expandable Details */}
                            <AnimatePresence>
                                {expandedId === order._id && (
                                    <motion.div 
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="border-t border-gray-50"
                                    >
                                        <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                                            {/* Details Table */}
                                            <div className="space-y-6">
                                                <div>
                                                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Customer Details</h4>
                                                    <table className="w-full text-xs">
                                                        <tbody className="space-y-4 block">
                                                            <tr className="flex justify-between items-center">
                                                                <td className="text-gray-400 font-bold uppercase tracking-tighter">Full Name</td>
                                                                <td className="text-gray-800 font-black">{order.customerName || 'Walk-in'}</td>
                                                            </tr>
                                                            <tr className="flex justify-between items-center">
                                                                <td className="text-gray-400 font-bold uppercase tracking-tighter">Phone Number</td>
                                                                <td className="text-gray-800 font-black">{order.phone || 'N/A'}</td>
                                                            </tr>
                                                            <tr className="flex justify-between items-center">
                                                                <td className="text-gray-400 font-bold uppercase tracking-tighter">Email Address</td>
                                                                <td className="text-gray-800 font-black lowercase">{order.email || 'N/A'}</td>
                                                            </tr>
                                                            <tr className="flex flex-col gap-2 pt-2">
                                                                <td className="text-gray-400 font-bold uppercase tracking-tighter">Delivery Address</td>
                                                                <td className="text-gray-700 font-medium bg-gray-50 p-4 rounded-2xl leading-relaxed italic border border-transparent">
                                                                    {order.addressDetails ? (
                                                                        `${order.addressDetails.street}, ${order.addressDetails.place}, ${order.addressDetails.city} - ${order.addressDetails.pincode}`
                                                                    ) : order.address || 'Dining inside restaurant'}
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>

                                                <div>
                                                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Payment & Logistics</h4>
                                                    <table className="w-full text-xs">
                                                        <tbody className="space-y-4 block">
                                                            <tr className="flex justify-between items-center">
                                                                <td className="text-gray-400 font-bold uppercase tracking-tighter">Method</td>
                                                                <td className="text-gray-800 font-black uppercase tracking-widest">{order.paymentMethod || 'COD'}</td>
                                                            </tr>
                                                            <tr className="flex justify-between items-center">
                                                                <td className="text-gray-400 font-bold uppercase tracking-tighter">Status</td>
                                                                <td className={clsx("font-black uppercase tracking-widest", order.paymentStatus === 'Completed' ? 'text-emerald-500' : 'text-amber-500')}>
                                                                    {order.paymentStatus || 'Pending'}
                                                                </td>
                                                            </tr>
                                                            <tr className="flex justify-between items-center">
                                                                <td className="text-gray-400 font-bold uppercase tracking-tighter">Order Date</td>
                                                                <td className="text-gray-800 font-black">{format(new Date(order.createdAt), 'PPP')}</td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>

                                                {order.note && (
                                                    <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100">
                                                        <p className="text-[9px] font-black text-amber-600 uppercase tracking-widest mb-1">Customer Note</p>
                                                        <p className="text-xs font-bold text-amber-800 italic leading-relaxed">"{order.note}"</p>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Items Table */}
                                            <div className="bg-gray-50/50 rounded-3xl p-6 h-fit border border-gray-100">
                                                <div className="flex justify-between items-center mb-6">
                                                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Items List</h4>
                                                    <span className="px-3 py-1 bg-white rounded-full text-[9px] font-black text-gray-400 shadow-sm">{order.items?.length || 0} ITEMS</span>
                                                </div>
                                                
                                                <table className="w-full text-xs">
                                                    <thead>
                                                        <tr className="text-[9px] font-black text-gray-300 uppercase tracking-widest">
                                                            <th className="text-left pb-4">Product</th>
                                                            <th className="text-center pb-4">Unit Price</th>
                                                            <th className="text-center pb-4">Qty</th>
                                                            <th className="text-right pb-4">Total</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-gray-100/50">
                                                        {order.items?.map((item, idx) => (
                                                            <tr key={idx} className="group">
                                                                <td className="py-4 flex items-center gap-3">
                                                                    <div className="w-10 h-10 rounded-xl overflow-hidden bg-gray-100 border border-gray-200/50 shrink-0">
                                                                        {item.product?.img ? (
                                                                            <img src={item.product.img} alt="" className="w-full h-full object-cover" />
                                                                        ) : (
                                                                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                                                <FiShoppingBag size={14} />
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                    <div>
                                                                        <p className="font-black text-gray-800 group-hover:text-[#8B3B3B] transition-colors">{item.product?.name || 'Unknown Product'}</p>
                                                                        <p className="text-[9px] text-gray-400 font-bold uppercase mt-0.5">{item.product?.category?.name || 'Uncategorized'}</p>
                                                                    </div>
                                                                </td>
                                                                <td className="py-4 text-center font-bold text-gray-400">{formatPrice(item.price)}</td>
                                                                <td className="py-4 text-center font-black text-gray-800">x{item.quantity}</td>
                                                                <td className="py-4 text-right font-black text-gray-800">{formatPrice(item.price * item.quantity)}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>

                                                <div className="mt-6 pt-6 border-t border-gray-200/50 flex justify-between items-end">
                                                    <div>
                                                        <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest mb-1">Final Amount</p>
                                                        <p className="text-xl font-black text-[#8B3B3B]">{formatPrice(order.totalAmount)}</p>
                                                    </div>
                                                    {order.status === 'requested' && (
                                                        <button 
                                                            onClick={() => handleStatusUpdate(order._id, 'completed', 'Completed')}
                                                            className="px-6 py-3 bg-[#8B3B3B] text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-[#8B3B3B]/20 hover:scale-[1.02] transition-all"
                                                        >
                                                            Mark as Completed
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
            
            {filteredOrders.length === 0 && (
                <div className="py-32 bg-white rounded-[3rem] border border-gray-100 text-center">
                    <div className="w-20 h-20 bg-gray-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-gray-300">
                        <FiShoppingBag size={32} />
                    </div>
                    <p className="text-gray-400 font-black uppercase tracking-widest text-sm">No orders found</p>
                    <p className="text-gray-300 text-xs mt-2 font-bold">Try adjusting your filters or search query</p>
                </div>
            )}
        </div>
    );
};

export default Orders;

