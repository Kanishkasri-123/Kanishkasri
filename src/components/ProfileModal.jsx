import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Edit3, LogOut, Loader2, CheckCircle, User as UserIcon } from 'lucide-react';
import { useUI } from '../context/UIContext';
import api from '../api/client';

const ProfileModal = () => {
    const { isProfileOpen, closeProfile, matrimonyProfile, setMatrimonyProfile, matrimonyLogoutUser, showToast } = useUI();
    const [isEditing, setIsEditing] = useState(false);
    const [status, setStatus] = useState('idle'); // idle, loading
    const [formData, setFormData] = useState({});

    // Sync form data when profile opens or edit mode toggles
    useEffect(() => {
        if (isProfileOpen && matrimonyProfile) {
            setFormData({
                gender: matrimonyProfile.profileData?.gender || 'Male',
                dob: matrimonyProfile.profileData?.dob || '',
                maritalStatus: matrimonyProfile.profileData?.maritalStatus || 'Never Married',
                religion: matrimonyProfile.profileData?.religion || 'Hindu',
                caste: matrimonyProfile.profileData?.caste || '',
                education: matrimonyProfile.profileData?.education || '',
                profession: matrimonyProfile.profileData?.profession || '',
                profileFor: matrimonyProfile.profileData?.profileFor || 'Myself',
            });
        }
    }, [isProfileOpen, matrimonyProfile, isEditing]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setStatus('loading');

        try {
            const token = sessionStorage.getItem('matToken');
            const res = await api.put('/matrimony/me', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data.success) {
                setMatrimonyProfile(res.data.data.profile);
                showToast('Profile updated successfully!', 'success');
                setIsEditing(false);
            } else {
                showToast(res.data.message || 'Failed to update profile', 'error');
            }
        } catch (err) {
            showToast('Network error while updating', 'error');
        } finally {
            setStatus('idle');
        }
    };

    if (!isProfileOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => { closeProfile(); setIsEditing(false); }}
                    className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl overflow-hidden z-10 border border-gray-100 flex flex-col max-h-[90vh]"
                >
                    <div className="p-6 md:p-8 flex-shrink-0 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-gradient-to-br from-gold-400 to-amber-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-gold-200 overflow-hidden">
                                {matrimonyProfile?.profilePhoto ? (
                                    <img 
                                        src={`http://localhost:5000${matrimonyProfile.profilePhoto}`} 
                                        alt="Avatar" 
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <UserIcon size={28} />
                                )}
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 font-display">{matrimonyProfile?.firstName} {matrimonyProfile?.lastName}</h2>
                                <p className="text-sm text-gray-500">{matrimonyProfile?.email}</p>
                            </div>
                        </div>
                        <button onClick={() => { closeProfile(); setIsEditing(false); }} className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-400 hover:text-gray-900">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar">
                        {!matrimonyProfile ? (
                            <div className="text-center py-10">
                                <div className="w-16 h-16 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <UserIcon size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">No Matrimony Profile</h3>
                                <p className="text-gray-500 mb-6">You have not registered for Global Matrimony yet.</p>
                            </div>
                        ) : isEditing ? (
                            <form id="edit-profile-form" onSubmit={handleSave} className="space-y-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Edit Matrimony Details</h3>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Profile For</label>
                                        <select name="profileFor" value={formData.profileFor} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold-500 outline-none transition-all">
                                            <option>Myself</option>
                                            <option>Son</option>
                                            <option>Daughter</option>
                                            <option>Sibling</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Gender</label>
                                        <select name="gender" value={formData.gender} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold-500 outline-none transition-all">
                                            <option>Male</option>
                                            <option>Female</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Date of Birth</label>
                                        <input required name="dob" value={formData.dob} onChange={handleChange} type="date" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold-500 outline-none transition-all" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Marital Status</label>
                                        <select name="maritalStatus" value={formData.maritalStatus} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold-500 outline-none transition-all">
                                            <option>Never Married</option>
                                            <option>Divorced</option>
                                            <option>Widowed</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Religion</label>
                                        <select name="religion" value={formData.religion} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold-500 outline-none transition-all">
                                            <option>Hindu</option>
                                            <option>Christian</option>
                                            <option>Muslim</option>
                                            <option>Other</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Caste / Sub-Caste</label>
                                        <input required name="caste" value={formData.caste} onChange={handleChange} type="text" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold-500 outline-none transition-all" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Education</label>
                                        <input required name="education" value={formData.education} onChange={handleChange} type="text" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold-500 outline-none transition-all" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Profession</label>
                                        <input required name="profession" value={formData.profession} onChange={handleChange} type="text" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold-500 outline-none transition-all" />
                                    </div>
                                </div>
                            </form>
                        ) : (
                            <div className="space-y-6">
                                <div className="flex justify-between items-center border-b pb-2">
                                    <h3 className="text-lg font-bold text-gray-900">Matrimony Profile</h3>
                                    <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${matrimonyProfile.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                        {matrimonyProfile.status === 'active' ? 'Active' : 'Pending Activation'}
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                    <div className="space-y-1">
                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Profile ID</span>
                                        <p className="font-semibold text-gray-900">{matrimonyProfile.id}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Phone Number</span>
                                        <p className="font-semibold text-gray-900">{matrimonyProfile.phone}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Profile For</span>
                                        <p className="font-semibold text-gray-900">{matrimonyProfile.profileData?.profileFor}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Gender</span>
                                        <p className="font-semibold text-gray-900">{matrimonyProfile.profileData?.gender}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Date of Birth</span>
                                        <p className="font-semibold text-gray-900">{matrimonyProfile.profileData?.dob}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Marital Status</span>
                                        <p className="font-semibold text-gray-900">{matrimonyProfile.profileData?.maritalStatus}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Religion & Caste</span>
                                        <p className="font-semibold text-gray-900">{matrimonyProfile.profileData?.religion}, {matrimonyProfile.profileData?.caste}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Education</span>
                                        <p className="font-semibold text-gray-900">{matrimonyProfile.profileData?.education}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Profession</span>
                                        <p className="font-semibold text-gray-900">{matrimonyProfile.profileData?.profession}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="p-6 md:p-8 border-t border-gray-100 bg-gray-50 flex items-center justify-between gap-4 mt-auto flex-shrink-0">
                        <button
                            onClick={() => { matrimonyLogoutUser(); closeProfile(); }}
                            className="flex items-center gap-2 text-red-600 font-bold hover:bg-red-50 px-4 py-2 rounded-lg transition-colors"
                        >
                            <LogOut size={18} /> Logout
                        </button>
                        
                        {matrimonyProfile && (
                            isEditing ? (
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setIsEditing(false)}
                                        className="px-6 py-2.5 rounded-xl font-bold text-gray-600 hover:bg-gray-200 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        form="edit-profile-form"
                                        disabled={status === 'loading'}
                                        className="flex items-center gap-2 px-6 py-2.5 bg-gray-900 text-white font-bold rounded-xl shadow-md hover:bg-gray-800 transition-colors"
                                    >
                                        {status === 'loading' ? <Loader2 size={18} className="animate-spin" /> : <><Save size={18} /> Save</>}
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="flex items-center gap-2 px-6 py-2.5 bg-white border border-gray-200 text-gray-900 font-bold rounded-xl shadow-sm hover:bg-gray-50 transition-colors"
                                >
                                    <Edit3 size={18} /> Edit Profile
                                </button>
                            )
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default ProfileModal;
