import React, { useEffect } from 'react';
import StatsCard from '../components/dashboard/StatsCard';
import AnalyticsChart from '../components/dashboard/AnalyticsChart';
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
  const { stats, recentOrders, reservations, visitors, fetchStats, fetchVisitors, loading, setActiveTab } = useAdminStore();

  useEffect(() => {
    fetchStats();
    fetchVisitors();
  }, []);

  const formatCurrency = (val) => `₹${val?.toLocaleString()}`;

  // Calculate today's orders and reservations
  const today = new Date().toDateString();
  const todayOrders = (recentOrders || []).filter(o => new Date(o.createdAt).toDateString() === today);
  const todayReservations = (reservations || []).filter(r => new Date(r.createdAt).toDateString() === today);
  
  const combinedActivity = [
    ...todayOrders.map(o => ({ ...o, activityType: 'order' })),
    ...todayReservations.map(r => ({ ...r, activityType: 'reservation' }))
  ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

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
      <AnalyticsChart orders={recentOrders} reservations={reservations} visitors={visitors} />

      {/* Grid Layout for Detailed Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          
          {/* Today's Orders */}
          <section className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-8 flex flex-col h-[500px]">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h4 className="text-base font-black text-gray-800 uppercase tracking-tight">Today's Activity</h4>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                            {todayOrders.length} orders & {todayReservations.length} reservations today
                        </p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-300">
                        <FiActivity size={18} />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-2">
                    {combinedActivity.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                            <FiActivity size={48} className="mb-4" />
                            <p className="text-xs font-black uppercase tracking-widest">No activity yet today</p>
                        </div>
                    ) : (
                        combinedActivity.map((item) => (
                            <div 
                                key={item._id} 
                                onClick={() => setActiveTab(item.activityType === 'reservation' ? 'reservations' : 'orders')}
                                className={clsx(
                                    "flex items-center justify-between p-4 rounded-[1.5rem] transition-all group cursor-pointer",
                                    item.activityType === 'reservation' ? "bg-indigo-50/50 hover:bg-indigo-50" : "bg-gray-50/50 hover:bg-gray-50"
                                )}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={clsx(
                                        "w-12 h-12 rounded-2xl shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform",
                                        item.activityType === 'order' ? "bg-white text-[#8B3B3B]" : "bg-indigo-600 text-white"
                                    )}>
                                        {item.activityType === 'order' ? <FiShoppingCart size={20} /> : <FiCalendar size={20} />}
                                    </div>
                                    <div>
                                        <p className="font-black text-sm text-gray-800 truncate max-w-[150px]">
                                            {item.customerName || item.fullName || 'Walk-in'}
                                        </p>
                                        <p className="text-[10px] font-bold text-gray-400 mt-0.5 uppercase tracking-wider">
                                            {format(new Date(item.createdAt), 'hh:mm a')} • <span className={item.activityType === 'reservation' ? "text-indigo-500" : ""}>{item.activityType}</span>
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-black text-sm text-gray-800">
                                        {item.activityType === 'order' ? formatCurrency(item.totalAmount) : `${item.guests} Pax`}
                                    </p>
                                    <span className={clsx(
                                        "text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded",
                                        item.status === 'requested' || item.status === 'Requested' ? "text-amber-500" : "text-emerald-500"
                                    )}>{item.status}</span>
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

