import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Shield, Users, Search, Sparkles, ChevronDown, CheckCircle, Star, User, ArrowRight, ArrowDown } from 'lucide-react';
import { useUI } from '../../context/UIContext';
import { useNavigate } from 'react-router-dom';
import ProfileModal from '../../components/ProfileModal';

const MarriageServices = () => {
    const { openServiceModal, showToast, matrimonyProfile, openProfile } = useUI();
    const navigate = useNavigate();

    const handleAction = (title = 'Matchmaking Service') => {
        if (!matrimonyProfile) {
            // Force registration if they don't have a profile yet
            showToast('Please create or login to your Matrimony Profile first.', 'error');
            openServiceModal('marriage', 'Matrimony Login / Register');
        } else if (matrimonyProfile.paymentStatus !== 'paid') {
            showToast('Please complete your lifetime registration fee.', 'error');
            openServiceModal('marriage', 'Activate Matrimony Profile');
        } else {
            // Processing silently allowing the user to interact with the page contents
            // showToast('Processing your request...', 'success');
        }
    };

    const handleRegisterHeroClick = () => {
        if (!matrimonyProfile) {
            openServiceModal('marriage', 'Matrimony Login / Register');
        } else if (matrimonyProfile.paymentStatus !== 'paid') {
            showToast('Your profile is pending activation. Please pay the fee.', 'error');
            openServiceModal('marriage', 'Activate Matrimony Profile');
        } else {
            showToast('You are already registered! Your profile is active.', 'success');
        }
    };

    const handleLoginClick = () => {
        openServiceModal('marriage', 'Matrimony Login', true);
    };

    return (
        <div className="min-h-screen relative">

            {/* Hero */}
            <section className="relative rounded-[2.5rem] margin-x-custom mx-4 md:mx-6 mb-16 overflow-hidden min-h-[600px] flex items-center shadow-2xl shadow-rose-100/50">
                <div className="absolute inset-0">
                    <img src="/images/marriage/hero-couple.png" alt="Happy Couple" className="w-full h-full object-cover object-top" />
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-rose-900/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none mix-blend-multiply"></div>

                <div className="container-custom relative z-10 px-8 md:px-12 py-12">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-5xl p-8 md:p-12 rounded-[2.5rem] bg-white/5 backdrop-blur-sm border border-white/10 shadow-xl relative overflow-hidden group"
                    >
                        {/* Mirror Reflection */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-white/5 to-transparent opacity-30 pointer-events-none"></div>

                        <div className="relative z-10">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-md border border-white/50 text-rose-800 text-xs font-bold uppercase tracking-wider mb-8 shadow-sm">
                                <Heart size={14} className="text-rose-600 fill-rose-600" />
                                Trusted Matrimony
                            </div>

                            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-gray-900 font-display leading-tight drop-shadow-sm">
                                Find Your <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-pink-700">Soulmate Today</span>
                            </h1>
                            <p className="text-xl text-gray-800 max-w-2xl mb-8 leading-relaxed font-sans font-medium">
                                We blend traditional values with modern preferences to help you write your perfect love story. Verified profiles, absolute privacy, and personalized matchmaking.
                            </p>



                            {/* Dynamic Hero Buttons */}
                            <div className="flex flex-wrap items-center gap-4 mb-8">
                                {!matrimonyProfile && (
                                    <motion.div 
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.5 }}
                                        onClick={() => {
                                            const section = document.getElementById('registration-section');
                                            if (section) section.scrollIntoView({ behavior: 'smooth' });
                                        }}
                                        className="flex items-center gap-2 text-gray-900 font-bold bg-white/60 px-6 py-3.5 rounded-full backdrop-blur-md shadow-lg border border-white/50 cursor-pointer hover:bg-white hover:shadow-xl transition-all"
                                    >
                                        <span className="text-sm">For registration see downside</span>
                                        <motion.div
                                            animate={{ y: [0, 4, 0] }}
                                            transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                                        >
                                            <ArrowDown size={16} className="text-rose-600" />
                                        </motion.div>
                                    </motion.div>
                                )}

                                {!matrimonyProfile ? (
                                    <motion.button
                                        onClick={handleLoginClick}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="flex items-center gap-2 px-8 py-3.5 rounded-full font-bold text-gray-900 bg-white/90 backdrop-blur-sm shadow-xl border border-white/40 hover:shadow-2xl hover:bg-white transition-all duration-300 group"
                                    >
                                        <div className="w-6 h-6 rounded-full bg-rose-100 flex items-center justify-center">
                                            <User size={14} className="text-rose-600" />
                                        </div>
                                        <span>Member Access</span>
                                        <ArrowRight size={16} className="text-gray-400 group-hover:translate-x-1 transition-transform ml-1" />
                                    </motion.button>
                                ) : (
                                    <>
                                        {matrimonyProfile.paymentStatus === 'paid' ? (
                                            <motion.button
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                onClick={() => navigate('/services/marriage/matches')}
                                                className="flex items-center gap-3 px-8 py-4 rounded-full font-bold text-white bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 shadow-xl shadow-rose-300/50 hover:shadow-2xl hover:shadow-rose-400/60 hover:scale-105 transform transition-all duration-300 text-lg group"
                                            >
                                                <Heart size={20} className="group-hover:animate-bounce" fill="currentColor" />
                                                Let's Find Your Match
                                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                            </motion.button>
                                        ) : (
                                            <motion.button
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                onClick={() => openServiceModal('marriage', 'Activate Matrimony Profile')}
                                                className="flex items-center gap-2 px-8 py-3.5 rounded-full font-bold text-white bg-gray-900 shadow-xl hover:shadow-2xl hover:bg-rose-600 hover:scale-105 transition-all duration-300"
                                            >
                                                <Shield size={18} />
                                                Activate Profile to Match
                                            </motion.button>
                                        )}

                                        {/* Embedded Profile Button */}
                                        <motion.button
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            onClick={openProfile}
                                            className="flex items-center gap-3 px-6 py-3.5 rounded-full font-bold text-gray-900 bg-white/90 backdrop-blur-sm shadow-xl border border-white/40 hover:shadow-2xl hover:bg-white transition-all duration-300"
                                        >
                                            <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center overflow-hidden border border-rose-200">
                                                {matrimonyProfile.profilePhoto ? (
                                                    <img src={`http://localhost:5000${matrimonyProfile.profilePhoto}`} alt="Profile" className="w-full h-full object-cover" />
                                                ) : (
                                                    <User size={14} className="text-rose-600" />
                                                )}
                                            </div>
                                            <span>My Profile</span>
                                        </motion.button>
                                    </>
                                )}
                            </div>


                        </div>
                    </motion.div>
                </div>
            </section>


            {/* Process Section */}
            <section className="py-20">
                <div className="container-custom">
                    <h2 className="text-3xl font-bold text-center mb-16 font-display text-gray-900">How It Works</h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute top-[3.5rem] left-20 right-20 h-0.5 bg-rose-100 -z-10 border-t-2 border-dashed border-rose-200"></div>

                        {[
                            { icon: Users, title: "Register", desc: "Create your profile for free" },
                            { icon: Search, title: "Connect", desc: "Filter & match preferences" },
                            { icon: Shield, title: "Verify", desc: "Safe interactions" },
                            { icon: Sparkles, title: "Marry", desc: "Start your forever" }
                        ].map((item, idx) => (
                            <div key={idx} className="flex flex-col items-center text-center group">
                                <div className="w-28 h-28 bg-white border-2 border-rose-100 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 group-hover:border-rose-400 group-hover:shadow-xl transition-all duration-300 shadow-sm relative">
                                    <div className="absolute inset-2 bg-rose-50 rounded-full"></div>
                                    <item.icon className="text-rose-500 relative z-10" size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2 font-display">{item.title}</h3>
                                <p className="text-gray-500">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Register Your Profile CTA Section ─────────────────────────── */}
            <section id="registration-section" className="py-16 px-4 md:px-6">
                <div className="container-custom">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="relative rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50 border border-rose-100 shadow-2xl shadow-rose-100/40 p-8 md:p-14"
                    >
                        {/* Background Decorative Blobs */}
                        <div className="absolute -top-20 -right-20 w-72 h-72 bg-rose-200/40 rounded-full blur-3xl pointer-events-none" />
                        <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-pink-200/30 rounded-full blur-3xl pointer-events-none" />

                        <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12">
                            {/* Left — Info */}
                            <div className="flex-1">
                                <span className="text-rose-500 font-bold tracking-widest uppercase text-xs mb-4 block">
                                    Begin Your Journey
                                </span>
                                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 font-display mb-4 leading-tight">
                                    Register Your Profile &<br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-pink-600">
                                        Find Your Soulmate
                                    </span>
                                </h2>
                                <p className="text-gray-600 text-base leading-relaxed mb-8 max-w-lg">
                                    Join thousands of families who trust Sri Kanishka Matrimony. Create your verified profile today and get matched with compatible life partners — all in complete privacy.
                                </p>

                                {/* Data collected */}
                                <div className="mb-8">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">What We Collect</p>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                        {[
                                            '👤 Personal Details', '🏠 Family Background', '🎓 Education & Career',
                                            '🕉️ Religion & Caste', '📸 Profile Photo', '📞 Contact Info'
                                        ].map((item, i) => (
                                            <div key={i} className="flex items-center gap-2 bg-white/80 border border-rose-100 rounded-xl px-3 py-2 text-xs font-semibold text-gray-700 shadow-sm">
                                                {item}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Trust badges */}
                                <div className="flex flex-wrap gap-3">
                                    {['🔒 100% Private', '✅ Verified Profiles', '📋 MSME Certified'].map((b, i) => (
                                        <span key={i} className="text-xs font-bold text-rose-700 bg-rose-100 border border-rose-200 px-3 py-1 rounded-full">{b}</span>
                                    ))}
                                </div>
                            </div>

                            {/* Right — Payment Card + CTA */}
                            <div className="w-full lg:w-80 flex flex-col items-center">
                                {/* Payment info card */}
                                <div className="w-full bg-white rounded-2xl shadow-xl border border-rose-100 p-6 mb-6">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 text-center">Lifetime Registration</p>
                                    <div className="text-center mb-4">
                                        <div className="text-5xl font-black text-gray-900 font-display">₹499</div>
                                        <div className="text-sm text-gray-400 font-medium mt-1">One-time · No renewals · Ever</div>
                                    </div>
                                    <ul className="space-y-2 mb-5">
                                        {[
                                            'Unlimited profile browsing',
                                            'Direct contact with matches',
                                            'Priority listing in search',
                                            'Dedicated relationship manager',
                                            'Lifetime profile visibility',
                                        ].map((f, i) => (
                                            <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                                                <CheckCircle size={14} className="text-rose-500 flex-shrink-0" />
                                                {f}
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="text-[10px] text-gray-400 text-center font-medium border-t border-gray-100 pt-3">
                                        Payment collected after profile review · Secure & safe
                                    </div>
                                </div>

                                {/* Animated Register Button */}
                                <div className="relative w-full flex justify-center">
                                    {/* Pulse rings */}
                                    <span className="absolute inset-0 rounded-full bg-rose-400/30 animate-ping" style={{ animationDuration: '1.8s' }} />
                                    <span className="absolute inset-1 rounded-full bg-rose-300/20 animate-ping" style={{ animationDuration: '2.4s', animationDelay: '0.3s' }} />
                                    <motion.button
                                        onClick={handleRegisterHeroClick}
                                        whileHover={{ scale: 1.06 }}
                                        whileTap={{ scale: 0.95 }}
                                        animate={{ y: [0, -6, 0] }}
                                        transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
                                        className="relative z-10 w-full flex items-center justify-center gap-3 px-8 py-4 rounded-full font-bold text-white text-base bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 shadow-xl shadow-rose-300/50 hover:shadow-2xl hover:shadow-rose-400/60 transition-all"
                                    >
                                        <Users size={20} />
                                        Register Your Profile
                                        <ArrowRight size={18} />
                                    </motion.button>
                                </div>
                                {!matrimonyProfile ? (
                                    <div className="mt-4 text-center">
                                        <p className="text-xs text-gray-400">Free to register · Pay only after approval</p>
                                    </div>
                                ) : (
                                    <p className="text-xs text-gray-400 mt-4 text-center">Your profile is currently {matrimonyProfile.status}</p>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Approach Text */}
            <section className="py-16">
                <div className="container-custom">
                    <div className="max-w-4xl mx-auto text-center">
                        <span className="text-rose-500 font-bold tracking-widest uppercase text-xs mb-3 block">Our Commitment</span>
                        <h2 className="text-3xl font-bold text-black mb-6 font-display">A Union of Souls & Families</h2>
                        <p className="text-lg text-black leading-relaxed mb-6">
                            Marriage is more than just a ceremony; it is a lifetime commitment of two families. At Kanishka Sri, we understand the delicate balance between modern aspirations and traditional family values.
                        </p>
                        <p className="text-lg text-black leading-relaxed">
                            Our dedicated relationship managers spend time understanding not just your biodata, but your personality, life goals, and family dynamics to suggest matches that truly resonate on a deeper level. We believe in creating alliances that stand the test of time.
                        </p>
                    </div>
                </div>
            </section>

            {/* Royal Gold Experience Section */}
            <section className="py-20 overflow-hidden">
                <div className="container-custom">
                    <div className="flex flex-col lg:flex-row items-center gap-16 mb-24">
                        <div className="lg:w-1/2 relative group">
                            <div className="absolute -inset-4 bg-gradient-to-r from-rose-200 to-orange-100 rounded-[2.5rem] -z-10 blur-xl opacity-70 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <img
                                src="/images/marriage/indian_wedding_royal_couple_1770706214572.png"
                                alt="Royal Couple"
                                className="rounded-[2rem] shadow-2xl w-full object-cover h-[500px] transform group-hover:scale-[1.02] transition-transform duration-500"
                            />
                            <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-rose-100">
                                <div className="flex items-center gap-2 text-rose-600 font-bold">
                                    <Sparkles size={20} />
                                    <span>Premium verified profiles</span>
                                </div>
                            </div>
                        </div>
                        <div className="lg:w-1/2">
                            <span className="text-rose-600 font-bold tracking-widest uppercase text-xs mb-4 block">The Gold Standard</span>
                            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-display leading-tight">
                                Exclusive Matchmaking <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-orange-600">for Elite Families</span>
                            </h2>
                            <p className="text-lg text-gray-600 leading-relaxed mb-8">
                                Embark on a journey to find a partner who shares your values, heritage, and status. Our premium service is designed for families who seek dignity, discretion, and a perfect union of equals.
                            </p>

                            <ul className="space-y-4 mb-10">
                                {[
                                    "Dedicated Relationship Manager for personalized searching",
                                    "Enhanced Privacy Controls & Profile Highlighting",
                                    "Background Checks & Family Verification Reports",
                                    "Priority Access to New Premium Profiles"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <div className="mt-1 bg-rose-100 p-1 rounded-full text-rose-600">
                                            <CheckCircle size={14} />
                                        </div>
                                        <span className="text-gray-700 font-medium">{item}</span>
                                    </li>
                                ))}
                            </ul>

                            <button onClick={() => handleAction('Upgrade to Gold')} className="bg-gray-900 text-white px-8 py-3 rounded-full font-bold hover:bg-rose-600 transition-colors shadow-lg shadow-rose-200">
                                Upgrade to Gold
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col-reverse lg:flex-row items-center gap-16">
                        <div className="lg:w-1/2">
                            <h3 className="text-3xl font-bold text-gray-900 mb-6 font-display">Deep Compatibility & Sacred Rituals</h3>
                            <p className="text-lg text-gray-600 leading-relaxed mb-6">
                                We understand that an Indian wedding is not just a union of two individuals, but a coming together of two joyous families and sacred traditions.
                            </p>
                            <p className="text-lg text-gray-600 leading-relaxed mb-8">
                                From detailed Horoscope Matching (Gun Milan) to ensuring cultural alignment, we help lay the spiritual foundation for a bond that is celebrated with timeless rituals.
                            </p>
                            <div className="bg-white p-6 rounded-2xl shadow-lg border border-rose-50 flex items-center gap-4">
                                <div className="bg-orange-100 p-3 rounded-full text-orange-600">
                                    <Star size={24} fill="currentColor" />
                                </div>
                                <div>
                                    <div className="font-bold text-gray-900">Expert Astrology Team</div>
                                    <div className="text-sm text-gray-500">Available for consultation 24/7</div>
                                </div>
                            </div>
                        </div>
                        <div className="lg:w-1/2 relative group">
                            <div className="absolute -inset-4 bg-gradient-to-l from-orange-100 to-rose-200 rounded-[2.5rem] -z-10 blur-xl opacity-70 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <img
                                src="/images/marriage/indian_wedding_rituals_hands_1770706233016.png"
                                alt="Traditional Rituals"
                                className="rounded-[2rem] shadow-2xl w-full object-cover h-[400px] transform group-hover:scale-[1.02] transition-transform duration-500"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col lg:flex-row items-center gap-16 mt-24">
                        <div className="lg:w-1/2 relative group">
                            <div className="absolute -inset-4 bg-gradient-to-r from-orange-100 to-rose-200 rounded-[2.5rem] -z-10 blur-xl opacity-70 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <img
                                src="/images/marriage/indian_wedding_couple_v3_1770706270419.png"
                                alt="Happy Couple"
                                className="rounded-[2rem] shadow-2xl w-full object-cover h-[500px] transform group-hover:scale-[1.02] transition-transform duration-500"
                            />
                        </div>
                        <div className="lg:w-1/2">
                            <span className="text-rose-600 font-bold tracking-widest uppercase text-xs mb-4 block">A Lifetime of Happiness</span>
                            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-display leading-tight">
                                Celebrate Your <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-orange-600">Love Story</span>
                            </h2>
                            <p className="text-lg text-gray-600 leading-relaxed mb-6">
                                Every "Happy Ending" starts with a beautiful beginning. Join the thousands of couples who have found their perfect companion through us.
                            </p>
                            <p className="text-lg text-gray-600 leading-relaxed mb-8">
                                Whether you dream of a grand celebration or an intimate ceremony, finding the right person is the first step. Let us help you write the first chapter of your forever.
                            </p>
                            <button onClick={() => handleAction('Start Journey')} className="flex items-center gap-2 text-rose-600 font-bold hover:text-rose-700 transition-colors group">
                                <span>Start Your Journey</span>
                                <ChevronDown className="transform -rotate-90 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Detail */}
            <section className="py-12 mb-20">
                <div className="container-custom">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { title: "100% Verified Profiles", desc: "Every profile is screened physically to ensure safety.", icon: Shield },
                            { title: "Privacy Control", desc: "You decide who sees your photos and contact details.", icon: Search },
                            { title: "Personalized Support", desc: "Dedicated relationship managers to help you search.", icon: Users },
                            { title: "25+ Years of Trust", desc: "Helping families unite across generations with integrity.", icon: Heart }
                        ].map((feature, idx) => (
                            <div key={idx} className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl hover:bg-white hover:shadow-xl transition-all duration-300 border border-rose-100 group">
                                <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-rose-500 mb-6 shadow-sm group-hover:scale-110 transition-transform">
                                    <feature.icon size={28} />
                                </div>
                                <h3 className="font-bold text-lg text-gray-900 mb-3">{feature.title}</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Agent Section */}
            <section className="py-20">
                <div className="container-custom">
                    <div className="text-center mb-12">
                        <span className="text-rose-500 font-bold tracking-widest uppercase text-xs mb-3 block">Our Trusted Agent</span>
                        <h2 className="text-3xl font-bold text-gray-900 font-display">Sri Mahathi Marriage Bureau</h2>
                    </div>
                    <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-10 items-center justify-center">
                        {/* Agent Photo Card */}
                        <div className="flex flex-col items-center bg-white rounded-[2rem] shadow-xl border border-rose-100 p-8 hover:shadow-2xl hover:shadow-rose-100/50 transition-all duration-300 group w-full lg:w-auto">
                            <div className="relative mb-6">
                                <div className="absolute -inset-2 bg-gradient-to-br from-rose-200 to-pink-200 rounded-full blur-md opacity-60 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <img
                                    src="/images/marriage/agent-venkat-reddy.jpg"
                                    alt="Kongari Venkat Reddy"
                                    className="relative w-44 h-44 rounded-full object-cover object-top border-4 border-white shadow-lg"
                                />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 font-display mb-1">Kongari Venkat Reddy</h3>
                            <p className="text-rose-600 font-semibold text-sm mb-3 uppercase tracking-wider">Marriage Bureau Agent</p>
                            <a
                                href="tel:9912131155"
                                className="flex items-center gap-2 bg-gradient-to-r from-rose-500 to-pink-600 text-white px-6 py-2.5 rounded-full font-bold text-sm hover:shadow-lg hover:shadow-rose-300/50 transition-all duration-300 hover:scale-105"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.77a16 16 0 0 0 6 6l.9-.9a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                                9912131155
                            </a>
                        </div>

                        {/* Visiting Card */}
                        <div className="w-full lg:flex-1 group">
                            <div className="relative">
                                <div className="absolute -inset-3 bg-gradient-to-r from-rose-200 via-orange-100 to-pink-200 rounded-[2rem] blur-xl opacity-60 group-hover:opacity-100 transition-opacity duration-500"></div>
                                <img
                                    src="/images/marriage/agent-visiting-card.jpg"
                                    alt="Sri Mahathi Marriage Bureau Visiting Card"
                                    className="relative w-full rounded-[1.5rem] shadow-2xl border-4 border-white object-cover group-hover:scale-[1.02] transition-transform duration-500"
                                />
                            </div>
                            <p className="text-center text-gray-500 text-sm mt-4 font-medium">
                                MSME Govt. Certified · Reg. No. 744/2025 · Offices: Jagtial &amp; Karimnagar
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Placement Stats & Partners - Footer Style */}
            <section className="py-20 bg-[#1F1209] text-white rounded-t-[3rem] mt-auto">
                <div className="container-custom">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20 text-center divide-x divide-white/10">
                        <div>
                            <div className="text-4xl md:text-5xl font-bold text-rose-500 mb-2 font-display">10k+</div>
                            <div className="text-sm md:text-base text-rose-100/60 font-medium">Matches Made</div>
                        </div>
                        <div>
                            <div className="text-4xl md:text-5xl font-bold text-rose-500 mb-2 font-display">50k+</div>
                            <div className="text-sm md:text-base text-rose-100/60 font-medium">Active Profiles</div>
                        </div>
                        <div>
                            <div className="text-4xl md:text-5xl font-bold text-rose-500 mb-2 font-display">98%</div>
                            <div className="text-sm md:text-base text-rose-100/60 font-medium">Verification Rate</div>
                        </div>
                        <div>
                            <div className="text-4xl md:text-5xl font-bold text-rose-500 mb-2 font-display">24/7</div>
                            <div className="text-sm md:text-base text-rose-100/60 font-medium">Support Team</div>
                        </div>
                    </div>

                    <div className="text-center">
                        <p className="text-rose-100/40 text-sm uppercase tracking-widest mb-8 font-bold">Featured In</p>
                        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
                            {['Vogue Weddings', 'The Knot', 'Brides', 'WeddingWire', 'Shaadi Sagan', 'WedMeGood'].map((company, i) => (
                                <span key={i} className="text-xl md:text-2xl font-bold font-display text-white">{company}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
            
            {/* Render Profile Modal specifically for this page */}
            <ProfileModal />
        </div >
    );
};

export default MarriageServices;
