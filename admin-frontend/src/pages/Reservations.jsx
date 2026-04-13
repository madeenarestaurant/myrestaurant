import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import { FiCalendar, FiCheck, FiX, FiInfo, FiPhone, FiMail, FiLoader } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import Toast from '../components/common/Toast';
import { clsx } from 'clsx';

const Reservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [toast, setToast] = useState({ message: '', type: 'success' });
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const response = await axiosInstance.get('/reservations');
      setReservations(response.data);
      setLoading(false);
    } catch (error) {
      setToast({ message: 'Failed to load reservations', type: 'error' });
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    setActionLoading(id);
    try {
      await axiosInstance.put(`/reservations/${id}`, { status });
      setToast({ message: `Reservation marked as ${status}!`, type: 'success' });
      fetchReservations();
    } catch (error) {
      setToast({ message: 'Status update failed', type: 'error' });
    } finally {
      setActionLoading(null);
    }
  };

  const filteredReservations = filter === 'All' 
    ? reservations 
    : reservations.filter(res => res.status === filter);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Confirmed': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'Pending': return 'bg-orange-50 text-orange-600 border-orange-100';
      case 'Rejected': return 'bg-rose-50 text-rose-600 border-rose-100';
      case 'Requested': return 'bg-indigo-50 text-indigo-600 border-indigo-100';
      default: return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <div className="w-16 h-16 border-4 border-[#8B3B3B]/10 border-t-[#8B3B3B] rounded-full animate-spin" />
        <span className="font-black text-gray-400 uppercase tracking-widest text-[10px]">Syncing Hall Bookings...</span>
    </div>
  );

  return (
    <div className="space-y-8">
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-800 tracking-tighter">Hall Reservations</h1>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Found {reservations.length} total booking requests</p>
        </div>
        <div className="flex gap-2 p-2 bg-gray-50 rounded-[2rem] w-fit overflow-x-auto no-scrollbar border border-gray-100 shadow-sm">
          {['All', 'Requested', 'Pending', 'Confirmed', 'Rejected'].map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={clsx("px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all", filter === f ? 'bg-white text-[#8B3B3B] shadow-sm' : 'text-gray-400 hover:text-gray-600')}>{f}</button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
            {filteredReservations.map((res) => (
            <motion.div 
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                key={res._id} 
                className="bg-white rounded-[3rem] border border-gray-100 overflow-hidden shadow-sm hover:shadow-2xl transition-all group"
            >
                <div className="p-8 border-b border-gray-50 flex justify-between items-start">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl brand-gradient flex items-center justify-center text-white font-black text-xl shadow-lg shadow-primary-500/10">
                    {res.fullName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                    <h3 className="font-black text-gray-800 tracking-tight text-lg">{res.fullName}</h3>
                    <div className={clsx("text-[9px] px-3 py-1 rounded-full font-black uppercase inline-block border mt-1", getStatusColor(res.status))}>
                        {res.status}
                    </div>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">{new Date(res.eventDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                    <div className="px-3 py-1.5 bg-gray-100 rounded-xl text-[10px] font-bold text-gray-600 flex items-center gap-2">
                        <FiClock size={12} />
                        {res.startTime} - {res.endTime}
                    </div>
                </div>
                </div>

                <div className="p-8 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl text-[10px] font-bold text-gray-500 hover:text-[#8B3B3B] transition-colors cursor-pointer border border-transparent hover:border-[#8B3B3B]/10">
                        <FiPhone size={16} /> <span>{res.phone}</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl text-[10px] font-bold text-gray-500 border border-transparent">
                        <FiMail size={16} /> <span className="truncate">{res.email}</span>
                    </div>
                </div>

                <div className="p-6 bg-[#8B3B3B]/5 rounded-[2rem] space-y-3 relative overflow-hidden">
                    <div className="absolute right-4 top-4 text-[#8B3B3B]/10">
                        <FiInfo size={40} />
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase text-[#8B3B3B] relative z-10">
                        <FiCalendar size={14} /> <span>{res.reservationType}</span>
                    </div>
                    <p className="text-xs text-gray-600 font-medium leading-relaxed relative z-10">"{res.specialRequirements || 'No special requirements listed for this booking.'}"</p>
                </div>
                </div>

                <div className="p-6 bg-gray-50/50 flex gap-3">
                {res.status !== 'Confirmed' && (
                    <button 
                        disabled={actionLoading === res._id} 
                        onClick={() => handleStatusUpdate(res._id, 'Confirmed')} 
                        className="flex-1 flex items-center justify-center gap-2 bg-[#8B3B3B] hover:bg-gray-800 text-white h-14 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-xl shadow-[#8B3B3B]/10 disabled:opacity-50"
                    >
                    {actionLoading === res._id ? <FiLoader className="animate-spin" /> : <><FiCheck size={18} /> Approve</>}
                    </button>
                )}
                {res.status !== 'Rejected' && (
                    <button 
                        disabled={actionLoading === res._id} 
                        onClick={() => handleStatusUpdate(res._id, 'Rejected')} 
                        className="flex-1 flex items-center justify-center gap-2 bg-white border-2 border-rose-100 text-rose-500 hover:bg-rose-50 h-14 rounded-2xl text-xs font-black uppercase tracking-widest transition-all disabled:opacity-50"
                    >
                    {actionLoading === res._id ? <FiLoader className="animate-spin" /> : <><FiX size={18} /> Reject</>}
                    </button>
                )}
                </div>
            </motion.div>
            ))}
        </AnimatePresence>
      </div>
      
      {filteredReservations.length === 0 && (
        <div className="text-center py-40 bg-white rounded-[3rem] border-2 border-dashed border-gray-100 flex flex-col items-center justify-center">
          <FiCalendar size={64} className="text-gray-100 mb-6" />
          <p className="text-gray-400 font-black uppercase tracking-widest text-xs italic">The reservations diary is empty for this view.</p>
        </div>
      )}
    </div>
  );
};

export default Reservations;
