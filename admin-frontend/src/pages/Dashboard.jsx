import React, { useEffect } from 'react';
import StatsCard from '../components/dashboard/StatsCard';
import { 
  FiBox, 
  FiShoppingCart, 
  FiAlertCircle, 
  FiClock, 
  FiActivity, 
  FiSearch, 
  FiMic, 
  FiMoreVertical,
  FiCheckCircle,
  FiCalendar,
  FiUser
} from 'react-icons/fi';
import useAdminStore from '../store/useAdminStore';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

const Dashboard = () => {
  const { stats, recentOrders, reservations, fetchStats, loading } = useAdminStore();

  useEffect(() => {
    fetchStats();
  }, []);

  const formatCurrency = (val) => `₹${val?.toLocaleString()}`;

  return (
    <div className="space-y-6 md:space-y-8 pb-10">
      {/* Stats Cards - Responsive 2x2 on mobile */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatsCard 
          title="Total revenue" 
          value={formatCurrency(stats.totalRevenue)} 
          icon={FiActivity} 
          trend={14.5}
          positive={true}
        />
        <StatsCard 
          title="Total order" 
          value={stats.totalOrders} 
          icon={FiShoppingCart} 
          trend={14.5}
          positive={true}
        />
        <StatsCard 
          title="Total visitors" 
          value={stats.totalVisitors} 
          icon={FiUser} 
          trend={14.5}
          positive={true}
        />
        <StatsCard 
          title="Online Visitors" 
          value={stats.onlineVisitors} 
          icon={FiActivity} 
          trend={0}
          positive={true}
        />

      </div>

      {/* Analytics Chart - Kept as requested previously */}
      <div className="bg-white rounded-[2rem] p-6 md:p-8 border border-gray-100 shadow-sm relative overflow-hidden">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 md:mb-10 relative z-10">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    Order Analytics
                </h3>
                <div className="flex items-center gap-4 md:gap-6 w-full md:w-auto overflow-x-auto no-scrollbar pb-2 md:pb-0">
                    <div className="flex items-center gap-2 whitespace-nowrap">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                        <span className="text-[10px] font-black text-gray-400 uppercase">online</span>
                    </div>
                    <div className="flex items-center gap-2 whitespace-nowrap">
                        <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                        <span className="text-[10px] font-black text-gray-400 uppercase">offline</span>
                    </div>
                    <div className="px-4 py-1.5 bg-gray-50 rounded-xl text-[10px] font-black uppercase text-gray-400 border border-gray-100 flex items-center gap-2 cursor-pointer whitespace-nowrap">
                        years <FiClock />
                    </div>
                </div>
            </div>

            <div className="h-[250px] md:h-[300px] relative">
                <svg className="w-full h-full" viewBox="0 0 1000 300" preserveAspectRatio="none">
                    {[0, 1, 2, 3, 4, 5].map(v => (
                        <line key={v} x1="0" y1={v * 60} x2="1000" y2={v * 60} stroke="#f8f8f8" strokeWidth="1.5" />
                    ))}
                    <path d="M0,220 C150,150 250,250 400,200 C550,150 750,50 1000,180" fill="none" stroke="#10B981" strokeWidth="4" strokeLinecap="round" className="drop-shadow-lg" />
                    <path d="M0,150 C200,160 300,280 500,180 C700,80 850,220 1000,200" fill="none" stroke="#EF4444" strokeWidth="4" strokeLinecap="round" className="drop-shadow-lg" />
                </svg>
                <div className="flex justify-between mt-6 px-1 text-[9px] md:text-[10px] font-black text-gray-300 uppercase tracking-widest">
                    {['jan','feb','mar','apr','may','jun','jul','aud','sep','oct','nov','dec'].map(m => <span key={m}>{m}</span>)}
                </div>
            </div>
      </div>

      {/* New Four-Section Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {/* Today Order */}
          <section className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-6 overflow-hidden">
                <div className="flex justify-between items-center mb-6">
                    <h4 className="text-base font-bold text-gray-800">Today Order</h4>
                </div>
                <div className="space-y-4">
                    {[
                      { name: 'veg salad', time: '9:00 am', price: 250, img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=100' },
                      { name: 'chicken pizza', time: '10:00 am', price: 300, img: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=100' },
                      { name: 'chicken biriyani', time: '11:00 am', price: 160, img: 'https://images.unsplash.com/photo-1563379091339-03b21bc4a4f8?w=100' }
                    ].map((order, i) => (
                      <div key={i} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-2xl transition-all border border-transparent hover:border-gray-100/50">
                          <div className="flex items-center gap-4">
                              <img src={order.img} alt={order.name} className="w-14 h-12 md:w-16 md:h-14 object-cover rounded-xl" />
                              <div>
                                  <p className="font-bold text-sm text-gray-800">{order.name}</p>
                                  <p className="text-[10px] font-medium text-gray-400 mt-0.5">{order.time}</p>
                              </div>
                          </div>
                          <span className="font-bold text-sm text-gray-800">₹{order.price}</span>
                      </div>
                    ))}
                </div>
          </section>

          {/* Reservation */}
          <section className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-6 overflow-hidden">
                <div className="flex justify-between items-center mb-6">
                    <h4 className="text-base font-bold text-gray-800">Reservation</h4>
                    <FiMoreVertical className="text-gray-300" />
                </div>
                <div className="overflow-x-auto -mx-6 px-6">
                    <table className="w-full text-[11px] font-medium">
                        <thead>
                            <tr className="text-gray-400 border-b border-gray-50">
                                <th className="text-left pb-3 font-medium">Name</th>
                                <th className="text-left pb-3 font-medium">contact</th>
                                <th className="text-left pb-3 font-medium">table</th>
                                <th className="text-left pb-3 font-medium">Date</th>
                                <th className="text-left pb-3 font-medium">person</th>
                                <th className="text-right pb-3 font-medium">request</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50/50">
                            {(reservations?.length > 0 ? reservations.slice(0, 4) : [{name:'stephy',phone:'12345678',table:'01',date:'12-4-2026',persons:'04',status:'Accept'}]).map((resv, i) => (
                                <tr key={i}>
                                    <td className="py-4 text-gray-700">{resv.name || resv.customerName}</td>
                                    <td className="py-4 text-gray-400">{resv.phone || resv.customerPhone || '12345678'}</td>
                                    <td className="py-4 text-gray-400">{resv.tableNo || '01'}</td>
                                    <td className="py-4 text-gray-400">{resv.date || '12-4-2026'}</td>
                                    <td className="py-4 text-gray-400">{resv.persons || '02'}</td>
                                    <td className="py-4 text-right">
                                        <span className={clsx(
                                            "px-2 py-0.5 rounded text-[9px] font-bold transition-colors",
                                            i % 3 === 1 ? "bg-orange-50 text-orange-400" : "bg-emerald-50 text-emerald-500"
                                        )}>
                                            {i % 3 === 1 ? 'Pending' : 'Accept'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
          </section>

          {/* Order List */}
          <section className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-6 overflow-hidden">
                <div className="flex justify-between items-center mb-6">
                    <h4 className="text-base font-bold text-gray-800">Order List</h4>
                    <FiMoreVertical className="text-gray-300" />
                </div>
                <div className="overflow-x-auto -mx-6 px-6">
                    <table className="w-full text-[11px] font-medium">
                        <thead>
                            <tr className="text-gray-400 border-b border-gray-50">
                                <th className="text-left pb-3 font-medium">product name</th>
                                <th className="text-left pb-3 font-medium">product id</th>
                                <th className="text-left pb-3 font-medium">price</th>
                                <th className="text-left pb-3 font-medium">date</th>
                                <th className="text-left pb-3 font-medium">status</th>
                                <th className="text-right pb-3 font-medium">quantity</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50/50">
                            {(recentOrders?.length > 0 ? recentOrders.slice(0, 4) : [{name:'chicken biriyani',id:'378736728',price:587,date:'11-4-2026',status:'complete',qty:10}]).map((order, i) => (
                                <tr key={i}>
                                    <td className="py-4 text-gray-700">{order.items?.[0]?.name || order.name || 'Chicken Biriyani'}</td>
                                    <td className="py-4 text-gray-400">{order._id?.slice(-8) || order.id || '378736728'}</td>
                                    <td className="py-4 text-gray-700">₹{order.totalAmount || order.price || 587}</td>
                                    <td className="py-4 text-gray-400">{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : (order.date || '11-4-2026')}</td>
                                    <td className="py-4">
                                        <span className={clsx(
                                            "px-2 py-0.5 rounded text-[9px] font-bold",
                                            i % 3 === 2 ? "bg-orange-50 text-orange-400" : "bg-emerald-50 text-emerald-500"
                                        )}>
                                            {i % 3 === 2 ? 'pending' : 'complete'}
                                        </span>
                                    </td>
                                    <td className="py-4 text-right text-gray-700">{order.items?.reduce((a, b) => a + b.quantity, 0) || order.qty || 10}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
          </section>

          {/* Employees Activity */}
          <section className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-6 overflow-hidden flex flex-col">
                <div className="flex justify-between items-center mb-10">
                    <h4 className="text-base font-bold text-gray-800">Employees Activity</h4>
                </div>
                
                <div className="flex-1 flex flex-col items-center justify-center py-6">
                    <div className="relative w-48 h-48 md:w-56 md:h-56">
                        {/* CSS-only Donut Chart */}
                        <svg className="w-full h-full transform -rotate-90">
                            <circle cx="50%" cy="50%" r="40%" stroke="#e2e8f0" strokeWidth="25" fill="none" />
                            <circle cx="50%" cy="50%" r="40%" stroke="#8B5CF6" strokeWidth="28" fill="none" strokeDasharray="251 251" strokeDashoffset="50" strokeLinecap="round" className="drop-shadow-sm" />
                            <circle cx="50%" cy="50%" r="40%" stroke="#F97316" strokeWidth="28" fill="none" strokeDasharray="251 251" strokeDashoffset="180" strokeLinecap="round" />
                            <circle cx="50%" cy="50%" r="40%" stroke="#22C55E" strokeWidth="28" fill="none" strokeDasharray="251 251" strokeDashoffset="210" strokeLinecap="round" />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-3xl md:text-4xl font-bold text-indigo-400">80%</span>
                        </div>
                    </div>

                    <div className="mt-10 flex items-center justify-center gap-6">
                        <div className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                            <span className="text-[10px] font-bold text-gray-500">Active</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                            <span className="text-[10px] font-bold text-gray-500">Inactive</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                            <span className="text-[10px] font-bold text-gray-500">New sign</span>
                        </div>
                    </div>
                </div>
          </section>
      </div>
    </div>
  );
};

export default Dashboard;
