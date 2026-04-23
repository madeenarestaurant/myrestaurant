import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { productApi, categoryApi } from "../services/api";
import { ShoppingBag, Plus, Minus, X, Check, ChevronRight, Search, Filter } from "lucide-react";
import { clsx } from "clsx";

const Order = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [cart, setCart] = useState(() => {
        const saved = sessionStorage.getItem('cart');
        return saved ? JSON.parse(saved) : {};
    });
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [prodRes, catRes] = await Promise.all([
                    productApi.getAll(),
                    categoryApi.getAll()
                ]);
                setProducts(prodRes.data);
                setCategories(catRes.data);
            } catch (err) {
                console.error("Failed to fetch data", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        sessionStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product) => {
        setCart(prev => ({
            ...prev,
            [product._id]: {
                ...product,
                quantity: (prev[product._id]?.quantity || 0) + 1
            }
        }));
    };

    const removeFromCart = (productId) => {
        setCart(prev => {
            const next = { ...prev };
            if (next[productId].quantity > 1) {
                next[productId].quantity -= 1;
            } else {
                delete next[productId];
            }
            return next;
        });
    };

    const cartCount = Object.values(cart).reduce((sum, item) => sum + item.quantity, 0);
    const cartTotal = Object.values(cart).reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const filteredProducts = products.filter(p => {
        const matchesCategory = selectedCategory === "All" || 
            (typeof p.category === 'object' ? p.category._id === selectedCategory : p.category === selectedCategory);
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white font-outfit selection:bg-[#8C231F]">
            <Navbar transparent={false} />

            {/* Compact Header */}
            <div className="relative pt-6 pb-8 px-6 overflow-hidden">
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#8C231F]/5 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/4" />
                
                <div className="max-w-[1300px] mx-auto relative z-10">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                        <div className="space-y-3">
                            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                                <span className="text-[#8C231F] font-black text-[9px] uppercase tracking-[0.4em] mb-1.5 block font-sans">Premium Dining</span>
                                <h1 className="text-4xl md:text-5xl font-serif text-white uppercase tracking-tighter leading-[0.9]">
                                    Craft Your <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/40">Delicacy</span>
                                </h1>
                            </motion.div>
                            <div className="h-0.5 w-16 bg-[#8C231F] rounded-full" />
                        </div>

                        {/* Search Bar - Slimmer */}
                        <div className="w-full md:w-auto">
                            <div className="relative group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-700 group-focus-within:text-[#8C231F] transition-colors" size={16} />
                                <input 
                                    type="text"
                                    placeholder="Search delicacy..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="bg-white/5 border border-white/5 rounded-xl py-3 pl-12 pr-4 w-full md:w-64 text-[13px] outline-none focus:border-[#8C231F]/50 focus:bg-white/10 transition-all font-outfit"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Category Tabs - Smaller */}
                    <div className="mt-8 flex gap-2 overflow-x-auto no-scrollbar pb-2">
                        <CategoryTab 
                            label="All" 
                            active={selectedCategory === "All"} 
                            onClick={() => setSelectedCategory("All")} 
                        />
                        {categories.map(cat => (
                            <CategoryTab 
                                key={cat._id}
                                label={cat.name} 
                                active={selectedCategory === cat._id} 
                                onClick={() => setSelectedCategory(cat._id)} 
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Menu Grid - More compact columns */}
            <div className="max-w-[1300px] mx-auto px-6 pb-40">
                {loading ? (
                    <div className="h-64 flex flex-col items-center justify-center gap-3">
                        <div className="w-8 h-8 border-2 border-[#8C231F] border-t-transparent rounded-full animate-spin" />
                        <p className="text-[9px] font-black uppercase tracking-widest text-gray-600 font-sans">Syncing Delicacies...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                        <AnimatePresence mode="popLayout">
                            {filteredProducts.map((product) => (
                                <ProductCard 
                                    key={product._id} 
                                    product={product} 
                                    quantity={cart[product._id]?.quantity || 0}
                                    onAdd={() => addToCart(product)}
                                    onRemove={() => removeFromCart(product._id)}
                                />
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>

            {/* Bottom Mini-Cart Popup */}
            <AnimatePresence>
                {cartCount > 0 && (
                    <motion.div 
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6"
                    >
                        <div className="max-w-3xl mx-auto">
                            <div className="bg-[#1a1a1a]/95 backdrop-blur-2xl rounded-[2.5rem] border border-white/10 shadow-[0_-15px_40px_rgba(0,0,0,0.4)] overflow-hidden">
                                <div className="flex flex-col md:flex-row items-center justify-between p-3 md:p-4 gap-4 md:gap-6">
                                    {/* Selected Items Scroll */}
                                    <div className="flex items-center gap-2 w-full md:w-2/3 overflow-x-auto no-scrollbar px-1">
                                        <AnimatePresence>
                                            {Object.values(cart).map(item => (
                                                <motion.div 
                                                    key={item._id}
                                                    initial={{ scale: 0.8, opacity: 0 }}
                                                    animate={{ scale: 1, opacity: 1 }}
                                                    exit={{ scale: 0.8, opacity: 0 }}
                                                    className="flex items-center gap-2 bg-white/5 border border-white/5 rounded-xl p-1.5 pr-3 shrink-0"
                                                >
                                                    <img src={item.img} className="w-8 h-8 rounded-lg object-cover" alt={item.name} />
                                                    <div className="flex-1 min-w-[50px]">
                                                        <p className="text-[9px] font-bold uppercase line-clamp-1">{item.name}</p>
                                                        <p className="text-[10px] text-[#8C231F] font-black">×{item.quantity}</p>
                                                    </div>

                                                    <button 
                                                        onClick={() => removeFromCart(item._id)}
                                                        className="w-5 h-5 rounded-md bg-red-500/10 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"
                                                    >
                                                        <Minus size={10} />
                                                    </button>
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>
                                    </div>

                                    {/* Summary & Action */}
                                    <div className="flex items-center gap-5 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 md:border-l border-white/5 pt-3 md:pt-0 md:pl-6">
                                        <div className="text-left md:text-right">
                                            <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest leading-none mb-1 font-sans">Subtotal</p>
                                            <p className="text-xl font-bold text-white tracking-widest leading-none">OMR {Number(cartTotal).toLocaleString()}</p>
                                        </div>

                                        <button 
                                            onClick={() => navigate('/cart')}
                                            className="bg-[#8C231F] hover:bg-white hover:text-black text-white px-6 py-4 rounded-xl flex items-center gap-2.5 transition-all duration-500 group shadow-lg shadow-[#8C231F]/20 active:scale-95"
                                        >
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em] font-sans">Go to Cart</span>
                                            <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                                        </button>
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

const CategoryTab = ({ label, active, onClick }) => (
    <button 
        onClick={onClick}
        className={clsx(
            "px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-[0.3em] transition-all whitespace-nowrap border font-sans",
            active 
                ? "bg-[#8C231F] border-[#8C231F] text-white shadow-lg shadow-[#8C231F]/10" 
                : "bg-white/5 border-white/5 text-gray-500 hover:text-white hover:bg-white/10"
        )}
    >
        {label}
    </button>
);

const ProductCard = ({ product, quantity, onAdd, onRemove }) => (
    <motion.div 
        layout
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="group relative bg-[#121212] rounded-[1.8rem] border border-white/5 overflow-hidden hover:border-[#8C231F]/30 transition-all duration-500"
    >        {/* Extra Compact Image Section */}
        <div className="relative h-32 md:h-36 overflow-hidden">
            <img 
                src={product.img} 
                alt={product.name} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent" />
        </div>

        {/* Extra Compact Content */}
        <div className="p-4 pt-2.5">
            <div className="flex items-start justify-between gap-2 mb-1 min-h-[2.4rem]">
                <h3 className="text-[13px] font-serif tracking-wide text-white leading-tight group-hover:text-[#8C231F] transition-colors line-clamp-2 flex-1 uppercase">{product.name}</h3>
                <span className="text-[11px] font-bold text-[#8C231F] whitespace-nowrap mt-0.5">{product.price} OMR</span>
            </div>
            <p className="text-[8px] text-gray-600 font-bold uppercase leading-relaxed mb-4 line-clamp-2 h-6 font-sans">{product.description}</p>
            
            <div className="flex items-center justify-between gap-2.5">
                {quantity > 0 ? (
                    <div className="flex-1 flex items-center justify-between bg-white text-black rounded-lg p-0.5 shadow-lg">
                        <button onClick={onRemove} className="w-7 h-7 flex items-center justify-center hover:bg-[#8C231F] hover:text-white rounded-md transition-all">
                            <Minus size={10} />
                        </button>
                        <span className="font-black text-[10px]">{quantity}</span>
                        <button onClick={onAdd} className="w-7 h-7 flex items-center justify-center hover:bg-[#8C231F] hover:text-white rounded-md transition-all">
                            <Plus size={10} />
                        </button>
                    </div>
                ) : (
                    <button 
                        onClick={onAdd}
                        className="flex-1 py-2 bg-[#8C231F]/10 hover:bg-[#8C231F] text-[#8C231F] hover:text-white border border-[#8C231F]/20 rounded-lg font-black text-[8px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-1.5 group/btn active:scale-95 font-sans"
                    >
                        <Plus size={9} className="transition-transform group-hover/btn:rotate-90" />
                        Order
                    </button>
                )}
            </div>
        </div>
    </motion.div>
);

export default Order;
