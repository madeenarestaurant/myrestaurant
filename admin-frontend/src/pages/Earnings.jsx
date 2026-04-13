import React from 'react';
import { LuDollarSign, LuTrendingUp, LuArrowUp, LuArrowDown, LuCalendar, LuCreditCard } from 'react-icons/lu';
import { motion } from 'framer-motion';

const Earnings = () => {
  const earningsData = [
    { period: 'Today', amount: 1250.00, trend: 15, positive: true },
    { period: 'This Week', amount: 8400.50, trend: 8, positive: true },
    { period: 'This Month', amount: 32500.00, trend: 12, positive: true },
    { period: 'This Year', amount: 245000.00, trend: 5, positive: false },
  ];

  const transactions = [
    { id: 'TXN-9021', type: 'Order Payment', amount: 124.50, method: 'Visa • 4242', status: 'Success', date: '2 min ago' },
    { id: 'TXN-9022', type: 'Order Payment', amount: 65.00, method: 'MasterCard • 8812', status: 'Success', date: '15 min ago' },
    { id: 'TXN-9023', type: 'Refund', amount: -45.00, method: 'PayPal', status: 'Pending', date: '1 hour ago' },
  ];

  return (
    <div className="space-y-8">
      {/* Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {earningsData.map((item, idx) => (
          <div key={idx} className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{item.period}</p>
              <h3 className="text-2xl font-black text-gray-800 dark:text-white">${item.amount.toLocaleString()}</h3>
              <div className={`flex items-center gap-1 mt-4 text-xs font-bold ${item.positive ? 'text-emerald-500' : 'text-red-500'}`}>
                {item.positive ? <LuArrowUp size={12} /> : <LuArrowDown size={12} />}
                <span>{item.trend}% compared to last period</span>
              </div>
            </div>
            <div className="absolute -right-4 -bottom-4 text-primary-500/5 rotate-12">
              <LuTrendingUp size={120} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Earnings Chart Placeholder */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 p-8">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h3 className="text-xl font-bold dark:text-white">Revenue Analytics</h3>
              <p className="text-sm text-gray-500">Visual breakdown of your earnings</p>
            </div>
            <div className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
              {['W', 'M', 'Y'].map(t => (
                <button key={t} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${t === 'M' ? 'bg-white dark:bg-gray-700 shadow-sm text-primary-600' : 'text-gray-400'}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          
          <div className="h-64 flex items-end gap-3 px-2">
            {[45, 60, 40, 75, 50, 85, 90, 65, 55, 70, 45, 80].map((h, i) => (
              <motion.div 
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${h}%` }}
                className="flex-1 bg-primary-100 dark:bg-primary-900/20 rounded-t-lg relative group transition-all duration-300"
              >
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  ${(h * 100).toLocaleString()}
                </div>
                <div className={`absolute bottom-0 left-0 right-0 rounded-t-lg bg-primary-600 transition-all duration-300 ${i === 6 ? 'h-full opacity-100' : 'h-0 group-hover:h-full opacity-0 group-hover:opacity-40'}`} />
              </motion.div>
            ))}
          </div>
          <div className="flex justify-between mt-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">
            <span>Jan</span>
            <span>Jun</span>
            <span>Dec</span>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 p-8">
          <h3 className="text-xl font-bold dark:text-white mb-6">Recent Activity</h3>
          <div className="space-y-6">
            {transactions.map((txn, i) => (
              <div key={i} className="flex items-center justify-between group cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-2xl ${txn.amount > 0 ? 'bg-emerald-50 dark:bg-emerald-900/10 text-emerald-600' : 'bg-red-50 dark:bg-red-900/10 text-red-600'}`}>
                    {txn.amount > 0 ? <LuCreditCard size={18} /> : <LuArrowDown size={18} />}
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-gray-800 dark:text-white group-hover:text-primary-600 transition-colors">{txn.type}</h5>
                    <p className="text-[10px] font-bold text-gray-400 uppercase">{txn.date} • {txn.method}</p>
                  </div>
                </div>
                <p className={`text-sm font-black ${txn.amount > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                  {txn.amount > 0 ? '+' : ''}{txn.amount.toFixed(2)}
                </p>
              </div>
            ))}
          </div>
          <button className="w-full mt-8 py-3 rounded-2xl border border-gray-100 dark:border-gray-800 text-sm font-bold text-gray-400 hover:text-primary-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">
            Download Statement
          </button>
        </div>
      </div>
    </div>
  );
};

export default Earnings;
