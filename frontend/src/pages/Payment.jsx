import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";

import Navbar from "../components/Navbar";
import { ChevronLeft, CheckCircle2, ShieldCheck, CreditCard, Banknote, Wallet, Loader2, Sparkles } from "lucide-react";
import { clsx } from "clsx";
import { orderApi } from "../services/api";
import trackingService from "../services/trackingService";

const Payment = () => {
    const navigate = useNavigate();
    const [orderData, setOrderData] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('COD');
    const [processing, setProcessing] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const saved = sessionStorage.getItem('orderPending');
        if (!saved) {
            navigate('/order');
            return;
        }
        setOrderData(JSON.parse(saved));
    }, [navigate]);

    const handleFinalizeOrder = async () => {
        setProcessing(true);
        try {
            const finalPayload = {
                customerName: orderData.customerInfo.name || "Dine-In Customer",
                email: orderData.customerInfo.email || "dinein@madeena.com",
                phone: orderData.customerInfo.phone || "00000000",
                mode: orderData.mode,
                note: orderData.note,
                paymentMethod: paymentMethod,
                totalAmount: orderData.totalAmount,
                items: orderData.items.map(item => ({
                    product: item._id,
                    quantity: item.quantity,
                    price: item.price
                })),
                visitorId: trackingService.visitorId,
                addressDetails: orderData.mode === 'delivery' ? {
                    city: orderData.customerInfo.address_city,
                    place: orderData.customerInfo.address_place,
                    pincode: orderData.customerInfo.address_pincode,
                    street: orderData.customerInfo.address_street,
                    nearby: orderData.customerInfo.address_nearby
                } : undefined,
                address: orderData.mode === 'delivery' ? 
                    `${orderData.customerInfo.address_street}, ${orderData.customerInfo.address_place}, ${orderData.customerInfo.address_city} - ${orderData.customerInfo.address_pincode}` 
                    : "At Restaurant"
            };

            await orderApi.create(finalPayload);
            setSuccess(true);
            sessionStorage.removeItem('cart');
            sessionStorage.removeItem('orderPending');
        } catch (err) {
            console.error("Order creation failed", err);
            alert("Something went wrong. Please try again.");
        } finally {
            setProcessing(false);
        }
    };

    if (!orderData) return null;

    if (success) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center p-6">
                <motion.div 
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="max-w-md w-full bg-white/5 border border-white/10 rounded-[3rem] p-12 text-center relative overflow-hidden"
                >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#8C231F] to-transparent animate-pulse" />
                    
                    <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_50px_rgba(34,197,94,0.3)]">
                        <CheckCircle2 size={48} className="text-white" strokeWidth={3} />
                    </div>

                    <h2 className="text-4xl font-serif uppercase tracking-widest mb-4">Confirmed!</h2>
                    <p className="text-xs font-black text-gray-500 uppercase tracking-[0.3em] mb-8 leading-loose">
                        Your delicacies are being <br/>prepared with love.
                    </p>

                    <div className="flex flex-col gap-4">
                        <button 
                            onClick={() => navigate('/order')}
                            className="bg-white text-black py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-[#8C231F] hover:text-white transition-all shadow-xl"
                        >
                            Place Another Order
                        </button>
                        <Link 
                            to="/" 
                            className="text-gray-600 hover:text-white text-[9px] font-black uppercase tracking-widest"
                        >
                            Return to Home
                        </Link>
                    </div>
                    
                    <motion.div 
                        animate={{ opacity: [0.3, 0.6, 0.3] }}
                        transition={{ duration: 3, repeat: Infinity }}
                        className="mt-12 flex items-center justify-center gap-2 opacity-30"
                    >
                        <Sparkles size={14} className="text-[#8C231F]" />
                        <span className="text-[10px] font-black uppercase tracking-widest">MADEENA RESTAURANT</span>
                    </motion.div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white font-sans">
            <Navbar transparent={false} />

            <div className="max-w-xl mx-auto px-6 pt-32 pb-20">
                <div className="flex items-center gap-4 mb-12">
                    <button onClick={() => navigate('/cart')} className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 transition-all">
                        <ChevronLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-3xl font-serif uppercase tracking-widest leading-none">Payment</h1>
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-2">Secure checkout process</p>
                    </div>
                </div>

                <div className="bg-[#1a1a1a] rounded-[3rem] border border-white/5 overflow-hidden shadow-2xl relative">
                    <div className="absolute top-0 left-0 w-full h-1 bg-[#8C231F]/20" />
                    
                    <div className="p-10 md:p-12">
                        {/* Summary Card */}
                        <div className="bg-white/5 rounded-2xl p-6 mb-12 border border-white/5">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-[10px] font-black uppercase tracking-widest text-[#8C231F]">Amount to pay</span>
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">{orderData.mode}</span>
                            </div>
                            <div className="text-4xl font-serif tracking-tighter">OMR {Number(orderData.totalAmount).toLocaleString()}</div>

                        </div>

                        {/* Payment Selection */}
                        <div className="space-y-4 mb-12">
                            <label className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 mb-6 block">Select Method</label>
                            
                            <PaymentOption 
                                id="COD" 
                                label={orderData.mode === 'delivery' ? "Cash on Delivery" : "Pay at Restaurant"} 
                                icon={Banknote} 
                                active={paymentMethod === 'COD'} 
                                onClick={() => setPaymentMethod('COD')} 
                                desc="Handover on arrival"
                            />
                            <PaymentOption 
                                id="UPI" 
                                label="UPI Payment" 
                                icon={Wallet} 
                                active={paymentMethod === 'UPI'} 
                                onClick={() => setPaymentMethod('UPI')} 
                                desc="GPay, PhonePe, Paytm"
                            />
                            <PaymentOption 
                                id="Card" 
                                label="Credit / Debit Card" 
                                icon={CreditCard} 
                                active={paymentMethod === 'Card'} 
                                onClick={() => setPaymentMethod('Card')} 
                                desc="Visa, Mastercard, RuPay"
                            />
                        </div>

                        <div className="flex items-start gap-4 p-5 bg-white/5 rounded-2xl mb-12">
                            <ShieldCheck size={20} className="text-[#8C231F] shrink-0" />
                            <p className="text-[10px] text-gray-500 leading-relaxed">
                                Your information is secure. By placing the order, you agree to our 
                                <span className="text-[#8C231F] ml-1">Terms of Service</span>.
                            </p>
                        </div>

                        <button 
                            disabled={processing}
                            onClick={handleFinalizeOrder}
                            className={clsx(
                                "w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] transition-all duration-700 flex items-center justify-center gap-3 shadow-xl shadow-[#8C231F]/10",
                                processing ? "bg-white text-black" : "bg-[#8C231F] text-white hover:bg-white hover:text-black"
                            )}
                        >
                            {processing ? <Loader2 className="animate-spin" size={20} /> : "Authorize Order"}
                        </button>
                    </div>
                </div>

                <div className="mt-8 flex justify-center text-gray-700">
                    <Sparkles size={20} className="mr-3" />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em]">Handcrafted in Salalah</span>
                </div>
            </div>
        </div>
    );
};

const PaymentOption = ({ id, label, icon: Icon, active, onClick, desc }) => (
    <button 
        onClick={onClick}
        className={clsx(
            "w-full flex items-center gap-6 p-5 rounded-2xl border-2 transition-all duration-500 group relative",
            active 
                ? "bg-white/5 border-[#8C231F] text-white" 
                : "bg-transparent border-white/5 text-gray-500 hover:border-white/10"
        )}
    >
        <div className={clsx(
            "w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500",
            active ? "bg-[#8C231F] text-white" : "bg-white/5 text-gray-600 group-hover:text-[#8C231F] group-hover:bg-[#8C231F]/10"
        )}>
            <Icon size={20} strokeWidth={2.5} />
        </div>
        <div className="text-left">
            <p className="text-[11px] font-black uppercase tracking-widest">{label}</p>
            <p className="text-[9px] font-bold text-gray-600 mt-0.5">{desc}</p>
        </div>
        {active && (
            <motion.div layoutId="paymentCheck" className="ml-auto w-6 h-6 bg-[#8C231F] text-white rounded-full flex items-center justify-center shadow-lg">
                <CheckCircle2 size={14} strokeWidth={3} />
            </motion.div>
        )}
    </button>
);

export default Payment;
