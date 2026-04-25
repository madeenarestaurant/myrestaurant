import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { 
    ChevronLeft, ChevronRight, CreditCard, Home, ShoppingBag, 
    Truck, MapPin, User, Mail, Phone, MessageSquare, Check, 
    Trash2, Plus, Minus, ShoppingCart, X, Package, ArrowRight, 
    Loader2, Utensils, Hash
} from "lucide-react";
import { orderApi } from "../services/api";
import { clsx } from "clsx";

const Cart = () => {
    const navigate = useNavigate();
    const [cart, setCart] = useState(() => {
        const saved = sessionStorage.getItem('cart');
        return saved ? JSON.parse(saved) : {};
    });
    const [mode, setMode] = useState(null); // Default to null to hide form
    const [note, setNote] = useState('');
    const [customerInfo, setCustomerInfo] = useState({
        customerName: '',
        email: '',
        phone: '',
        address_city: '',
        address_place: '',
        address_pincode: '',
        address_street: '',
        address_nearby: ''
    });
    const [showConfirm, setShowConfirm] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [orderData, setOrderData] = useState(null); // Stores created order info

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
        if (e) e.preventDefault();
        setShowConfirm(true);
    };

    const handleConfirmOrder = async () => {
        setIsSubmitting(true);
        const submissionData = {
            mode,
            items: cartItems.map(item => ({
                product: item._id,
                quantity: item.quantity,
                price: item.price
            })),
            totalAmount: cartTotal,
            note,
            customerName: customerInfo.customerName,
            email: customerInfo.email,
            phone: customerInfo.phone,
            addressDetails: mode === 'delivery' ? {
                city: customerInfo.address_city,
                place: customerInfo.address_place,
                pincode: customerInfo.address_pincode,
                street: customerInfo.address_street,
                nearby: customerInfo.address_nearby
            } : undefined,
            paymentMethod: 'COD'
        };

        try {
            const res = await orderApi.create(submissionData);
            setOrderData(res.data);
            sessionStorage.removeItem('cart');
            setCart({});
        } catch (err) {
            console.error("Order failed", err);
            alert("Failed to place order. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const inputClass = "w-full bg-[#151515] border border-white/5 rounded-xl py-3 px-4 text-white text-[12px] outline-none focus:border-[#8C231F] transition-all placeholder:text-gray-700 font-medium font-outfit";
    const labelClass = "text-[9px] font-black uppercase tracking-[0.2em] text-gray-500 mb-2 block ml-1 font-sans";

    if (orderData) {
        const modeMessages = {
            'dine-in': "Please find a comfortable table. Our staff will serve you shortly.",
            'take-away': "Your order is being packed. We'll notify you when it's ready for pickup.",
            'delivery': "Sit back and relax! Our delivery partner will be at your doorstep soon."
        };

        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6 font-outfit">
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-[#121212] border border-white/5 p-8 md:p-12 rounded-[3rem] text-center max-w-lg w-full shadow-[0_32px_64px_-15px_rgba(0,0,0,0.5)] relative overflow-hidden"
                >
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-[#8C231F] to-transparent opacity-50" />
                    
                    <div className="w-24 h-24 bg-[#8C231F]/10 text-[#8C231F] rounded-full flex items-center justify-center mx-auto mb-8 relative">
                        <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: 'spring' }}
                            className="absolute inset-0 bg-[#8C231F]/20 rounded-full blur-xl"
                        />
                        <Check size={48} strokeWidth={3} className="relative z-10" />
                    </div>

                    <h2 className="text-4xl font-serif uppercase tracking-tight mb-4">Order Confirmed</h2>
                    
                    <div className="bg-white/5 rounded-3xl p-6 mb-8 border border-white/5">
                        <div className="flex flex-col items-center gap-2 mb-6">
                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Your Unique Token</span>
                            <div className="flex items-center gap-3">
                                <Hash className="text-[#8C231F]" size={20} />
                                <span className="text-5xl font-black tracking-tighter text-white">{orderData.token}</span>
                            </div>
                        </div>
                        
                        <div className="h-px bg-white/5 w-full mb-6" />
                        
                        <p className="text-gray-400 text-sm leading-relaxed mb-2 font-medium">
                            {modeMessages[orderData.mode] || "Your delicacy is being prepared by our chefs."}
                        </p>
                        <p className="text-[10px] text-[#8C231F] font-black uppercase tracking-widest">
                            Order Status: Waiting for Confirmation
                        </p>
                    </div>

                    <div className="flex flex-col gap-4">
                        <button 
                            onClick={() => navigate('/order')}
                            className="w-full py-5 bg-[#8C231F] text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.4em] transition-all hover:bg-white hover:text-black shadow-xl"
                        >
                            Return to Menu
                        </button>
                        <p className="text-[9px] text-gray-600 font-black uppercase tracking-widest">
                            A confirmation email has been sent to {orderData.email}
                        </p>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white font-outfit selection:bg-[#8C231F]">
            <div className="max-w-[1240px] mx-auto px-6 pt-12 pb-20">
                
                {/* Header */}
                <div className="flex items-center gap-4 mb-10 border-b border-white/5 pb-6">
                    <button onClick={() => navigate('/order')} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#8C231F]/20 transition-all group">
                        <ChevronLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" />
                    </button>
                    <div>
                        <h1 className="text-xl font-serif uppercase tracking-widest leading-none">Checkout Flow</h1>
                        <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest mt-1.5 font-sans">Review and finalize selections</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    {/* Left Side: Items */}
                    <div className="lg:col-span-5 space-y-6">
                        <div className="flex items-center justify-between items-end mb-2">
                            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-white flex items-center gap-3 font-sans">
                                <ShoppingCart size={14} className="text-[#8C231F]" /> My Selection
                            </h2>
                            <span className="text-[9px] text-gray-600 font-black uppercase font-sans">{cartItems.length} Variety</span>
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
                                        <p className="text-xs font-bold tracking-tight truncate uppercase">{item.name}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-[11px] font-semibold text-[#8C231F]">OMR {item.price}</span>
                                            <span className="text-[8px] text-gray-600 font-bold uppercase tracking-widest font-sans">Qty: {item.quantity}</span>
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
                                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-600 font-sans">Your bag is empty</p>
                                    <Link to="/order" className="text-[9px] font-black text-[#8C231F] uppercase mt-3 block hover:underline font-sans">Return to delicacies</Link>
                                </div>
                            )}
                        </div>

                        {/* Summary Box */}
                        <div className="bg-[#1a1a1a] rounded-[2rem] p-6 border border-white/5">
                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-[8px] font-black uppercase tracking-[0.2em] text-gray-600 mb-1 font-sans">Total Amount</p>
                                    <h3 className="text-3xl font-bold text-white tracking-tighter leading-none">OMR {Number(cartTotal).toLocaleString()}</h3>
                                </div>
                                <div className="text-right">
                                    <p className="text-[8px] font-black uppercase tracking-[0.2em] text-[#8C231F] mb-1 font-sans">Items</p>
                                    <p className="text-sm font-bold leading-none">{cartItems.reduce((a,b)=>a+b.quantity, 0)}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Mode & Form */}
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
                                    <label className={labelClass}>Select Service Mode</label>
                                    <div className="bg-white/5 p-1 rounded-2xl flex flex-wrap items-center gap-1 border border-white/5">
                                        <ModeOption id="dine-in" label="Dine In" icon={Utensils} active={mode === 'dine-in'} onClick={() => setMode('dine-in')} />
                                        <ModeOption id="take-away" label="Take Away" icon={ShoppingBag} active={mode === 'take-away'} onClick={() => setMode('take-away')} />
                                        <ModeOption id="delivery" label="Delivery" icon={Truck} active={mode === 'delivery'} onClick={() => setMode('delivery')} />
                                    </div>
                                </div>

                                {/* 3. Dynamic Form - Hidden until mode selected */}
                                <AnimatePresence mode="wait">
                                    {mode ? (
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
                                                    <label className={labelClass}>Full Name</label>
                                                    <input required value={customerInfo.customerName} onChange={e => setCustomerInfo({...customerInfo, customerName: e.target.value})} className={inputClass} placeholder="Full Name" />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className={labelClass}>Mobile Number</label>
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

                                            <div className="pt-8">
                                                <button 
                                                    type="submit"
                                                    disabled={cartItems.length === 0}
                                                    className="w-full py-5 bg-[#8C231F] hover:bg-white text-white hover:text-black rounded-2xl font-black text-[11px] uppercase tracking-[0.4em] transition-all duration-500 shadow-2xl flex items-center justify-center gap-3 disabled:opacity-20 active:scale-95 group font-sans"
                                                >
                                                    Finalize Order
                                                    <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                                </button>
                                            </div>
                                        </motion.form>
                                    ) : (
                                        <motion.div 
                                            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                            className="pt-16 pb-16 text-center space-y-4 border-t border-white/5 bg-white/5 rounded-3xl"
                                        >
                                            <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto">
                                                <ArrowRight className="text-[#8C231F] animate-pulse" size={24} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-[0.3em] font-sans text-white/40">Select a mode to continue</p>
                                                <p className="text-[8px] text-gray-700 font-bold uppercase tracking-widest mt-1">Dine-in, Takeaway, or Delivery</p>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Confirmation Popup */}
            <AnimatePresence>
                {showConfirm && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => !isSubmitting && setShowConfirm(false)}
                            className="absolute inset-0 bg-black/90 backdrop-blur-md"
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-[#121212] border border-white/10 w-full max-w-sm rounded-[2.5rem] overflow-hidden shadow-2xl relative z-[101]"
                        >
                            <div className="p-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 rounded-full bg-[#8C231F]/10 flex items-center justify-center text-[#8C231F]">
                                        <Package size={20} />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-serif uppercase tracking-tight">Review Order</h3>
                                        <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Confirm Selections</p>
                                    </div>
                                </div>

                                <div className="space-y-4 mb-8">
                                    <div className="bg-white/5 rounded-2xl p-4 space-y-3">
                                        {cartItems.slice(0, 3).map(item => (
                                            <div key={item._id} className="flex justify-between items-center text-[10px] font-bold text-gray-300 uppercase">
                                                <span className="truncate max-w-[150px]">{item.name}</span>
                                                <span className="text-white/50">×{item.quantity}</span>
                                            </div>
                                        ))}
                                        {cartItems.length > 3 && (
                                            <div className="text-[9px] text-gray-600 font-bold text-center">+{cartItems.length - 3} more items</div>
                                        )}
                                    </div>

                                    <div className="flex justify-between items-center px-2">
                                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Service Mode</span>
                                        <span className="text-[10px] font-bold text-white uppercase">{mode}</span>
                                    </div>
                                    <div className="h-px bg-white/5 mx-2" />
                                    <div className="flex justify-between items-center px-2">
                                        <span className="text-[11px] font-serif uppercase text-[#8C231F] font-black">Final Total</span>
                                        <span className="text-xl font-bold text-white uppercase tracking-tighter">OMR {cartTotal.toLocaleString()}</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <button 
                                        disabled={isSubmitting}
                                        onClick={() => setShowConfirm(false)}
                                        className="py-4 bg-white/5 hover:bg-white/10 text-white rounded-xl font-black text-[10px] uppercase tracking-widest transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        disabled={isSubmitting}
                                        onClick={handleConfirmOrder}
                                        className="py-4 bg-[#8C231F] hover:bg-white hover:text-black text-white rounded-xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                                    >
                                        {isSubmitting ? (
                                            <Loader2 size={14} className="animate-spin" />
                                        ) : (
                                            <>Place Order <ArrowRight size={14} /></>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

const ModeOption = ({ label, icon: Icon, active, onClick }) => (
    <button 
        onClick={onClick}
        className={clsx(
            "flex-1 flex items-center justify-center gap-3 px-4 py-4 rounded-xl transition-all duration-500 text-[9px] font-black uppercase tracking-widest min-w-[110px] font-sans",
            active 
                ? "bg-[#8C231F] text-white shadow-lg shadow-[#8C231F]/20" 
                : "text-gray-500 hover:text-white hover:bg-white/5"
        )}
    >
        <Icon size={14} strokeWidth={active ? 3 : 2} />
        {label}
    </button>
);

export default Cart;
