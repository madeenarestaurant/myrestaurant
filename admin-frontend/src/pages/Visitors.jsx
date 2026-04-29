import React, { useEffect, useState } from 'react';
import useAdminStore from '../store/useAdminStore';
import { 
  FiUser, 
  FiMapPin, 
  FiMonitor, 
  FiClock, 
  FiChevronDown, 
  FiChevronUp, 
  FiShoppingBag, 
  FiCalendar, 
  FiCheckCircle, 
  FiXCircle,
  FiActivity,
  FiGlobe
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { clsx } from 'clsx';

const Visitors = () => {
  const { visitors, fetchVisitors, stats, loading } = useAdminStore();
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    fetchVisitors();
  }, []);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (loading && visitors.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <div className="w-16 h-16 border-4 border-[#8B3B3B]/10 border-t-[#8B3B3B] rounded-full animate-spin" />
        <span className="font-black text-gray-400 uppercase tracking-widest text-[10px]">Analyzing Traffic...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-800 tracking-tight flex items-center gap-3">
            <FiUsers className="text-[#8B3B3B]" /> Visitor Insights
          </h1>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-2">
            Real-time tracking and behavior analysis
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-white px-6 py-3 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
              <FiActivity size={20} />
            </div>
            <div>
              <p className="text-xs font-black text-gray-800 leading-none">{stats.onlineVisitors || 0}</p>
              <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mt-1">Live Now</p>
            </div>
          </div>
          <div className="bg-white px-6 py-3 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#8B3B3B]/5 text-[#8B3B3B] flex items-center justify-center">
              <FiGlobe size={20} />
            </div>
            <div>
              <p className="text-xs font-black text-gray-800 leading-none">{visitors.length}</p>
              <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mt-1">Total Tracked</p>
            </div>
          </div>
        </div>
      </div>

      {/* Visitors List */}
      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-gray-50 flex items-center justify-between">
            <h3 className="text-sm font-black text-gray-800 uppercase tracking-wider">Visitor Logs</h3>
            <div className="flex gap-4">
                <span className="flex items-center gap-1.5 text-[9px] font-black uppercase text-gray-400">
                    <div className="w-2 h-2 rounded-full bg-indigo-500" /> Repeat Guest
                </span>
                <span className="flex items-center gap-1.5 text-[9px] font-black uppercase text-gray-400">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" /> Order/Resv Made
                </span>
            </div>
        </div>

        <div className="divide-y divide-gray-50">
          {visitors.map((visitor) => (
            <VisitorRow 
              key={visitor._id} 
              visitor={visitor} 
              isExpanded={expandedId === visitor._id}
              onToggle={() => toggleExpand(visitor._id)}
            />
          ))}
        </div>
        
        {visitors.length === 0 && (
          <div className="py-20 text-center">
            <FiUser size={48} className="mx-auto text-gray-200 mb-4" />
            <p className="text-gray-400 font-bold tracking-tight">No visitors found in the logs.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const VisitorRow = ({ visitor, isExpanded, onToggle }) => {
  const hasHistory = visitor.orders?.length > 0 || visitor.reservations?.length > 0;
  const isRepeat = visitor.visitCount > 1;

  return (
    <div className={clsx(
      "transition-all duration-300",
      isExpanded ? "bg-gray-50/50" : "hover:bg-gray-50/30"
    )}>
      {/* Main Row */}
      <div 
        onClick={onToggle}
        className="px-8 py-6 flex items-center justify-between cursor-pointer group"
      >
        <div className="flex items-center gap-6 flex-1 min-w-0">
          <div className={clsx(
            "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-all group-hover:scale-110 shadow-sm",
            isRepeat ? "bg-indigo-600 text-white" : "bg-gray-50 text-gray-400"
          )}>
            <FiUser size={20} />
          </div>
          
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-3">
              <p className="font-black text-gray-800 text-sm tracking-tight truncate">
                {visitor.visitorId.slice(0, 12)}...
              </p>
              {isRepeat && (
                <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-600 text-[8px] font-black uppercase tracking-widest">
                   {visitor.visitCount} Visits
                </span>
              )}
              {hasHistory && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-600 text-[8px] font-black uppercase tracking-widest">
                  Customer
                </span>
              )}
            </div>
            <div className="flex items-center gap-4 mt-1.5">
              <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1.5 uppercase tracking-wider">
                <FiMapPin size={12} className="text-[#8B3B3B]" /> {visitor.city || 'Unknown'}, {visitor.country || 'Global'}
              </span>
              <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1.5 uppercase tracking-wider">
                <FiClock size={12} /> {format(new Date(visitor.lastVisit), 'MMM dd, hh:mm a')}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-12 pr-6">
           <div className="hidden lg:flex items-center gap-8">
              <div className="text-center">
                <p className="text-[10px] font-black text-gray-800">{visitor.orders?.length || 0}</p>
                <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Orders</p>
              </div>
              <div className="text-center">
                <p className="text-[10px] font-black text-gray-800">{visitor.reservations?.length || 0}</p>
                <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Resv</p>
              </div>
              <div className="flex items-center gap-1.5">
                {visitor.emailVerified ? (
                  <FiCheckCircle className="text-emerald-500" size={14} />
                ) : (
                  <FiXCircle className="text-rose-300" size={14} />
                )}
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider">Verified</span>
              </div>
           </div>
           <div className={clsx(
             "w-8 h-8 rounded-full flex items-center justify-center transition-all",
             isExpanded ? "bg-[#8B3B3B] text-white rotate-180" : "bg-gray-100 text-gray-400 group-hover:bg-gray-200"
           )}>
             <FiChevronDown size={16} />
           </div>
        </div>
      </div>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-8 pb-8 pt-2 grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Device Info */}
              <div className="p-5 bg-white rounded-2xl border border-gray-100">
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <FiMonitor /> Technical Signature
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-gray-400 uppercase">IP Address</span>
                    <span className="text-[11px] font-black text-gray-700">{visitor.ip || 'Hidden'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Browser</span>
                    <span className="text-[11px] font-black text-gray-700">{visitor.browser || 'Unknown'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-gray-400 uppercase">OS</span>
                    <span className="text-[11px] font-black text-gray-700">{visitor.os || 'Unknown'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Device</span>
                    <span className="text-[11px] font-black text-gray-700 uppercase tracking-wider">{visitor.device || 'Desktop'}</span>
                  </div>
                </div>
              </div>

              {/* Activity Log */}
              <div className="p-5 bg-white rounded-2xl border border-gray-100 md:col-span-2">
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <FiActivity /> Recent Journey
                </h4>
                <div className="flex flex-wrap gap-2">
                  {visitor.pagesVisited?.slice(-12).reverse().map((page, i) => (
                    <div key={i} className="px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-100 flex items-center gap-2">
                      <span className="text-[10px] font-black text-[#8B3B3B]">{page.path === '/' ? 'Home' : page.path.replace('/', '').toUpperCase()}</span>
                      <span className="text-[9px] font-bold text-gray-400">{page.timeSpent > 0 ? `${page.timeSpent}s` : '•'}</span>
                    </div>
                  ))}
                  {visitor.pagesVisited?.length > 12 && <span className="text-[9px] font-bold text-gray-300 py-1.5">+{visitor.pagesVisited.length - 12} more</span>}
                </div>

                <div className="mt-6 flex items-center gap-6">
                    <div className="flex-1 p-4 bg-emerald-50/30 rounded-xl border border-emerald-100/50">
                        <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest mb-1">Conversion Status</p>
                        <div className="flex items-center gap-3">
                            <span className={clsx(
                                "flex items-center gap-1.5 text-xs font-black",
                                visitor.orders?.length > 0 ? "text-emerald-700" : "text-gray-300"
                            )}>
                                <FiShoppingBag /> {visitor.orders?.length || 0} Orders
                            </span>
                            <div className="w-px h-3 bg-emerald-200" />
                            <span className={clsx(
                                "flex items-center gap-1.5 text-xs font-black",
                                visitor.reservations?.length > 0 ? "text-emerald-700" : "text-gray-300"
                            )}>
                                <FiCalendar /> {visitor.reservations?.length || 0} Resv
                            </span>
                        </div>
                    </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FiUsers = ({ size, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
);

export default Visitors;
