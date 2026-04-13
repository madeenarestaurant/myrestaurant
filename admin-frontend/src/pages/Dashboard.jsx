import React, { useEffect } from 'react';
import StatsCard from '../components/dashboard/StatsCard';
import { FiBox, FiShoppingCart, FiAlertCircle, FiClock, FiTrendingUp, FiChevronDown, FiMoreHorizontal, FiActivity } from 'react-icons/fi';
import useAdminStore from '../store/useAdminStore';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

const Dashboard = () => {
  const { stats, recentOrders, fetchStats, loading } = useAdminStore();

  useEffect(() => {
    fetchStats();
  }, []);

  const formatCurrency = (val) => `₹${val?.toLocaleString()}`;

  return (
    <div className="space-y-8 pb-10">
      {/* Stats Cards - Using Real Data */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatsCard 
          title="Total order" 
          value={stats.totalOrders} 
          icon={FiShoppingCart} 
          trend={12.4}
          positive={true}
        />
        <StatsCard 
          title="Order complete" 
          value={stats.completeOrders} 
          icon={FiBox} 
          trend={15.2}
          positive={true}
        />
        <StatsCard 
          title="Order cancelled" 
          value={stats.cancelledOrders} 
          icon={FiAlertCircle} 
          trend={2.1}
          positive={false}
        />
        <StatsCard 
          title="Order pending" 
          value={stats.pendingOrders} 
          icon={FiClock} 
          trend={10.5}
          positive={true}
        />
      </div>

      {/* Analytics & Today Summary */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Main Chart Section */}
          <div className="xl:col-span-2 bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm relative overflow-hidden">
                <div className="flex justify-between items-center mb-10 relative z-10">
                    <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <FiActivity className="text-primary-500" />
                        Order Analytics
                    </h3>
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                            <span className="text-[10px] font-black text-gray-400 uppercase">online</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                            <span className="text-[10px] font-black text-gray-400 uppercase">offline</span>
                        </div>
                        <div className="px-4 py-1.5 bg-gray-50 rounded-xl text-[10px] font-black uppercase text-gray-400 border border-gray-100 flex items-center gap-2 cursor-pointer hover:bg-gray-100 transition-all">
                            years <FiChevronDown />
                        </div>
                    </div>
                </div>

                <div className="h-[350px] relative">
                    <svg className="w-full h-full" viewBox="0 0 1000 300" preserveAspectRatio="none">
                        {[0, 1, 2, 3, 4, 5].map(v => (
                            <line key={v} x1="0" y1={v * 60} x2="1000" y2={v * 60} stroke="#f8f8f8" strokeWidth="1.5" />
                        ))}
                        
                        <path 
                            d="M0,220 C100,180 180,240 250,230 C350,210 400,100 500,180 C600,260 750,50 850,80 C930,100 1000,150 1000,150" 
                            fill="none" 
                            stroke="#10B981" 
                            strokeWidth="4" 
                            strokeLinecap="round"
                            className="drop-shadow-[0_10px_10px_rgba(16,185,129,0.2)]"
                        />
                        <path 
                            d="M0,150 C100,155 200,130 300,180 C400,280 500,120 600,160 C700,200 850,240 1000,200" 
                            fill="none" 
                            stroke="#EF4444" 
                            strokeWidth="4" 
                            strokeLinecap="round"
                            className="drop-shadow-[0_10px_10px_rgba(239,68,68,0.2)]"
                        />
                    </svg>
                    <div className="flex justify-between mt-6 px-2 text-[10px] font-black text-gray-300 uppercase tracking-widest">
                        {['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'].map(m => <span key={m}>{m}</span>)}
                    </div>
                </div>
          </div>

          {/* Today Summary */}
          <div className="bg-white rounded-[2rem] border border-gray-100 p-8 shadow-sm flex flex-col h-full">
                <div className="flex justify-between items-center mb-8">
                    <h3 className="text-lg font-bold text-gray-800">Quick Stats</h3>
                    <FiMoreHorizontal className="text-gray-300" />
                </div>
                
                <div className="space-y-6 flex-1">
                    <div className="flex items-center gap-6 p-4 rounded-[1.5rem] bg-emerald-50/50 border border-emerald-100/50 group hover:shadow-lg hover:shadow-emerald-500/5 transition-all">
                        <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-emerald-500 font-black text-xl">
                            {stats.totalProducts}
                        </div>
                        <div>
                            <h5 className="text-sm font-bold text-gray-800">Total Products</h5>
                            <p className="text-[10px] font-black text-emerald-600 uppercase">In Inventory</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-6 p-4 rounded-[1.5rem] bg-indigo-50/50 border border-indigo-100/50 group hover:shadow-lg hover:shadow-indigo-500/5 transition-all">
                        <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-indigo-500 font-black text-xl">
                            {stats.totalCategories}
                        </div>
                        <div>
                            <h5 className="text-sm font-bold text-gray-800">Categories</h5>
                            <p className="text-[10px] font-black text-indigo-600 uppercase">Live Menus</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-6 p-4 rounded-[1.5rem] bg-orange-50/50 border border-orange-100/50 group hover:shadow-lg hover:shadow-orange-500/5 transition-all">
                        <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-orange-500 font-black text-xl">
                            {stats.totalReservations}
                        </div>
                        <div>
                            <h5 className="text-sm font-bold text-gray-800">Reservations</h5>
                            <p className="text-[10px] font-black text-orange-600 uppercase">Booked Halls</p>
                        </div>
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-50">
                    <div className="bg-brand-dark p-6 rounded-[2rem] text-white">
                        <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest mb-1">Total Estimated Revenue</p>
                        <h4 className="text-2xl font-black">{formatCurrency(stats.totalRevenue)}</h4>
                    </div>
                </div>
          </div>
      </div>

      {/* Row 3: Recent Orders Table */}
      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden min-h-[400px]">
        <div className="p-8 pb-4 flex justify-between items-center">
            <h3 className="text-lg font-bold text-gray-800">Recent Orders</h3>
            <button className="text-[10px] font-black text-primary-600 uppercase hover:underline">View All</button>
        </div>
        
        {recentOrders.length > 0 ? (
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-gray-50">
                            <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-wider">customer / product</th>
                            <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-wider">order id</th>
                            <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-wider">amount</th>
                            <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-wider">date</th>
                            <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-wider">status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50/50">
                        {recentOrders.map((order, i) => (
                            <tr key={order._id || i} className="hover:bg-gray-50/30 transition-colors group">
                                <td className="px-10 py-6 flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-400">
                                        {order.customerName?.[0] || 'O'}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-700 group-hover:text-[#8B3B3B]">{order.customerName || 'Anonymous'}</p>
                                        <p className="text-[10px] text-gray-300 font-bold uppercase">{order.items?.length} items</p>
                                    </div>
                                </td>
                                <td className="px-10 py-6 text-xs text-gray-400 font-medium">#{order._id?.slice(-8)}</td>
                                <td className="px-10 py-6 text-sm font-black text-gray-800">{formatCurrency(order.totalAmount)}</td>
                                <td className="px-10 py-6 text-xs text-gray-400 font-medium">{new Date(order.createdAt).toLocaleDateString()}</td>
                                <td className="px-10 py-6">
                                    <span className={clsx(
                                        "px-4 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest",
                                        order.status === 'complete' || order.status === 'delivered' ? "bg-emerald-50 text-emerald-500" : 
                                        order.status === 'cancelled' ? "bg-rose-50 text-rose-500" : "bg-orange-50 text-orange-400"
                                    )}>
                                        {order.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        ) : (
            <div className="h-64 flex flex-col items-center justify-center text-gray-300">
                <FiBox size={48} className="mb-4 opacity-20" />
                <p className="text-sm font-black uppercase tracking-tighter">No recent orders found</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
