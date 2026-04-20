import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { ChevronLeft, ChevronRight, CreditCard, Home, ShoppingBag, Truck, MapPin, User, Mail, Phone, MessageSquare, Check, Trash2, Plus, Minus, ShoppingCart, X } from "lucide-react";

import { clsx } from "clsx";

const Cart = () => {
    const navigate = useNavigate();
    const [cart, setCart] = useState(() => {
        const saved = sessionStorage.getItem('cart');
        return saved ? JSON.parse(saved) : {};
    });
    const [mode, setMode] = useState('dine-in');
    const [note, setNote] = useState('');
    const [customerInfo, setCustomerInfo] = useState({
        name: '',
        email: '',
        phone: '',
        address_city: '',
        address_place: '',
        address_pincode: '',
        address_street: '',
        address_nearby: ''
    });

    const cartItems = Object.values(cart);
    const cartTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const removeFromCart = (id) => {
        const next = { ...cart };
        delete next[id];
        setCart(next);
        sessionStorage.setItem('cart', JSON.stringify(next));
    };

    const updateQuantity = (id, delta) => {
        const next = { ...cart };
        if (next[id].quantity + delta > 0) {
            next[id].quantity += delta;
            setCart(next);
            sessionStorage.setItem('cart', JSON.stringify(next));
        }
    };

    const handleProceed = (e) => {
        e.preventDefault();
        const orderData = {
            mode,
            items: cartItems,
            totalAmount: cartTotal,
            note,
            customerInfo
        };
        sessionStorage.setItem('orderPending', JSON.stringify(orderData));
        navigate('/payment');
    };

    const inputClass = "w-full bg-[#151515] border border-white/5 rounded-xl py-3 px-4 text-white text-[12px] outline-none focus:border-[#8C231F] transition-all placeholder:text-gray-700 font-medium";
    const labelClass = "text-[9px] font-black uppercase tracking-[0.2em] text-gray-500 mb-2 block ml-1";

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-[#8C231F]">
            <Navbar transparent={false} />

            <div className="max-w-[1240px] mx-auto px-6 pt-24 pb-20">
                
                {/* Simplified Header */}
                <div className="flex items-center gap-4 mb-10 border-b border-white/5 pb-6">
                    <button onClick={() => navigate('/order')} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#8C231F]/20 transition-all group">
                        <ChevronLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" />
                    </button>
                    <div>
                        <h1 className="text-xl font-serif uppercase tracking-widest leading-none">Checkout Flow</h1>
                        <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest mt-1.5">Review and finalize selections</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    {/* Left Side: Items shown in a small/compact div/column */}
                    <div className="lg:col-span-5 space-y-6">
                        <div className="flex items-center justify-between items-end mb-2">
                            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-white flex items-center gap-3">
                                <ShoppingCart size={14} className="text-[#8C231F]" /> My Selection
                            </h2>
                            <span className="text-[9px] text-gray-600 font-black uppercase">{cartItems.length} Variety</span>
                        </div>

                        <div className="space-y-3 max-h-[70vh] overflow-y-auto no-scrollbar pr-2">
                            {cartItems.map(item => (
                                <motion.div 
                                    layout key={item._id}
                                    className="bg-[#121212] border border-white/5 p-3 rounded-2xl flex items-center gap-4 hover:border-[#8C231F]/20 transition-all group"
                                >
                                    <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-white/5">
                                        <img src={item.img} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={item.name} />
                                    </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-bold tracking-tight truncate">{item.name}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-[10px] font-serif text-[#8C231F]">OMR {item.price}</span>
                                                <span className="text-[8px] text-gray-600 font-bold uppercase tracking-widest">Qty: {item.quantity}</span>
                                            </div>
                                        </div>

                                    <div className="flex flex-col items-end gap-2 pr-1">
                                        <div className="flex items-center bg-black rounded-lg p-0.5 border border-white/5 shadow-inner">
                                            <button onClick={() => updateQuantity(item._id, -1)} className="w-7 h-7 flex items-center justify-center hover:bg-red-500/10 hover:text-red-500 rounded-md transition-all"><Minus size={12} /></button>
                                            <span className="w-6 text-center text-[10px] font-black">{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item._id, 1)} className="w-7 h-7 flex items-center justify-center hover:bg-green-500/10 hover:text-green-500 rounded-md transition-all"><Plus size={12} /></button>
                                        </div>
                                        <button onClick={() => removeFromCart(item._id)} className="text-[8px] font-black uppercase tracking-widest text-red-500/30 hover:text-red-500 transition-colors">
                                           <X size={12} />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                            {cartItems.length === 0 && (
                                <div className="text-center py-16 bg-[#121212] rounded-[2rem] border border-dashed border-white/5">
                                    <ShoppingBag size={32} className="mx-auto mb-4 text-white/10" />
                                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-600">Your bag is empty</p>
                                    <Link to="/order" className="text-[9px] font-black text-[#8C231F] uppercase mt-3 block hover:underline">Return to delicacies</Link>
                                </div>
                            )}
                        </div>

                        {/* Summary Box At Bottom of Left Column */}
                        <div className="bg-[#1a1a1a] rounded-[2rem] p-6 border border-white/5">
                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-[8px] font-black uppercase tracking-[0.2em] text-gray-600 mb-1">Total Amount</p>
                                    <h3 className="text-3xl font-serif text-white tracking-tighter leading-none">OMR {Number(cartTotal).toLocaleString()}</h3>
                                </div>

                                <div className="text-right">
                                    <p className="text-[8px] font-black uppercase tracking-[0.2em] text-[#8C231F] mb-1">Items</p>
                                    <p className="text-xs font-bold font-serif leading-none">{cartItems.reduce((a,b)=>a+b.quantity, 0)}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Options, Form and Payment */}
                    <div className="lg:col-span-7">
                        <div className="bg-[#121212] rounded-[2.5rem] border border-white/5 p-8 md:p-10 shadow-2xl relative overflow-hidden h-full flex flex-col">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#8C231F]/5 blur-3xl pointer-events-none" />
                            
                            <div className="space-y-8 flex-1">
                                {/* 1. Message Input */}
                                <div className="space-y-3">
                                    <label className={labelClass}>Chef's Note (Optional)</label>
                                    <div className="relative">
                                        <MessageSquare className="absolute left-5 top-5 text-gray-700" size={14} />
                                        <textarea 
                                            rows={2}
                                            value={note}
                                            onChange={e => setNote(e.target.value)}
                                            className={clsx(inputClass, "pl-12 pt-4 h-24 resize-none")}
                                            placeholder="Example: Keep it extra spicy, No mayo, allergic to nuts..."
                                        />
                                    </div>
                                </div>

                                {/* 2. Mode Selection Row */}
                                <div className="space-y-4">
                                    <label className={labelClass}>Selection Mode</label>
                                    <div className="bg-white/5 p-1 rounded-2xl flex flex-wrap items-center gap-1 border border-white/5">
                                        <ModeOption id="dine-in" label="Dine In" icon={Home} active={mode === 'dine-in'} onClick={() => setMode('dine-in')} />
                                        <ModeOption id="take-away" label="Take Away" icon={ShoppingBag} active={mode === 'take-away'} onClick={() => setMode('take-away')} />
                                        <ModeOption id="delivery" label="Delivery" icon={Truck} active={mode === 'delivery'} onClick={() => setMode('delivery')} />
                                    </div>
                                </div>

                                {/* 3. Dynamic Form */}
                                <AnimatePresence mode="wait">
                                    {mode !== 'dine-in' ? (
                                        <motion.form 
                                            id="orderForm"
                                            key={mode}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, x: -10 }}
                                            onSubmit={handleProceed}
                                            className="space-y-4 pt-4 border-t border-white/5"
                                        >
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-1">
                                                    <label className={labelClass}>Customer Name</label>
                                                    <input required value={customerInfo.name} onChange={e => setCustomerInfo({...customerInfo, name: e.target.value})} className={inputClass} placeholder="Full Name" />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className={labelClass}>Phone</label>
                                                    <input required value={customerInfo.phone} onChange={e => setCustomerInfo({...customerInfo, phone: e.target.value})} className={inputClass} placeholder="+968 ..." />
                                                </div>
                                                <div className="md:col-span-2 space-y-1">
                                                    <label className={labelClass}>Email Address</label>
                                                    <input required type="email" value={customerInfo.email} onChange={e => setCustomerInfo({...customerInfo, email: e.target.value})} className={inputClass} placeholder="Email" />
                                                </div>
                                            </div>

                                            {mode === 'delivery' && (
                                                <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-6 mt-4">
                                                    <div className="space-y-1">
                                                        <label className={labelClass}>City</label>
                                                        <input required value={customerInfo.address_city} onChange={e => setCustomerInfo({...customerInfo, address_city: e.target.value})} className={inputClass} placeholder="e.g. Salalah" />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <label className={labelClass}>Area / Place</label>
                                                        <input required value={customerInfo.address_place} onChange={e => setCustomerInfo({...customerInfo, address_place: e.target.value})} className={inputClass} placeholder="Neighborhood" />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <label className={labelClass}>Street & Build</label>
                                                        <input required value={customerInfo.address_street} onChange={e => setCustomerInfo({...customerInfo, address_street: e.target.value})} className={inputClass} placeholder="Street Name" />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <label className={labelClass}>Landmark</label>
                                                        <input required value={customerInfo.address_nearby} onChange={e => setCustomerInfo({...customerInfo, address_nearby: e.target.value})} className={inputClass} placeholder="Near Mosque/School" />
                                                    </div>
                                                </div>
                                            )}
                                        </motion.form>
                                    ) : (
                                        <motion.div 
                                            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                            className="pt-10 pb-6 text-center space-y-2 opacity-50 border-t border-white/5"
                                        >
                                            <Check className="mx-auto text-[#8C231F]" size={24} />
                                            <p className="text-[10px] font-black uppercase tracking-[0.3em]">No details needed for dine-in</p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* 4. Payment Button */}
                            <div className="mt-12 pt-8 border-t border-white/5">
                                <button 
                                    onClick={mode === 'dine-in' ? handleProceed : undefined}
                                    type={mode === 'dine-in' ? 'button' : 'submit'}
                                    form={mode !== 'dine-in' ? 'orderForm' : undefined}
                                    disabled={cartItems.length === 0}
                                    className="w-full py-5 bg-[#8C231F] hover:bg-white text-white hover:text-black rounded-2xl font-black text-[11px] uppercase tracking-[0.4em] transition-all duration-500 shadow-2xl flex items-center justify-center gap-3 disabled:opacity-20 active:scale-95 group"
                                >
                                    Proceed to Payment
                                    <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ModeOption = ({ label, icon: Icon, active, onClick }) => (
    <button 
        onClick={onClick}
        className={clsx(
            "flex-1 flex items-center justify-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-500 text-[9px] font-black uppercase tracking-widest min-w-[120px]",
            active 
                ? "bg-white text-black shadow-lg shadow-white/5" 
                : "text-gray-500 hover:text-white"
        )}
    >
        <Icon size={14} strokeWidth={active ? 3 : 2} />
        {label}
    </button>
);

export default Cart;
