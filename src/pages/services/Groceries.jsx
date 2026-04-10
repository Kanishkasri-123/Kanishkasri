import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Leaf, Clock, MapPin, ArrowRight, CheckCircle, Package, Truck, Tag, Star, Eye, X } from 'lucide-react';
import { useUI } from '../../context/UIContext';
import api from '../../api/client';

const Groceries = () => {
    const { openServiceModal } = useUI();
    const [activeTab, setActiveTab] = useState('fresh');
    const [products, setProducts] = useState([]);
    const [loadingProducts, setLoadingProducts] = useState(true);
    const [activeCategory, setActiveCategory] = useState('all');
    const [selectedProduct, setSelectedProduct] = useState(null);

    useEffect(() => {
        api.get('/groceries/products')
            .then(res => { if (res.data.success) setProducts(res.data.data); })
            .catch(() => {})
            .finally(() => setLoadingProducts(false));
    }, []);

    return (
        <div className="pt-3 min-h-screen">
            {/* Hero */}
            <section className="relative rounded-[2.5rem] margin-x-custom mx-4 md:mx-6 mb-16 overflow-hidden min-h-[500px] flex items-center shadow-2xl shadow-orange-100/50">
                <div className="absolute inset-0">
                    <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" alt="Fresh Groceries" className="w-full h-full object-cover" />
                </div>
                
                <div className="absolute inset-0 bg-gradient-to-r from-orange-950/90 via-orange-900/40 to-transparent"></div>

                <div className="container-custom relative z-10 px-8 md:px-12 py-12">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-3xl"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/20 backdrop-blur-md border border-orange-500/50 text-orange-200 text-xs font-bold uppercase tracking-wider mb-8 shadow-sm">
                            <Leaf size={14} className="text-orange-400" />
                            Fresh & Farm-To-Table
                        </div>

                        <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white font-display leading-tight drop-shadow-lg">
                            Purity You Can <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-300 to-yellow-300">Taste</span>
                        </h1>
                        <p className="text-xl text-orange-100 max-w-2xl mb-12 leading-relaxed font-sans font-medium">
                            Premium quality staples, organic heritage grains, and farm-fresh essentials delivered with care to your doorstep.
                        </p>
                        
                        <div className="flex flex-wrap gap-4">
                            <button
                                onClick={() => setActiveTab('fresh')}
                                className={`px-8 py-4 rounded-full font-bold transition-all shadow-lg hover:-translate-y-1 ${activeTab === 'fresh' ? 'bg-gradient-to-r from-orange-500 to-yellow-600 text-white shadow-orange-950/20' : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'}`}
                            >
                                Fresh Harvest
                            </button>
                            <button
                                onClick={() => setActiveTab('organic')}
                                className={`px-8 py-4 rounded-full font-bold transition-all shadow-lg hover:-translate-y-1 ${activeTab === 'organic' ? 'bg-gradient-to-r from-orange-500 to-yellow-600 text-white shadow-orange-950/20' : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'}`}
                            >
                                Organic Staples
                            </button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Features */}
            <section className="py-12">
                <div className="container-custom">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {[
                            { title: "Direct from Farms", desc: "Sourced directly to ensure maximum freshness and fairness to farmers.", icon: MapPin },
                            { title: "Chemical Free", desc: "No harmful pesticides or artificial preservatives used.", icon: CheckCircle },
                            { title: "Same Day Delivery", desc: "Harvested in the morning, on your table by evening.", icon: Clock },
                            { title: "Eco-Packaging", desc: "Plastic-free, sustainable packaging for a better planet.", icon: Leaf }
                        ].map((feature, idx) => (
                            <div key={idx} className="p-6 rounded-3xl bg-white/40 border border-slate-100 hover:bg-white hover:shadow-xl hover:border-orange-100 transition-all duration-300 group">
                                <div className="w-12 h-12 bg-white rounded-2xl shadow-sm text-orange-600 flex items-center justify-center mb-4 border border-slate-100 group-hover:scale-110 transition-transform">
                                    <feature.icon size={24} />
                                </div>
                                <h3 className="font-bold text-lg text-gray-900 mb-2 font-display">{feature.title}</h3>
                                <p className="text-sm text-gray-500 leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Live Product Catalog */}
            <div className="container-custom pb-10 mt-10">
                <div className="text-center max-w-2xl mx-auto mb-10">
                    <span className="text-orange-600 font-bold tracking-widest uppercase text-xs mb-3 block">Live Catalog</span>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 font-display">Our Premium Products</h2>
                    <p className="text-gray-500 mt-3 text-base">Handpicked premium items, added fresh from our farm partners.</p>
                </div>

                {/* Category Filter Bar */}
                {products.length > 0 && (
                    <div className="flex flex-wrap gap-2 justify-center mb-10">
                        {['all', ...new Set(products.map(p => p.category))].map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${activeCategory === cat ? 'bg-orange-600 text-white shadow-md shadow-orange-200' : 'bg-white text-gray-600 border border-gray-200 hover:border-orange-300 hover:text-orange-600'}`}
                            >
                                {cat === 'all' ? '🛒 All Products' : cat}
                            </button>
                        ))}
                    </div>
                )}

                {/* Product Grid */}
                {loadingProducts ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="bg-white rounded-2xl h-72 animate-pulse border border-gray-100">
                                <div className="h-44 bg-gray-100 rounded-t-2xl" />
                                <div className="p-4 space-y-2">
                                    <div className="h-3 bg-gray-100 rounded w-3/4" />
                                    <div className="h-3 bg-gray-100 rounded w-1/2" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                        <div className="text-6xl mb-4">🛒</div>
                        <h3 className="text-xl font-bold text-gray-700 mb-2">Coming Soon!</h3>
                        <p className="text-gray-400 max-w-xs mx-auto">Our team is curating the finest organic products. Check back soon or subscribe below.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                        {products
                            .filter(p => activeCategory === 'all' || p.category === activeCategory)
                            .map((product, idx) => {
                                const discount = parseFloat(product.discount_percent);
                                return (
                                    <motion.div
                                        key={product.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
                                    >
                                        {/* Image */}
                                        <div className="relative h-44 bg-gray-50 overflow-hidden">
                                            {product.image_url ? (
                                                <img
                                                    src={`${api.defaults.baseURL.replace('/api', '')}${product.image_url}`}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-5xl">🥗</div>
                                            )}
                                            {discount > 0 && (
                                                <div className="absolute top-2 left-2 bg-green-500 text-white text-[10px] font-black px-2 py-1 rounded-md">
                                                    {Math.round(discount)}% OFF
                                                </div>
                                            )}
                                            {product.stock <= 10 && product.stock > 0 && (
                                                <div className="absolute top-2 right-2 bg-orange-500 text-white text-[9px] font-bold px-2 py-1 rounded-md">
                                                    Only {product.stock} left
                                                </div>
                                            )}
                                            {product.stock === 0 && (
                                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                                    <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">Out of Stock</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Details */}
                                        <div className="p-4 flex flex-col flex-1">
                                            {product.brand && (
                                                <p className="text-[10px] font-bold text-orange-600 uppercase tracking-wider mb-1">{product.brand}</p>
                                            )}
                                            <h3 className="text-sm font-bold text-gray-900 leading-snug mb-2 line-clamp-2">{product.name}</h3>
                                            {product.weight && (
                                                <p className="text-[11px] text-gray-400 mb-3">{product.weight}</p>
                                            )}
                                            <div className="mt-auto">
                                                <div className="flex items-baseline gap-2 mb-3">
                                                    <span className="text-lg font-black text-orange-600">₹{product.selling_price}</span>
                                                    {discount > 0 && (
                                                        <span className="text-xs text-gray-400 line-through">₹{product.mrp}</span>
                                                    )}
                                                </div>
                                                {/* Two-button row */}
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => setSelectedProduct(product)}
                                                        className="flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200"
                                                    >
                                                        <Eye size={13} /> Details
                                                    </button>
                                                    <button
                                                        onClick={() => openServiceModal('groceries', `Order: ${product.name}`)}
                                                        disabled={product.stock === 0}
                                                        className={`flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${product.stock === 0 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-orange-50 text-orange-700 hover:bg-orange-600 hover:text-white hover:shadow-md hover:shadow-orange-200'}`}
                                                    >
                                                        <ShoppingCart size={13} />
                                                        {product.stock === 0 ? 'Sold Out' : 'Order'}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                    </div>
                )}
            </div>

            {/* ── PRODUCT DETAIL MODAL ─────────────────────────────────────── */}
            <AnimatePresence>
                {selectedProduct && (() => {
                    const p = selectedProduct;
                    const disc = parseFloat(p.discount_percent);
                    return (
                        <motion.div
                            key="product-modal-backdrop"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedProduct(null)}
                            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                        >
                            <motion.div
                                key="product-modal"
                                initial={{ opacity: 0, scale: 0.92, y: 30 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.92, y: 30 }}
                                transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                                onClick={e => e.stopPropagation()}
                                className="bg-white rounded-3xl overflow-hidden w-full max-w-2xl shadow-2xl"
                            >
                                {/* Image Header */}
                                <div className="relative h-64 bg-gray-50">
                                    {p.image_url ? (
                                        <img src={`${api.defaults.baseURL.replace('/api', '')}${p.image_url}`} alt={p.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-8xl">🥗</div>
                                    )}
                                    {/* Overlays */}
                                    {disc > 0 && (
                                        <div className="absolute top-4 left-4 bg-green-500 text-white text-xs font-black px-3 py-1.5 rounded-lg shadow-lg">
                                            {Math.round(disc)}% OFF
                                        </div>
                                    )}
                                    <button
                                        onClick={() => setSelectedProduct(null)}
                                        className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-md hover:bg-white transition-colors"
                                    >
                                        <X size={18} className="text-gray-700" />
                                    </button>
                                </div>

                                {/* Content */}
                                <div className="p-6">
                                    {/* Brand + Category */}
                                    <div className="flex items-center gap-2 mb-3">
                                        {p.brand && <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">{p.brand}</span>}
                                        {p.brand && p.category && <span className="text-gray-300">•</span>}
                                        {p.category && <span className="text-xs text-gray-400 font-medium">{p.category}</span>}
                                    </div>

                                    <h2 className="text-2xl font-bold text-gray-900 mb-4 font-display leading-snug">{p.name}</h2>

                                    {/* Price Row */}
                                    <div className="flex items-center gap-4 mb-4">
                                        <div>
                                            <span className="text-3xl font-black text-orange-600">₹{p.selling_price}</span>
                                            {disc > 0 && (
                                                <span className="ml-2 text-base text-gray-400 line-through font-medium">₹{p.mrp}</span>
                                            )}
                                        </div>
                                        {disc > 0 && (
                                            <span className="px-3 py-1 bg-green-50 text-green-700 text-sm font-bold rounded-full border border-green-100">
                                                Save ₹{(parseFloat(p.mrp) - parseFloat(p.selling_price)).toFixed(0)}
                                            </span>
                                        )}
                                    </div>

                                    {/* Specs Grid */}
                                    <div className="grid grid-cols-3 gap-3 mb-4">
                                        {p.weight && (
                                            <div className="bg-gray-50 rounded-xl p-3 text-center">
                                                <div className="text-[10px] text-gray-400 uppercase font-bold mb-1">Weight</div>
                                                <div className="text-sm font-bold text-gray-800">{p.weight}</div>
                                            </div>
                                        )}
                                        <div className="bg-gray-50 rounded-xl p-3 text-center">
                                            <div className="text-[10px] text-gray-400 uppercase font-bold mb-1">Stock</div>
                                            <div className={`text-sm font-bold ${p.stock === 0 ? 'text-red-500' : p.stock <= 10 ? 'text-orange-500' : 'text-green-600'}`}>
                                                {p.stock === 0 ? 'Out' : p.stock <= 10 ? `${p.stock} left` : 'In Stock'}
                                            </div>
                                        </div>
                                        <div className="bg-gray-50 rounded-xl p-3 text-center">
                                            <div className="text-[10px] text-gray-400 uppercase font-bold mb-1">Quality</div>
                                            <div className="text-sm font-bold text-gray-800">Premium</div>
                                        </div>
                                    </div>

                                    {/* Description */}
                                    {p.description && (
                                        <div className="mb-6">
                                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">About this product</h4>
                                            <p className="text-sm text-gray-600 leading-relaxed">{p.description}</p>
                                        </div>
                                    )}

                                    {/* CTA Row */}
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => { setSelectedProduct(null); openServiceModal('groceries', `Order: ${p.name}`); }}
                                            disabled={p.stock === 0}
                                            className={`flex-1 py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md ${
                                                p.stock === 0
                                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                    : 'bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:shadow-orange-200 hover:shadow-lg hover:-translate-y-0.5'
                                            }`}
                                        >
                                            <ShoppingCart size={16} />
                                            {p.stock === 0 ? 'Out of Stock' : 'Order Now'}
                                        </button>
                                        <button
                                            onClick={() => setSelectedProduct(null)}
                                            className="px-5 py-3.5 rounded-2xl font-bold text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                                        >
                                            Close
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    );
                })()}
            </AnimatePresence>

            {/* Subscription Section */}
            <div className="container-custom pb-20">
                <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl border border-gray-100 flex flex-col md:flex-row gap-12 items-center">
                    <div className="flex-1">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 text-orange-700 font-bold text-xs uppercase tracking-wider mb-6">
                            Monthly Subscription
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 font-display">The Smart-Pantry Plan</h2>
                        <p className="text-gray-600 mb-8 leading-relaxed text-lg">
                            Never run out of essentials. Customize your monthly pantry needs and get them delivered automatically on the first of every month with an exclusive 15% discount.
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                            <div className="flex items-center gap-3 text-gray-700 font-medium">
                                <Package className="text-orange-500" size={20} /> Set Your Essentials
                            </div>
                            <div className="flex items-center gap-3 text-gray-700 font-medium">
                                <Truck className="text-orange-500" size={20} /> Zero Delivery Fees
                            </div>
                            <div className="flex items-center gap-3 text-gray-700 font-medium">
                                <Clock className="text-orange-500" size={20} /> Fixed Delivery Date
                            </div>
                            <div className="flex items-center gap-3 text-gray-700 font-medium">
                                <ArrowRight className="text-orange-500" size={20} /> Flexible Cancellation
                            </div>
                        </div>
                        <button 
                            onClick={() => openServiceModal('groceries', 'Subscription Plan')}
                            className="px-8 py-4 bg-gray-900 text-white rounded-xl font-bold hover:bg-orange-600 transition-colors shadow-lg"
                        >
                            Build Your Pantry
                        </button>
                    </div>
                    <div className="flex-1 w-full h-[400px] rounded-[2rem] overflow-hidden">
                        <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Groceries Subscription" className="w-full h-full object-cover" />
                    </div>
                </div>
            </div>
            
            {/* Stats */}
            <section className="py-16 bg-orange-950 text-white rounded-t-[3rem] mt-auto">
                <div className="container-custom">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-orange-900/50">
                        <div>
                            <div className="text-4xl md:text-5xl font-bold text-orange-400 mb-2 font-display">100%</div>
                            <div className="text-sm md:text-base text-orange-100/60 font-medium">Organic Certified</div>
                        </div>
                        <div>
                            <div className="text-4xl md:text-5xl font-bold text-orange-400 mb-2 font-display">50+</div>
                            <div className="text-sm md:text-base text-orange-100/60 font-medium">Partner Farms</div>
                        </div>
                        <div>
                            <div className="text-4xl md:text-5xl font-bold text-orange-400 mb-2 font-display">5k+</div>
                            <div className="text-sm md:text-base text-orange-100/60 font-medium">Happy Homes</div>
                        </div>
                        <div>
                            <div className="text-4xl md:text-5xl font-bold text-orange-400 mb-2 font-display">24h</div>
                            <div className="text-sm md:text-base text-orange-100/60 font-medium">Farm to Home</div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Groceries;
