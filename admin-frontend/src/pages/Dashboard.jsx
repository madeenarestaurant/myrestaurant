import React, { useEffect } from 'react';
import StatsCard from '../components/dashboard/StatsCard';
import { 
  FiShoppingCart, 
  FiActivity, 
  FiClock, 
  FiMoreVertical,
  FiCalendar,
  FiUser,
  FiShoppingBag,
  FiTrendingUp,
  FiUsers
} from 'react-icons/fi';
import useAdminStore from '../store/useAdminStore';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { format } from 'date-fns'; // re-scan

const Dashboard = () => {
  const { stats, recentOrders, reservations, fetchStats, loading } = useAdminStore();

  useEffect(() => {
    fetchStats();
  }, []);

  const formatCurrency = (val) => `₹${val?.toLocaleString()}`;

  // Calculate today's orders
  const today = new Date().toDateString();
  const todayOrders = (recentOrders || []).filter(o => new Date(o.createdAt).toDateString() === today);

  return (
    <div className="space-y-6 md:space-y-8 pb-10">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatsCard 
          title="Total Revenue" 
          value={formatCurrency(stats.totalRevenue)} 
          icon={FiTrendingUp} 
          trend={12.4}
          positive={true}
        />
        <StatsCard 
          title="Total Orders" 
          value={stats.totalOrders} 
          icon={FiShoppingBag} 
          trend={8.2}
          positive={true}
        />
        <StatsCard 
          title="Total Visitors" 
          value={stats.totalVisitors} 
          icon={FiUsers} 
          trend={24.1}
          positive={true}
        />
        <StatsCard 
          title="Live Visitors" 
          value={stats.onlineVisitors} 
          icon={FiActivity} 
          trend={0}
          positive={true}
        />
      </div>

      {/* Analytics Chart Section */}
      <div className="bg-white rounded-[2.5rem] p-6 md:p-10 border border-gray-100 shadow-sm relative overflow-hidden group">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 relative z-10">
                <div>
                    <h3 className="text-xl font-black text-gray-800 tracking-tight">Order Analytics</h3>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Monthly performance review</p>
                </div>
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/20" />
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Revenue</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-lg shadow-rose-500/20" />
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Expenses</span>
                    </div>
                </div>
            </div>

            <div className="h-[250px] md:h-[320px] relative">
                <svg className="w-full h-full" viewBox="0 0 1000 300" preserveAspectRatio="none">
                    {[0, 1, 2, 3, 4, 5].map(v => (
                        <line key={v} x1="0" y1={v * 60} x2="1000" y2={v * 60} stroke="#f8f8f8" strokeWidth="1" />
                    ))}
                    <motion.path 
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 2, ease: "easeInOut" }}
                        d="M0,220 C150,150 250,250 400,200 C550,150 750,50 1000,180" 
                        fill="none" 
                        stroke="#10B981" 
                        strokeWidth="5" 
                        strokeLinecap="round" 
                    />
                    <motion.path 
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 2, ease: "easeInOut", delay: 0.5 }}
                        d="M0,150 C200,160 300,280 500,180 C700,80 850,220 1000,200" 
                        fill="none" 
                        stroke="#EF4444" 
                        strokeWidth="5" 
                        strokeLinecap="round" 
                    />
                </svg>
                <div className="flex justify-between mt-8 px-2 text-[9px] font-black text-gray-300 uppercase tracking-[0.2em]">
                    {['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'].map(m => <span key={m}>{m}</span>)}
                </div>
            </div>
      </div>

      {/* Grid Layout for Detailed Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          
          {/* Today's Orders */}
          <section className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-8 flex flex-col h-[500px]">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h4 className="text-base font-black text-gray-800 uppercase tracking-tight">Today's Activity</h4>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">{todayOrders.length} orders received today</p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-300">
                        <FiShoppingBag size={18} />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-2">
                    {todayOrders.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                            <FiShoppingBag size={48} className="mb-4" />
                            <p className="text-xs font-black uppercase tracking-widest">No orders yet today</p>
                        </div>
                    ) : (
                        todayOrders.map((order) => (
                            <div key={order._id} className="flex items-center justify-between p-4 bg-gray-50/50 hover:bg-gray-50 rounded-[1.5rem] transition-all group">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-[#8B3B3B] group-hover:scale-110 transition-transform">
                                        <FiShoppingCart size={20} />
                                    </div>
                                    <div>
                                        <p className="font-black text-sm text-gray-800 truncate max-w-[150px]">{order.customerName || 'Walk-in'}</p>
                                        <p className="text-[10px] font-bold text-gray-400 mt-0.5 uppercase tracking-wider">{format(new Date(order.createdAt), 'hh:mm a')}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-black text-sm text-gray-800">{formatCurrency(order.totalAmount)}</p>
                                    <span className={clsx(
                                        "text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded",
                                        order.status === 'requested' ? "text-amber-500" : "text-emerald-500"
                                    )}>{order.status}</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
          </section>

          {/* Recent Reservations */}
          <section className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-8 flex flex-col h-[500px]">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h4 className="text-base font-black text-gray-800 uppercase tracking-tight">Recent Reservations</h4>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Latest booking requests</p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-300">
                        <FiCalendar size={18} />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
                    <table className="w-full text-[11px]">
                        <thead className="sticky top-0 bg-white z-10">
                            <tr className="text-gray-400 border-b border-gray-50">
                                <th className="text-left pb-4 font-black uppercase tracking-widest">Customer</th>
                                <th className="text-left pb-4 font-black uppercase tracking-widest">Date</th>
                                <th className="text-left pb-4 font-black uppercase tracking-widest">Party</th>
                                <th className="text-right pb-4 font-black uppercase tracking-widest">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50/50">
                            {reservations.slice(0, 8).map((resv) => (
                                <tr key={resv._id} className="group hover:bg-gray-50/50 transition-colors">
                                    <td className="py-4">
                                        <p className="font-black text-gray-800">{resv.fullName}</p>
                                        <p className="text-[9px] text-gray-400 font-bold">{resv.phone}</p>
                                    </td>
                                    <td className="py-4 text-gray-500 font-bold">{format(new Date(resv.eventDate), 'MMM dd')}</td>
                                    <td className="py-4 text-gray-500 font-bold">{resv.guests} Pax</td>
                                    <td className="py-4 text-right">
                                        <span className={clsx(
                                            "px-2.5 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest",
                                            resv.status === 'Confirmed' ? "bg-emerald-50 text-emerald-500" : "bg-amber-50 text-amber-500"
                                        )}>
                                            {resv.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
          </section>

          {/* Full Order List (Summary) */}
          <section className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-8 flex flex-col h-[500px] lg:col-span-2">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h4 className="text-base font-black text-gray-800 uppercase tracking-tight">System Transaction Log</h4>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Live feed of all orders</p>
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
                    <table className="w-full text-[11px]">
                        <thead className="sticky top-0 bg-white z-10">
                            <tr className="text-gray-400 border-b border-gray-50">
                                <th className="text-left pb-4 font-black uppercase tracking-widest">Order ID</th>
                                <th className="text-left pb-4 font-black uppercase tracking-widest">Customer</th>
                                <th className="text-left pb-4 font-black uppercase tracking-widest">Items</th>
                                <th className="text-left pb-4 font-black uppercase tracking-widest">Amount</th>
                                <th className="text-left pb-4 font-black uppercase tracking-widest">Time</th>
                                <th className="text-right pb-4 font-black uppercase tracking-widest">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50/50">
                            {recentOrders.slice(0, 15).map((order) => (
                                <tr key={order._id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="py-4 text-gray-400 font-bold">#{order._id?.slice(-8)}</td>
                                    <td className="py-4 text-gray-800 font-black">{order.customerName || 'Walk-in'}</td>
                                    <td className="py-4 text-gray-500 font-bold">{order.items?.length || 0} items</td>
                                    <td className="py-4 text-gray-800 font-black">{formatCurrency(order.totalAmount)}</td>
                                    <td className="py-4 text-gray-400 font-bold">{format(new Date(order.createdAt), 'MMM dd, hh:mm a')}</td>
                                    <td className="py-4 text-right">
                                        <span className={clsx(
                                            "px-2.5 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest",
                                            order.status === 'completed' ? "bg-emerald-50 text-emerald-500" : 
                                            order.status === 'requested' ? "bg-amber-50 text-amber-500" : "bg-rose-50 text-rose-500"
                                        )}>
                                            {order.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
          </section>
      </div>
    </div>
  );
};

export default Dashboard;

