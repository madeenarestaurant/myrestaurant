import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import useAdminStore from '../store/useAdminStore';

import { 
    FiChevronLeft, 
    FiBell, 
    FiUser, 
    FiPlus, 
    FiChevronDown, 
    FiChevronUp, 
    FiCheck, 
    FiX,
    FiMessageSquare,
    FiLoader,
    FiClock,
    FiCalendar
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import Toast from '../components/common/Toast';
import { clsx } from 'clsx';
import { format, isPast, parseISO } from 'date-fns'; // triggered re-scan

const Reservations = () => {
  const { reservations, fetchStats, loading, stats } = useAdminStore();
  const [filter, setFilter] = useState('Active');
  const [toast, setToast] = useState({ message: '', type: 'success' });
  const [expandedId, setExpandedId] = useState(null);
  const [modalData, setModalData] = useState(null); // { id, type }
  const [message, setMessage] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const handleStatusUpdate = async (id, status, paymentStatus) => {
    setActionLoading(true);
    const finalMessage = message.trim() || 'Your reservation status has been updated. Thank you for choosing Madeena Restaurant.';
    
    try {
      await axiosInstance.put(`/reservations/${id || modalData.id}`, { 
        status: status || (modalData.type === 'accept' ? 'Confirmed' : 'Rejected'),
        messageToUser: finalMessage,
        paymentStatus: paymentStatus
      });
      setToast({ message: `Reservation updated successfully`, type: 'success' });
      setModalData(null);
      setMessage('');
      fetchStats();

    } catch (error) {
      setToast({ message: 'Action failed', type: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  const isVenueTimeFinished = (eventDate, endTime) => {
    try {
      const date = new Date(eventDate);
      const [hours, minutes] = endTime.split(':');
      date.setHours(parseInt(hours), parseInt(minutes), 0);
      return isPast(date);
    } catch (e) {
      return isPast(new Date(eventDate));
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Confirmed': return 'bg-emerald-50 text-emerald-500 border-emerald-100';
      case 'Rejected': return 'bg-rose-50 text-rose-500 border-rose-100';
      case 'Completed': return 'bg-indigo-50 text-indigo-500 border-indigo-100';
      case 'No Occasion Found': return 'bg-gray-100 text-gray-500 border-gray-200';
      default: return 'bg-amber-50 text-amber-500 border-amber-100';
    }
  };

  const activeReservations = reservations.filter(r => 
    !isVenueTimeFinished(r.eventDate, r.endTime) && 
    (r.status === 'Pending' || r.status === 'Requested' || r.status === 'Confirmed')
  );

  const inactiveReservations = reservations.filter(r => 
    isVenueTimeFinished(r.eventDate, r.endTime) || 
    r.status === 'Rejected' || r.status === 'Completed' || r.status === 'No Occasion Found'
  );

  const currentList = filter === 'Active' ? activeReservations : inactiveReservations;

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <div className="w-16 h-16 border-4 border-[#8B3B3B]/10 border-t-[#8B3B3B] rounded-full animate-spin" />
        <span className="font-black text-gray-400 uppercase tracking-widest text-[10px]">Loading Reservations...</span>
    </div>
  );

  return (
    <div className="space-y-6 md:space-y-8 pb-10">
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />

      {/* Tabs */}
      <div className="flex gap-10 border-b border-gray-50">
          {[
              { id: 'Active', count: activeReservations.length },
              { id: 'Inactive', count: inactiveReservations.length }
          ].map(tab => (
            <button 
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={clsx(
                    "pb-4 font-bold text-sm md:text-base capitalize transition-all relative",
                    filter === tab.id ? "text-[#8B3B3B]" : "text-gray-300 hover:text-gray-500"
                )}
            >
                {tab.id} <span className="text-[10px] opacity-40">[{tab.count}]</span>
                {filter === tab.id && <motion.div layoutId="resTab" className="absolute bottom-0 left-0 right-0 h-1 bg-[#8B3B3B] rounded-full" />}
            </button>
          ))}
      </div>

      {/* Rows */}
      <div className="space-y-4">
          <AnimatePresence mode="popLayout">
              {currentList.map((res) => {
                  const finished = isVenueTimeFinished(res.eventDate, res.endTime);
                  const isProcessed = res.status === 'Completed' || res.status === 'No Occasion Found';
                  
                  return (
                      <motion.div 
                          key={res._id}
                          layout
                          className={clsx(
                              "bg-white rounded-[1.5rem] md:rounded-[2.5rem] p-6 border border-gray-100 shadow-sm transition-all duration-500",
                              (finished && !isProcessed) ? "opacity-60" : "hover:shadow-2xl hover:shadow-gray-200/40"
                          )}
                      >
                          <div className="grid grid-cols-2 md:grid-cols-4 items-center gap-6">
                              {/* Status */}
                              <div className="flex items-center gap-4">
                                  <span className={clsx(
                                      "px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm border whitespace-nowrap",
                                      getStatusStyle(res.status)
                                  )}>
                                      {res.status}
                                  </span>
                              </div>

                              {/* DateTime */}
                              <div className="text-[11px] font-bold text-gray-800 flex items-center gap-2">
                                  <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
                                      <FiCalendar size={14} />
                                  </div>
                                  <div>
                                    {format(new Date(res.eventDate), 'MMM dd, yyyy')}
                                    <div className="text-[10px] text-gray-400 font-medium">{res.startTime} - {res.endTime}</div>
                                  </div>
                              </div>

                              {/* Customer */}
                              <div className="hidden md:block">
                                  <p className="text-[11px] font-black text-gray-800 uppercase truncate">{res.fullName}</p>
                                  <p className="text-[10px] text-gray-400 font-bold">{res.phone}</p>
                              </div>

                              {/* Actions */}
                              <div className="flex items-center justify-end gap-4">
                                  {filter === 'Active' && !finished && (
                                      <div className="flex items-center gap-3">
                                          {res.status !== 'Confirmed' && (
                                              <button 
                                                  onClick={() => setModalData({ id: res._id, type: 'accept' })}
                                                  className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-all shadow-sm"
                                              >
                                                  <FiCheck size={18} />
                                              </button>
                                          )}
                                          <button 
                                              onClick={() => setModalData({ id: res._id, type: 'reject' })}
                                              className="w-10 h-10 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                                          >
                                              <FiX size={18} />
                                          </button>
                                      </div>
                                  )}

                                  {filter === 'Inactive' && finished && !isProcessed && (
                                      <div className="flex items-center gap-3">
                                          <button 
                                              onClick={() => handleStatusUpdate(res._id, 'Completed', 'Paid')}
                                              className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-500 flex items-center justify-center hover:bg-indigo-500 hover:text-white transition-all shadow-sm"
                                              title="Done (Completed & Paid)"
                                          >
                                              <FiCheck size={18} />
                                          </button>
                                          <button 
                                              onClick={() => handleStatusUpdate(res._id, 'No Occasion Found')}
                                              className="w-10 h-10 rounded-xl bg-gray-50 text-gray-500 flex items-center justify-center hover:bg-gray-500 hover:text-white transition-all shadow-sm"
                                              title="Not Done (No Occasion Found)"
                                          >
                                              <FiX size={18} />
                                          </button>
                                      </div>
                                  )}

                                  <button 
                                      onClick={() => setExpandedId(expandedId === res._id ? null : res._id)}
                                      className="text-[10px] font-black text-gray-300 uppercase hover:text-gray-800 transition-colors"
                                  >
                                      {expandedId === res._id ? 'Close' : 'Details'}
                                  </button>
                              </div>
                          </div>

                          {/* Expandable Content */}
                          <AnimatePresence>
                              {expandedId === res._id && (
                                  <motion.div 
                                      initial={{ height: 0, opacity: 0 }}
                                      animate={{ height: 'auto', opacity: 1 }}
                                      exit={{ height: 0, opacity: 0 }}
                                      className="overflow-hidden"
                                  >
                                      <div className="mt-8 pt-8 border-t border-gray-50 grid grid-cols-1 md:grid-cols-3 gap-8">
                                          <div className="space-y-3">
                                              <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Customer Info</p>
                                              <p className="text-xs font-bold text-gray-700">{res.fullName}</p>
                                              <p className="text-[11px] text-gray-400 font-medium">{res.phone}</p>
                                              <p className="text-[11px] text-gray-400 font-medium">{res.email}</p>
                                          </div>
                                          
                                          <div className="space-y-3">
                                              <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Booking Context</p>
                                              <p className="text-xs font-bold text-gray-700">Type: <span className="font-medium">{res.reservationType}</span></p>
                                              <p className="text-xs font-bold text-gray-700">Guests: <span className="font-medium">{res.guests}</span></p>
                                              <p className="text-xs font-bold text-gray-700">Venue: <span className="font-medium text-[#8B3B3B]">{res.venueDetails || 'Hall'}</span></p>
                                          </div>

                                          <div className="space-y-3">
                                              <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Requirements</p>
                                              <p className="text-xs text-gray-500 font-medium leading-relaxed italic">
                                                "{res.specialRequirements || 'No special requirements'}"
                                              </p>
                                              {res.messageToUser && (
                                                <div className="mt-4 p-3 bg-gray-50 rounded-xl border border-gray-100">
                                                    <p className="text-[9px] font-black text-gray-400 uppercase mb-1">Message Sent</p>
                                                    <p className="text-[10px] text-gray-600 font-medium italic">{res.messageToUser}</p>
                                                </div>
                                              )}
                                          </div>
                                      </div>
                                  </motion.div>
                              )}
                          </AnimatePresence>
                      </motion.div>
                  );
              })}
          </AnimatePresence>
      </div>

      {/* Message Modal */}
      <AnimatePresence>
          {modalData && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                  <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setModalData(null)}
                      className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" 
                  />
                  <motion.div 
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.9, opacity: 0 }}
                      className="bg-white rounded-[3rem] w-full max-w-md p-10 relative z-10 shadow-2xl"
                  >
                      <h3 className="text-2xl font-black text-gray-800 tracking-tighter mb-2 capitalize">
                          {modalData.type} Reservation
                      </h3>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-8">Send a message to the customer</p>
                      
                      <div className="relative">
                          <FiMessageSquare className="absolute left-6 top-6 text-gray-300" />
                          <textarea 
                              placeholder="Write your message here or leave blank for default..."
                              value={message}
                              onChange={(e) => setMessage(e.target.value)}
                              className="w-full bg-gray-50 border border-gray-100 rounded-[2rem] p-6 pl-14 h-40 text-sm font-medium outline-none focus:ring-2 focus:ring-[#8B3B3B]/10 transition-all resize-none"
                          />
                      </div>

                      <div className="grid grid-cols-2 gap-4 mt-8">
                          <button 
                              onClick={() => setModalData(null)}
                              className="py-4 rounded-2xl bg-gray-100 text-gray-500 font-black text-[10px] uppercase tracking-widest hover:bg-gray-200 transition-all"
                          >
                              Cancel
                          </button>
                          <button 
                              onClick={() => handleStatusUpdate()}
                              disabled={actionLoading}
                              className={clsx(
                                  "py-4 rounded-2xl text-white font-black text-[10px] uppercase tracking-widest shadow-xl transition-all flex items-center justify-center gap-2",
                                  modalData.type === 'accept' ? 'bg-emerald-500 shadow-emerald-500/20' : 'bg-rose-500 shadow-rose-500/20'
                              )}
                          >
                              {actionLoading ? <FiLoader className="animate-spin" /> : (modalData.type === 'accept' ? 'Accept' : 'Reject')}
                          </button>
                      </div>
                  </motion.div>
              </div>
          )}
      </AnimatePresence>

      {currentList.length === 0 && (
          <div className="py-20 text-center">
              <p className="text-gray-400 font-black uppercase tracking-widest text-sm">No reservations found</p>
          </div>
      )}
    </div>
  );
};

export default Reservations;

