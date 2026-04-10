import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Heart, X, Search, Star, Sparkles, ArrowLeft,
    User, Phone, MapPin, BookOpen, Briefcase, Shield,
    ChevronDown, Check, Loader2, Crown, Activity, Calendar
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useUI } from '../../context/UIContext';
import ProfileModal from '../../components/ProfileModal';

// ─── Utility Helpers ──────────────────────────────────────────────────────────

function calcAge(dob) {
    if (!dob) return null;
    const diff = Date.now() - new Date(dob).getTime();
    return Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000));
}

function calcCompatibility(myProfile, otherProfile) {
    if (!myProfile || !otherProfile) return 0;
    let score = 40; 
    const me = myProfile.profileData || {};
    const them = otherProfile.profileData || {};

    if (me.religion && them.religion && me.religion === them.religion) score += 20;

    const myAge = calcAge(me.dob);
    const theirAge = calcAge(them.dob);
    if (myAge && theirAge) {
        const ageDiff = Math.abs(myAge - theirAge);
        if (ageDiff <= 3) score += 25;
        else if (ageDiff <= 7) score += 15;
        else if (ageDiff <= 12) score += 5;
    }

    if (me.maritalStatus === them.maritalStatus) score += 5;
    if (me.gender && them.gender && me.gender !== them.gender) score += 10;

    return Math.min(score, 99);
}

function getInitials(profile) {
    const f = profile?.firstName?.[0] || '';
    const l = profile?.lastName?.[0] || '';
    return (f + l).toUpperCase() || '?';
}

const AGE_RANGES = [
    { label: 'Any Age', min: 0, max: 200 },
    { label: '18 – 25', min: 18, max: 25 },
    { label: '26 – 32', min: 26, max: 32 },
    { label: '33 – 40', min: 33, max: 40 },
    { label: '40+', min: 40, max: 200 },
];

// ─── Premium Profile Card ─────────────────────────────────────────────────────

const MatchCard = ({ profile, myProfile, onViewProfile, index }) => {
    const [liked, setLiked] = useState(false);
    const { showToast } = useUI();
    
    const age = calcAge(profile.profileData?.dob);
    const compat = calcCompatibility(myProfile, profile);
    const isTopMatch = compat >= 75;

    const handleLike = (e) => {
        e.stopPropagation();
        setLiked(!liked);
        if (!liked) showToast(`Interest sent to ${profile.firstName}! 💕`, 'success');
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05, ease: 'easeOut' }}
            onClick={() => onViewProfile(profile)}
            className="group relative h-[380px] rounded-3xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-white"
        >
            {/* Background Image / Gradient */}
            {profile.profilePhoto ? (
                <img
                    src={`http://localhost:5000${profile.profilePhoto}`}
                    alt={profile.firstName}
                    className="absolute inset-0 w-full h-[80%] object-cover transition-transform duration-700 group-hover:scale-105"
                />
            ) : (
                <div className="absolute inset-0 h-[80%] bg-gradient-to-br from-rose-100 via-pink-100 to-rose-200 flex items-center justify-center transition-transform duration-700 group-hover:scale-105">
                    <div className="w-24 h-24 rounded-full bg-white/60 backdrop-blur-sm flex items-center justify-center text-rose-500 font-bold text-4xl font-display shadow-md">
                        {getInitials(profile)}
                    </div>
                </div>
            )}

            {/* Gradient Overlay for Top Image */}
            <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-gray-900/40 to-transparent z-10" />

            {/* Top Badges */}
            <div className="absolute top-3 w-full px-3 z-20 flex justify-between items-start">
                {isTopMatch ? (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md shadow-sm text-pink-600 text-[10px] font-bold uppercase tracking-widest border border-white">
                        <Sparkles size={10} />
                        Top Match
                    </div>
                ) : <div />}
                
                <div className="w-9 h-9 flex flex-col items-center justify-center bg-white/90 backdrop-blur-md rounded-full border border-white shadow-sm text-rose-600 font-bold leading-tight">
                    <span className="text-[11px]">{compat}%</span>
                </div>
            </div>

            {/* Bottom Info Card */}
            <div className="absolute bottom-0 inset-x-0 h-[45%] bg-white rounded-t-3xl pt-2 pb-4 px-5 z-20 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] flex flex-col justify-between transition-all duration-300 group-hover:h-[50%]">
                <div>
                    <h3 className="text-xl font-bold text-gray-900 font-display flex items-center gap-2">
                        {profile.firstName} {profile.lastName?.charAt(0)}.
                        {age && <span className="text-gray-500 font-normal text-lg">{age}</span>}
                        <Shield size={14} className="text-blue-500 fill-blue-100 ml-auto" />
                    </h3>
                    
                    <div className="text-gray-600 text-xs flex items-center gap-2 mt-1 font-medium">
                        <Briefcase size={12} className="text-gray-400" />
                        <span className="truncate">{profile.profileData?.profession || 'Professional'}</span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mt-3">
                        {profile.profileData?.religion && (
                            <span className="px-2 py-0.5 bg-gray-50 border border-gray-100 text-gray-500 rounded text-[10px] uppercase font-bold tracking-wider">
                                {profile.profileData.religion}
                            </span>
                        )}
                        {profile.profileData?.maritalStatus && (
                            <span className="px-2 py-0.5 bg-gray-50 border border-gray-100 text-gray-500 rounded text-[10px] uppercase font-bold tracking-wider">
                                {profile.profileData.maritalStatus}
                            </span>
                        )}
                    </div>
                </div>

                <hr className="border-gray-50 my-2" />

                <div className="flex items-center justify-between">
                    <span className="text-rose-500 text-xs font-bold flex items-center gap-1 group-hover:text-rose-600">
                        View Profile <ArrowLeft size={12} className="rotate-180" />
                    </span>
                    <button
                        onClick={handleLike}
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                            liked 
                            ? 'bg-rose-500 text-white shadow-md shadow-rose-200' 
                            : 'bg-gray-50 text-gray-400 hover:bg-rose-50 border border-gray-200 hover:text-rose-500 hover:border-rose-200'
                        }`}
                    >
                        <Heart size={14} fill={liked ? 'currentColor' : 'none'} />
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

// ─── Profile Detail Modal (No changes to inside component structure) ───────────

const ProfileDetailModal = ({ profile, myProfile, onClose }) => {
    const { showToast } = useUI();
    const [interestSent, setInterestSent] = useState(false);
    
    if (!profile) return null;

    const age = calcAge(profile.profileData?.dob);
    const compat = calcCompatibility(myProfile, profile);

    const handleSendInterest = () => {
        setInterestSent(true);
        showToast(`Your interest has been safely delivered to ${profile.firstName}! 💌`, 'success');
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 sm:p-6">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col"
                >
                    {/* Header Image Area */}
                    <div className="relative h-64 shrink-0 bg-gray-100">
                        {profile.profilePhoto ? (
                            <img
                                src={`http://localhost:5000${profile.profilePhoto}`}
                                alt={profile.firstName}
                                className="w-full h-full object-cover object-top"
                            />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-rose-200 to-pink-300 flex items-center justify-center">
                                <div className="w-32 h-32 rounded-full bg-white/30 flex items-center justify-center text-white font-bold text-5xl font-display shadow-xl">
                                    {getInitials(profile)}
                                </div>
                            </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/20 to-transparent" />
                        
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 w-10 h-10 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-colors"
                        >
                            <X size={20} />
                        </button>

                        <div className="absolute bottom-6 left-8 right-8 flex justify-between items-end">
                            <div className="text-white">
                                <h2 className="text-4xl font-bold font-display flex items-end gap-2">
                                    {profile.firstName} {profile.lastName}
                                    {age && <span className="text-2xl text-white/80 font-normal mb-0.5">{age}</span>}
                                </h2>
                                <p className="flex items-center gap-2 mt-2 text-white/90">
                                    <Shield size={14} className="text-blue-400 fill-blue-400" /> Verified Profile
                                    <span className="w-1.5 h-1.5 rounded-full bg-white/50" />
                                    ID: {profile.id.split('-')[0].toUpperCase()}
                                </p>
                            </div>
                            
                            {/* Big Action Button Overlay */}
                            <button
                                onClick={handleSendInterest}
                                disabled={interestSent}
                                className={`hidden md:flex items-center gap-2 px-6 py-3 rounded-full font-bold shadow-xl transition-all ${
                                    interestSent 
                                    ? 'bg-green-500 text-white' 
                                    : 'bg-rose-500 hover:bg-rose-600 text-white hover:scale-105'
                                }`}
                            >
                                {interestSent ? <Check size={18} /> : <Heart size={18} fill="currentColor" />}
                                {interestSent ? 'Interest Sent' : 'Connect'}
                            </button>
                        </div>
                    </div>

                    {/* Scrollable Details */}
                    <div className="flex-1 overflow-y-auto p-6 sm:p-8 custom-scrollbar bg-gray-50">
                        {/* Mobile Connect Button */}
                        <div className="md:hidden mb-6">
                            <button
                                onClick={handleSendInterest}
                                disabled={interestSent}
                                className={`w-full flex justify-center items-center gap-2 px-6 py-4 rounded-xl font-bold shadow-lg transition-all ${
                                    interestSent 
                                    ? 'bg-green-500 text-white' 
                                    : 'bg-gradient-to-r from-rose-500 to-pink-600 text-white'
                                }`}
                            >
                                {interestSent ? <Check size={18} /> : <Heart size={18} strokeWidth={2.5} />}
                                {interestSent ? 'Interest Sent' : 'Connect Now'}
                            </button>
                        </div>

                        {/* Compatibility Section */}
                        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
                            <div className="flex items-center gap-4 w-full">
                                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center text-white shrink-0 shadow-lg">
                                    <Activity size={24} />
                                </div>
                                <div className="flex-1 w-full">
                                    <div className="flex justify-between items-center mb-1">
                                        <h3 className="font-bold text-gray-900">Match Compatibility</h3>
                                        <span className="text-xl font-bold text-rose-600 font-display">{compat}%</span>
                                    </div>
                                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${compat}%` }}
                                            transition={{ duration: 1, ease: "easeOut" }}
                                            className={`h-full rounded-full bg-gradient-to-r ${
                                                compat >= 75 ? 'from-green-400 to-emerald-500' : 'from-rose-400 to-pink-500'
                                            }`}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Details Grid */}
                        <h3 className="font-bold text-gray-900 text-lg mb-4 ml-1">Personal Details</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                            {[
                                { label: 'Religion / Community', value: profile.profileData?.religion, sub: profile.profileData?.caste, icon: Star },
                                { label: 'Education', value: profile.profileData?.education, icon: BookOpen },
                                { label: 'Profession', value: profile.profileData?.profession, icon: Briefcase },
                                { label: 'Marital Status', value: profile.profileData?.maritalStatus, icon: Users },
                                { label: 'Date of Birth', value: profile.profileData?.dob ? new Date(profile.profileData.dob).toLocaleDateString() : 'N/A', icon: Calendar },
                                { label: 'Profile Created For', value: profile.profileData?.profileFor, icon: User },
                            ].map((item, idx) => (
                                <div key={idx} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-start gap-4 hover:shadow-md hover:border-rose-100 transition-all">
                                    <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center shrink-0">
                                        <item.icon size={18} className="text-rose-500" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">{item.label}</p>
                                        <p className="text-sm font-semibold text-gray-900 my-0.5 leading-tight">{item.value || 'Not specified'}</p>
                                        {item.sub && <p className="text-xs text-gray-500">{item.sub}</p>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

// ─── Sidebar Filter Component ──────────────────────────────────────────────────

const FilterSidebar = ({ filters, setFilters, stats }) => {
    return (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sticky top-24">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest flex items-center gap-2 mb-6">
                <Search size={16} className="text-rose-500" /> Refine Search
            </h3>
            
            <div className="space-y-5">
                <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Looking For</label>
                    <select
                        value={filters.gender}
                        onChange={e => setFilters({ ...filters, gender: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-xl px-4 py-3 outline-none focus:ring-1 focus:ring-rose-300 font-semibold cursor-pointer"
                    >
                        <option value="">Any Gender</option>
                        <option value="Male">Match For Groom</option>
                        <option value="Female">Match For Bride</option>
                    </select>
                </div>

                <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Age Range</label>
                    <div className="grid grid-cols-2 gap-2">
                        {AGE_RANGES.map(r => (
                            <button
                                key={r.label}
                                onClick={() => setFilters({ ...filters, ageRange: r.label })}
                                className={`py-2 px-1 text-xs font-bold rounded-lg border transition-all ${
                                    filters.ageRange === r.label 
                                    ? 'bg-rose-50 border-rose-200 text-rose-600' 
                                    : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
                                }`}
                            >
                                {r.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Religion</label>
                    <select
                        value={filters.religion}
                        onChange={e => setFilters({ ...filters, religion: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-xl px-4 py-3 outline-none focus:ring-1 focus:ring-rose-300 font-semibold cursor-pointer"
                    >
                        <option value="">Any Religion</option>
                        <option>Hindu</option>
                        <option>Muslim</option>
                        <option>Christian</option>
                        <option>Other</option>
                    </select>
                </div>

                <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Marital Status</label>
                    <select
                        value={filters.maritalStatus}
                        onChange={e => setFilters({ ...filters, maritalStatus: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-xl px-4 py-3 outline-none focus:ring-1 focus:ring-rose-300 font-semibold cursor-pointer"
                    >
                        <option value="">Any Status</option>
                        <option>Never Married</option>
                        <option>Divorced</option>
                        <option>Widowed</option>
                    </select>
                </div>
            </div>

            <hr className="my-6 border-gray-100" />
            
            <div className="bg-rose-50 rounded-xl p-4 flex items-center justify-between">
                <div>
                    <div className="text-[10px] uppercase tracking-widest font-bold text-rose-400">Total</div>
                    <div className="text-rose-600 font-bold text-lg leading-tight">{stats.filtered} Profiles</div>
                </div>
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-rose-500 shadow-sm">
                    <Sparkles size={16} />
                </div>
            </div>
            
            <button
                onClick={() => setFilters({ gender: '', ageRange: 'Any Age', religion: '', maritalStatus: '' })}
                className="w-full mt-4 py-3 text-xs font-bold text-gray-500 hover:text-gray-800 transition-colors uppercase tracking-wider"
            >
                Clear Filters
            </button>
        </div>
    );
};

// ─── Main Page Component ──────────────────────────────────────────────────────

const MatchDiscovery = () => {
    const navigate = useNavigate();
    const { matrimonyProfile, showToast, openProfile } = useUI();

    const [profiles, setProfiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedProfile, setSelectedProfile] = useState(null);
    const [filters, setFilters] = useState({
        gender: '',
        ageRange: 'Any Age',
        religion: '',
        maritalStatus: '',
    });

    useEffect(() => {
        if (!matrimonyProfile) {
            navigate('/services/marriage');
            return;
        }
        if (matrimonyProfile.paymentStatus !== 'paid') {
            showToast('Please complete your profile activation first.', 'error');
            navigate('/services/marriage');
        }
    }, [matrimonyProfile, navigate, showToast]);

    useEffect(() => {
        const fetchProfiles = async () => {
            setLoading(true);
            try {
                const res = await fetch('http://localhost:5000/api/matrimony/profiles');
                const data = await res.json();
                if (data.success) {
                    const others = data.data.profiles.filter(p => p.id !== matrimonyProfile?.id);
                    setProfiles(others);
                }
            } catch (err) {
                showToast('Could not load profiles. Please try again.', 'error');
            } finally {
                setLoading(false);
            }
        };
        if (matrimonyProfile) fetchProfiles();
    }, [matrimonyProfile, showToast]);

    const filteredProfiles = useMemo(() => {
        return profiles.filter(p => {
            const age = calcAge(p.profileData?.dob) || 0;
            const ageRangeObj = AGE_RANGES.find(r => r.label === filters.ageRange) || AGE_RANGES[0];
            
            if (filters.gender && p.profileData?.gender !== filters.gender) return false;
            if (age && (age < ageRangeObj.min || age > ageRangeObj.max)) return false;
            if (filters.religion && p.profileData?.religion !== filters.religion) return false;
            if (filters.maritalStatus && p.profileData?.maritalStatus !== filters.maritalStatus) return false;
            return true;
        });
    }, [profiles, filters]);

    const sortedProfiles = useMemo(() => {
        return [...filteredProfiles].sort(
            (a, b) => calcCompatibility(matrimonyProfile, b) - calcCompatibility(matrimonyProfile, a)
        );
    }, [filteredProfiles, matrimonyProfile]);

    const topMatches = sortedProfiles.filter(p => calcCompatibility(matrimonyProfile, p) >= 75);
    const standardMatches = sortedProfiles.filter(p => calcCompatibility(matrimonyProfile, p) < 75);

    return (
        <div className="min-h-screen bg-[#f8f9fc] pt-24 pb-20">
            <div className="container-custom px-4 sm:px-6">

                {/* Navbar / Breadcrumbs Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 bg-white p-5 rounded-3xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4">
                        <Link 
                            to="/services/marriage" 
                            className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-all border border-gray-200"
                            title="Back to Matrimony"
                        >
                            <ArrowLeft size={18} />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold font-display text-gray-900 leading-tight">Your Matches</h1>
                            <p className="text-xs text-gray-500 font-medium">Find your perfect connection based on your preferences</p>
                        </div>
                    </div>
                    
                    <button 
                        onClick={openProfile}
                        className="flex items-center gap-3 px-4 py-2 rounded-full border border-gray-200 bg-white hover:bg-gray-50 transition-colors group cursor-pointer"
                    >
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none mb-1">Logged In</span>
                            <span className="text-sm font-bold text-gray-800 leading-none group-hover:text-rose-500 transition-colors">
                                {matrimonyProfile?.firstName} {matrimonyProfile?.lastName}
                            </span>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center border border-rose-200 overflow-hidden">
                            {matrimonyProfile?.profilePhoto ? (
                                <img src={`http://localhost:5000${matrimonyProfile.profilePhoto}`} alt="You" className="w-full h-full object-cover" />
                            ) : (
                                <User size={16} className="text-rose-500" />
                            )}
                        </div>
                    </button>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    
                    {/* Left Sidebar Filters */}
                    <div className="w-full lg:w-[280px] shrink-0">
                        <FilterSidebar 
                            filters={filters} 
                            setFilters={setFilters} 
                            stats={{ total: profiles.length, filtered: sortedProfiles.length }} 
                        />
                    </div>

                    {/* Right Main Content */}
                    <div className="flex-1 min-w-0">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-32 bg-white rounded-3xl border border-gray-100 shadow-sm h-[600px]">
                                <div className="relative">
                                    <div className="w-20 h-20 rounded-full border-4 border-gray-100 border-t-rose-500 animate-[spin_1.5s_linear_infinite]" />
                                    <Heart className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-rose-500 animate-pulse" fill="currentColor" size={24} />
                                </div>
                                <p className="text-gray-400 font-bold tracking-widest uppercase text-xs mt-6">Analyzing Compatibility...</p>
                            </div>
                        ) : (
                            <AnimatePresence mode="wait">
                                {sortedProfiles.length === 0 ? (
                                    <motion.div 
                                        initial={{ opacity: 0, scale: 0.98 }} 
                                        animate={{ opacity: 1, scale: 1 }} 
                                        exit={{ opacity: 0 }}
                                        className="text-center py-24 bg-white rounded-3xl shadow-sm border border-gray-100 h-[600px] flex flex-col items-center justify-center"
                                    >
                                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-gray-100">
                                            <Search size={28} className="text-gray-300" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-900 mb-2 font-display">No Matches Found</h3>
                                        <p className="text-gray-500 mb-8 max-w-sm mx-auto text-sm">We couldn't find any active profiles matching your current filters. Broaden your criteria to see more people.</p>
                                        <button
                                            onClick={() => setFilters({ gender: '', ageRange: 'Any Age', religion: '', maritalStatus: '' })}
                                            className="px-6 py-2.5 rounded-full bg-rose-50 text-rose-600 font-bold hover:bg-rose-100 hover:text-rose-700 transition-colors text-sm"
                                        >
                                            Clear All Filters
                                        </button>
                                    </motion.div>
                                ) : (
                                    <motion.div 
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="space-y-12"
                                    >
                                        {/* Top Matches Section */}
                                        {topMatches.length > 0 && (
                                            <section>
                                                <div className="flex items-center gap-3 mb-6 px-1">
                                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center shadow-sm">
                                                        <Sparkles size={14} className="text-white" />
                                                    </div>
                                                    <h2 className="text-xl font-bold text-gray-900 font-display">Premium Matches</h2>
                                                    <span className="bg-rose-100 text-rose-600 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-widest font-bold ml-2">Recommended</span>
                                                </div>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                                    {topMatches.map((profile, idx) => (
                                                        <MatchCard key={profile.id} profile={profile} myProfile={matrimonyProfile} onViewProfile={setSelectedProfile} index={idx} />
                                                    ))}
                                                </div>
                                            </section>
                                        )}

                                        {/* Other Matches Section */}
                                        {standardMatches.length > 0 && (
                                            <section>
                                                <div className="flex items-center gap-3 mb-6 px-1 mt-10">
                                                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                                                        <Users size={14} />
                                                    </div>
                                                    <h2 className="text-xl font-bold text-gray-900 font-display">Discover More</h2>
                                                    <span className="text-gray-400 text-sm ml-2 font-medium">{standardMatches.length} profiles</span>
                                                </div>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                                    {standardMatches.map((profile, idx) => (
                                                        <MatchCard key={profile.id} profile={profile} myProfile={matrimonyProfile} onViewProfile={setSelectedProfile} index={idx + topMatches.length} />
                                                    ))}
                                                </div>
                                            </section>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        )}
                    </div>
                </div>
            </div>

            {/* Modals */}
            <ProfileDetailModal profile={selectedProfile} myProfile={matrimonyProfile} onClose={() => setSelectedProfile(null)} />
            <ProfileModal />
        </div>
    );
};

export default MatchDiscovery;
