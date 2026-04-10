import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Building, MapPin, Hammer, CheckCircle, ArrowRight, Sparkles, 
    Home, Landmark, Users, Plus, Search, Filter, Camera, 
    X, Tag, Phone, IndianRupee, Clock, User, AlertTriangle
} from 'lucide-react';
import { useUI } from '../../context/UIContext';

const RealEstate = () => {
    const { openServiceModal, openLogin, user } = useUI();
    const [activeTab, setActiveTab] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [deleteConfirmId, setDeleteConfirmId] = useState(null);
    
    // Initial static data
    const initialListings = [
        { 
            id: 1, 
            title: "Luxury Villas", 
            price: "1.5 Cr", 
            location: "Cyberabad, HYD", 
            beds: 4, 
            category: "property",
            type: "Villa", 
            img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            description: "Spacious 4BHK villa with modern amenities and private pool.",
            seller: "Kanishka Associates",
            date: new Date().toLocaleDateString()
        },
        { 
            id: 2, 
            title: "Premium Plots", 
            price: "45 L", 
            location: "Kollur, HYD", 
            beds: '-', 
            category: "property",
            type: "Open Plot", 
            img: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            description: "Clear title residential plots in a fast-developing area.",
            seller: "Balaji Developers",
            date: new Date().toLocaleDateString()
        },
        { 
            id: 3, 
            title: "Modern Apartments", 
            price: "85 L", 
            location: "Gachibowli, HYD", 
            beds: 3, 
            category: "property",
            type: "Apartment", 
            img: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            description: "Gated community apartment with gym and park facilities.",
            seller: "Skyline Ventures",
            date: new Date().toLocaleDateString()
        },
        {
            id: 4,
            title: "Structural Design Service",
            price: "₹15,000",
            location: "Hyderabad",
            category: "construction",
            type: "Service",
            img: "https://images.unsplash.com/photo-1503387762-592dea58ef23?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            description: "Expert structural designs for residential and commercial buildings.",
            seller: "Tech Builders",
            date: new Date().toLocaleDateString()
        }
    ];

    const [listings, setListings] = useState([]);

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/real-estate');
                const data = await res.json();
                if (data.success && data.data) {
                    setListings([...data.data, ...initialListings]);
                } else {
                    setListings(initialListings);
                }
            } catch (error) {
                console.error("Error fetching listings:", error);
                setListings(initialListings);
            }
        };
        fetchProperties();
    }, []);

    const [newAd, setNewAd] = useState({
        title: '',
        price: '',
        location: '',
        category: 'property',
        type: 'Apartment',
        description: '',
        beds: '',
        seller: '',
        contact: '',
        img: '',
        size: '',
        document: ''
    });

    const categories = [
        { id: 'all', label: 'All Listings', icon: Landmark },
        { id: 'property', label: 'Properties', icon: Building },
        { id: 'construction', label: 'Construction', icon: Hammer }
    ];

    const filteredListings = listings.filter(item => {
        const matchesCategory = activeTab === 'all' || item.category === activeTab;
        const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             item.location.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewAd({ ...newAd, img: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewAd({ ...newAd, document: reader.result, documentName: file.name });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAddListing = async (e) => {
        e.preventDefault();
        const ad = {
            ...newAd,
            id: Date.now().toString(),
            sellerId: user?.id,
            date: new Date().toLocaleDateString(),
            img: newAd.img || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        };
        try {
            await fetch('http://localhost:5000/api/real-estate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(ad)
            });
            setListings([ad, ...listings]);
            setIsFormOpen(false);
            setNewAd({ title: '', price: '', location: '', category: 'property', type: 'Apartment', description: '', beds: '', seller: '', contact: '', img: '', size: '', document: '' });
        } catch (error) {
            console.error("Failed to add listing:", error);
        }
    };

    const confirmDelete = (id) => {
        setDeleteConfirmId(id);
    };

    const executeDelete = async () => {
        const id = deleteConfirmId;
        if (!id) return;
        try {
            if (typeof id === 'string') {
                await fetch(`http://localhost:5000/api/real-estate/${id}`, { method: 'DELETE' });
            }
            setListings(listings.filter(l => l.id !== id));
        } catch (error) {
            console.error("Failed to delete listing:", error);
        } finally {
            setDeleteConfirmId(null);
        }
    };

    return (
        <div className="pt-3 min-h-screen bg-slate-50/50">
            {/* Hero Section */}
            <section className="relative rounded-[2.5rem] margin-x-custom mx-4 md:mx-6 mb-8 overflow-hidden min-h-[400px] flex items-center shadow-2xl shadow-emerald-100/50">
                <div className="absolute inset-0">
                    <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" alt="Real Estate" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/90 via-emerald-900/40 to-transparent"></div>
                </div>

                <div className="container-custom relative z-10 px-8 md:px-12 py-12">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-3xl"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-400/20 backdrop-blur-md border border-emerald-400/30 text-emerald-200 text-xs font-bold uppercase tracking-wider mb-6">
                            <Sparkles size={14} className="animate-pulse" />
                            Community Marketplace
                        </div>

                        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white font-display leading-tight">
                            The Easiest Way to <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">Buy, Sell & Build</span>
                        </h1>
                        <p className="text-lg text-emerald-100/80 max-w-xl mb-10 leading-relaxed font-sans">
                            Join our community marketplace. List your property for sale or find expert construction services in minutes.
                        </p>
                        
                        <div className="flex flex-wrap gap-4">
                            <button
                                onClick={() => user ? setIsFormOpen(true) : openLogin()}
                                className="px-8 py-4 rounded-2xl bg-white text-emerald-900 font-bold shadow-xl hover:bg-emerald-50 transition-all flex items-center gap-2"
                            >
                                <Plus size={20} />
                                Post Free Ad
                            </button>
                            {user ? (
                                <button
                                    className="px-8 py-4 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 text-white font-bold shadow-xl flex items-center gap-2"
                                >
                                    <div className="w-6 h-6 rounded-full bg-emerald-400 flex items-center justify-center text-emerald-900 text-[10px]">
                                        {user.name.charAt(0)}
                                    </div>
                                    {user.name} (Logged In)
                                </button>
                            ) : (
                                <button
                                    onClick={openLogin}
                                    className="px-8 py-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold shadow-xl hover:bg-white/20 transition-all flex items-center gap-2"
                                >
                                    <User size={20} />
                                    Login
                                </button>
                            )}
                            <div className="relative flex-1 min-w-[300px]">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-300/70" size={20} />
                                <input 
                                    type="text" 
                                    placeholder="Search properties, locations..." 
                                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder:text-emerald-100/50 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 transition-all"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Main Content Areas */}
            <div className="container-custom pb-20">
                {/* Categories & Filter Bar */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
                    <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-slate-200 w-full md:w-auto">
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setActiveTab(cat.id)}
                                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all flex-1 md:flex-none ${activeTab === cat.id ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' : 'text-slate-600 hover:bg-slate-50'}`}
                            >
                                <cat.icon size={18} />
                                {cat.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Listings Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <AnimatePresence mode='popLayout'>
                        {filteredListings.map((prop) => (
                            <motion.div 
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                key={prop.id} 
                                className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 group border border-slate-100"
                            >
                                <div className="h-64 relative overflow-hidden">
                                    <img src={prop.img} alt={prop.title} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
                                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full text-xs font-bold text-emerald-700 shadow-sm border border-emerald-100">
                                        {prop.type}
                                    </div>
                                    <div className="absolute top-4 right-4 flex gap-2">
                                        <div className="bg-emerald-600/90 backdrop-blur px-3 py-1.5 rounded-full text-[10px] font-bold text-white uppercase tracking-wider">
                                            {prop.category}
                                        </div>
                                        {user && prop.sellerId === user.id && (
                                            <button 
                                                onClick={() => confirmDelete(prop.id)}
                                                className="p-1.5 bg-red-500/80 backdrop-blur rounded-full text-white hover:bg-red-600 transition-colors shadow-sm"
                                                title="Delete Listing"
                                            >
                                                <X size={14} />
                                            </button>
                                        )}
                                    </div>
                                    <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                                        <div className="px-3 py-1 rounded-lg bg-black/40 backdrop-blur text-white text-xs flex items-center gap-1">
                                            <Clock size={12} /> {prop.date}
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-xl font-bold text-slate-900 font-display group-hover:text-emerald-700 transition-colors">{prop.title}</h3>
                                        <span className="text-lg font-bold text-emerald-600 flex items-center">
                                            <IndianRupee size={16} /> {prop.price}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-500 text-sm mb-4">
                                        <MapPin size={16} className="text-emerald-500" /> {prop.location}
                                    </div>
                                    <p className="text-slate-600 text-sm mb-6 line-clamp-2 leading-relaxed">
                                        {prop.description}
                                    </p>
                                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                                                <Users size={16} />
                                            </div>
                                            <span className="text-xs font-semibold text-slate-700">{prop.seller}</span>
                                        </div>
                                        <button 
                                            onClick={() => openServiceModal('real-estate', `Interested in: ${prop.title}`)}
                                            className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-emerald-600 transition-all shadow-md shadow-slate-200"
                                        >
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {filteredListings.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-[2.5rem] border-2 border-dashed border-slate-200">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                            <Search size={40} />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-2">No listings found</h3>
                        <p className="text-slate-500">Try adjusting your filters or search terms.</p>
                    </div>
                )}
            </div>

            {/* Floating Action Button for Mobile */}
            <button 
                onClick={() => user ? setIsFormOpen(true) : openLogin()}
                className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-emerald-600 text-white rounded-full shadow-2xl flex items-center justify-center z-40 hover:scale-110 transition-transform active:scale-95"
            >
                <Plus size={28} />
            </button>

            {/* Post Ad Modal */}
            <AnimatePresence>
                {isFormOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsFormOpen(false)}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
                        >
                            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-emerald-50/50">
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-900 font-display">Post New Advertisement</h2>
                                    <p className="text-sm text-slate-500">Reach thousands of potential buyers instantly</p>
                                </div>
                                <button onClick={() => setIsFormOpen(false)} className="p-2 hover:bg-white rounded-full transition-colors text-slate-400 hover:text-slate-900">
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="p-8 overflow-y-auto">
                                <form onSubmit={handleAddListing} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-700 ml-1">Title of Ad</label>
                                            <input 
                                                required
                                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none transition-all bg-slate-50"
                                                placeholder="e.g. 3BHK Apartment in Madhapur"
                                                value={newAd.title}
                                                onChange={(e) => setNewAd({...newAd, title: e.target.value})}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-700 ml-1">Price (with unit)</label>
                                            <input 
                                                required
                                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none transition-all bg-slate-50"
                                                placeholder="e.g. 85 L or 1.2 Cr"
                                                value={newAd.price}
                                                onChange={(e) => setNewAd({...newAd, price: e.target.value})}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-700 ml-1">Listing Type</label>
                                            <select 
                                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none transition-all bg-slate-50"
                                                value={newAd.category}
                                                onChange={(e) => setNewAd({...newAd, category: e.target.value})}
                                            >
                                                <option value="property">Property (Sell/Rent)</option>
                                                <option value="construction">Construction Service</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-700 ml-1">Property/Service Type</label>
                                            <input 
                                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none transition-all bg-slate-50"
                                                placeholder="e.g. Villa, Flat, Plumbing"
                                                value={newAd.type}
                                                onChange={(e) => setNewAd({...newAd, type: e.target.value})}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-700 ml-1">Size (sq ft / acres)</label>
                                            <input 
                                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none transition-all bg-slate-50"
                                                placeholder="e.g. 1500 sq ft or 2 Acres"
                                                value={newAd.size}
                                                onChange={(e) => setNewAd({...newAd, size: e.target.value})}
                                            />
                                        </div>
                                        <div className="space-y-2 md:col-span-2">
                                            <label className="text-sm font-bold text-slate-700 ml-1">Location</label>
                                            <div className="relative">
                                                <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                                <input 
                                                    required
                                                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none transition-all bg-slate-50"
                                                    placeholder="Enter city or area"
                                                    value={newAd.location}
                                                    onChange={(e) => setNewAd({...newAd, location: e.target.value})}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2 md:col-span-2">
                                            <label className="text-sm font-bold text-slate-700 ml-1">Upload Image (Optional)</label>
                                            <div className="relative">
                                                <input 
                                                    type="file"
                                                    accept="image/*"
                                                    id="image-upload"
                                                    className="hidden"
                                                    onChange={handleImageChange}
                                                />
                                                <label 
                                                    htmlFor="image-upload"
                                                    className="w-full flex flex-col items-center justify-center gap-3 px-4 py-8 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-200 cursor-pointer transition-all group"
                                                >
                                                    {newAd.img ? (
                                                        <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-md">
                                                            <img src={newAd.img} alt="Preview" className="w-full h-full object-cover" />
                                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                                <span className="text-white font-bold text-sm">Change Image</span>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-slate-400 group-hover:text-emerald-500 shadow-sm transition-colors">
                                                                <Camera size={24} />
                                                            </div>
                                                            <div className="text-center">
                                                                <p className="text-sm font-bold text-slate-900">Click to upload image</p>
                                                                <p className="text-xs text-slate-500 mt-1">Directly select a photo from your device</p>
                                                            </div>
                                                        </>
                                                    )}
                                                </label>
                                            </div>
                                        </div>
                                        <div className="space-y-2 md:col-span-2">
                                            <label className="text-sm font-bold text-slate-700 ml-1">Documents (Optional)</label>
                                            <div className="relative">
                                                <input 
                                                    type="file"
                                                    id="doc-upload"
                                                    className="hidden"
                                                    onChange={handleFileChange}
                                                />
                                                <label 
                                                    htmlFor="doc-upload"
                                                    className="w-full flex items-center gap-4 px-6 py-4 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-200 cursor-pointer transition-all"
                                                >
                                                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-slate-400">
                                                        <Plus size={20} />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-900">
                                                            {newAd.documentName || "Upload property documents (PDF, Doc...)"}
                                                        </p>
                                                        <p className="text-xs text-slate-500">Legal papers, floor plans, etc.</p>
                                                    </div>
                                                </label>
                                            </div>
                                        </div>

                                        <div className="space-y-2 md:col-span-2">
                                            <label className="text-sm font-bold text-slate-700 ml-1">Description</label>
                                            <textarea 
                                                rows="3"
                                                required
                                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none transition-all bg-slate-50"
                                                placeholder="Describe your property or service in detail..."
                                                value={newAd.description}
                                                onChange={(e) => setNewAd({...newAd, description: e.target.value})}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-700 ml-1">Owner Name</label>
                                            <input 
                                                required
                                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none transition-all bg-slate-50"
                                                placeholder="Your name"
                                                value={newAd.seller}
                                                onChange={(e) => setNewAd({...newAd, seller: e.target.value})}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-700 ml-1">Contact Number</label>
                                            <div className="relative">
                                                <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                                <input 
                                                    required
                                                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none transition-all bg-slate-50"
                                                    placeholder="Mobile number"
                                                    value={newAd.contact}
                                                    onChange={(e) => setNewAd({...newAd, contact: e.target.value})}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-slate-100 flex gap-4">
                                        <button 
                                            type="button"
                                            onClick={() => setIsFormOpen(false)}
                                            className="flex-1 py-4 border border-slate-200 text-slate-600 rounded-2xl font-bold hover:bg-slate-50 transition-all"
                                        >
                                            Cancel
                                        </button>
                                        <button 
                                            type="submit"
                                            className="flex-[2] py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 flex items-center justify-center gap-2"
                                        >
                                            <Tag size={20} />
                                            Submit Advertisement
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {deleteConfirmId && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setDeleteConfirmId(null)}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden p-8 text-center"
                        >
                            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <AlertTriangle size={32} className="text-red-500" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-2 font-display">Delete Listing?</h3>
                            <p className="text-slate-500 mb-8">Are you sure you want to permanently delete this property listing? This action cannot be undone.</p>
                            
                            <div className="flex gap-4">
                                <button 
                                    onClick={() => setDeleteConfirmId(null)}
                                    className="flex-1 py-3.5 border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-all"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={executeDelete}
                                    className="flex-1 py-3.5 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-all shadow-lg shadow-red-200"
                                >
                                    Delete
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default RealEstate;
