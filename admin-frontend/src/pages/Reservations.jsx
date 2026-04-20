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
    FiLoader
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import Toast from '../components/common/Toast';
import { clsx } from 'clsx';

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


  const handleStatusUpdate = async () => {
    if (!modalData) return;
    setActionLoading(true);
    const finalMessage = message.trim() || 'Your reservation has been processed. Thank you for choosing Madeena Restaurant.';
    
    try {
      await axiosInstance.put(`/reservations/${modalData.id}`, { 
        status: modalData.type === 'accept' ? 'Confirmed' : 'Rejected',
        adminMessage: finalMessage
      });
      setToast({ message: `Reservation ${modalData.type === 'accept' ? 'accepted' : 'rejected'} successfully`, type: 'success' });
      setModalData(null);
      setMessage('');
      fetchStats();

    } catch (error) {
      setToast({ message: 'Action failed', type: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  const toggleRow = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const isPastDate = (dateStr) => {
    const resDate = new Date(dateStr);
    const now = new Date();
    return resDate < now;
  };

  const getStatus = (res) => {
    if (res.status === 'Rejected') return 'rejected';
    if (res.status === 'Confirmed') return 'accepted';
    if (isPastDate(res.date || res.eventDate)) return 'completed';
    return 'requested';
  };

  const activeReservations = reservations.filter(r => r.status !== 'Rejected' && !isPastDate(r.date || r.eventDate));
  const inactiveReservations = reservations.filter(r => r.status === 'Rejected' || isPastDate(r.date || r.eventDate));

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
          <button 
              onClick={() => setFilter('Active')}
              className={clsx(
                  "pb-4 font-bold text-sm md:text-base capitalize transition-all relative",
                  filter === 'Active' ? "text-[#8B3B3B]" : "text-gray-300 hover:text-gray-500"
              )}
          >
              Active [{activeReservations.length}]
              {filter === 'Active' && <motion.div layoutId="resTab" className="absolute bottom-0 left-0 right-0 h-1 bg-[#8B3B3B] rounded-full" />}
          </button>
          <button 
              onClick={() => setFilter('Inactive')}
              className={clsx(
                  "pb-4 font-bold text-sm md:text-base capitalize transition-all relative",
                  filter === 'Inactive' ? "text-[#8B3B3B]" : "text-gray-300 hover:text-gray-500"
              )}
          >
              Inactive [{inactiveReservations.length}]
              {filter === 'Inactive' && <motion.div layoutId="resTab" className="absolute bottom-0 left-0 right-0 h-1 bg-[#8B3B3B] rounded-full" />}
          </button>
      </div>

      {/* List Header - Desktop Only */}
      <div className="hidden md:grid grid-cols-4 bg-white/50 rounded-2xl p-6 text-[11px] font-black text-gray-400 uppercase tracking-widest">
          <span>Status</span>
          <span>Date and Time</span>
          <span>End Date and Time</span>
          <span className="text-right pr-10">Action</span>
      </div>

      {/* Rows */}
      <div className="space-y-4">
          <AnimatePresence mode="popLayout">
              {currentList
                .sort((a, b) => {
                    const statusOrder = { 'accepted': 0, 'requested': 1, 'rejected': 2, 'completed': 3 };
                    const statusA = getStatus(a);
                    const statusB = getStatus(b);
                    return (statusOrder[statusA] ?? 10) - (statusOrder[statusB] ?? 10);
                })
                .map((res) => {
                  const status = getStatus(res);
                  const isInactive = status === 'completed' || status === 'rejected';
                  
                  return (
                      <motion.div 
                          key={res._id}
                          layout
                          className={clsx(
                              "bg-white rounded-[1.5rem] md:rounded-[2.5rem] p-6 border border-gray-100 shadow-sm transition-all duration-500",
                              isInactive ? "opacity-60 grayscale-[0.2]" : "hover:shadow-2xl hover:shadow-gray-200/40 hover:-translate-y-1"
                          )}
                      >
                          <div className="grid grid-cols-2 md:grid-cols-4 items-center gap-6">
                              {/* Status */}
                              <div className="flex items-center gap-4">
                                  <span className={clsx(
                                      "px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm border",
                                      status === 'accepted' ? "bg-emerald-50 text-emerald-500 border-emerald-100" :
                                      status === 'requested' ? "bg-white text-gray-400 border-gray-100" :
                                      status === 'completed' ? "bg-gray-50 text-gray-400 border-gray-100" :
                                      "bg-rose-50 text-rose-500 border-rose-100"
                                  )}>
                                      {status}
                                  </span>
                              </div>

                              {/* Start DateTime */}
                              <div className="text-[11px] font-bold text-gray-800">
                                  {new Date(res.date || res.eventDate).toLocaleDateString()}
                                  <br />
                                  <span className="text-gray-400">{res.startTime || '11:00'}</span>
                              </div>

                              {/* End DateTime */}
                              <div className="hidden md:block text-[11px] font-bold text-gray-800">
                                  {new Date(res.date || res.eventDate).toLocaleDateString()}
                                  <br />
                                  <span className="text-gray-400">{res.endTime || '14:00'}</span>
                              </div>

                              {/* Actions */}
                              <div className="flex items-center justify-end gap-2 md:gap-6 md:pr-4">
                                  {status === 'requested' && (
                                      <div className="flex items-center gap-3">
                                          <button 
                                              onClick={() => setModalData({ id: res._id, type: 'accept' })}
                                              className="text-[10px] font-black uppercase tracking-widest text-emerald-500 hover:text-emerald-600 transition-colors"
                                          >
                                              Approve
                                          </button>
                                          <button 
                                              onClick={() => setModalData({ id: res._id, type: 'reject' })}
                                              className="text-[10px] font-black uppercase tracking-widest text-rose-500 hover:text-rose-600 transition-colors"
                                          >
                                              Reject
                                          </button>
                                      </div>
                                  )}
                                  <div 
                                      onClick={() => toggleRow(res._id)}
                                      className="flex items-center gap-2 text-[10px] font-black text-gray-300 uppercase cursor-pointer hover:text-gray-800 transition-colors shrink-0"
                                  >
                                      More {expandedId === res._id ? <FiChevronUp /> : <FiChevronDown />}
                                  </div>
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
                                              <p className="text-xs font-bold text-gray-700">{res.fullName || res.customerName || 'Anonymous'}</p>
                                              <p className="text-[11px] text-gray-400 font-medium">{res.phone || res.customerPhone || 'N/A'}</p>
                                              <p className="text-[11px] text-gray-400 font-medium">{res.email || 'No Email'}</p>
                                          </div>
                                          
                                          <div className="space-y-3">
                                              <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Booking Context</p>
                                              <p className="text-xs font-bold text-gray-700">Type: <span className="font-medium">{res.reservationType || 'Normal Party'}</span></p>
                                              <p className="text-xs font-bold text-gray-700">Party Size: <span className="font-medium">{res.partySize || res.guests || '02'}</span></p>
                                              <p className="text-xs font-bold text-gray-700">Table: <span className="font-medium text-orange-500">{res.tableNo || res.tables || '#01'}</span></p>
                                          </div>

                                          <div className="space-y-3">
                                              <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Special Notes</p>
                                              <p className="text-xs text-gray-500 font-medium leading-relaxed italic">
                                                "{res.specialRequirements || 'Flat 0% OFF on Total Bill'}"
                                              </p>
                                              {res.adminMessage && (
                                                <div className="mt-4 p-3 bg-gray-50 rounded-xl border border-gray-100">
                                                    <p className="text-[9px] font-black text-gray-400 uppercase mb-1">Admin Note</p>
                                                    <p className="text-[10px] text-gray-600 font-medium italic">{res.adminMessage}</p>
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
                              onClick={handleStatusUpdate}
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
              <p className="text-gray-300 font-black uppercase tracking-widest text-sm">No reservations found in this section</p>
          </div>
      )}
    </div>
  );
};

export default Reservations;
