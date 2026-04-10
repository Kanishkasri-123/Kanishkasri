import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Loader2, CheckCircle, ShieldCheck, ArrowRight, User, CreditCard, FileText } from 'lucide-react';
import { useUI } from '../context/UIContext';
import api from '../api/client';

const ServiceModal = () => {
    const { serviceModal, closeServiceModal, setMatrimonyProfile, matrimonyProfile, matrimonyLoginUser, showToast } = useUI();
    const [status, setStatus] = useState('idle'); // idle | loading | payment_loading | biodata_loading | done
    const [error, setError] = useState('');
    const [isMatLoginMode, setIsMatLoginMode] = useState(false);

    // Sync login mode when modal opens
    React.useEffect(() => {
        if (serviceModal.isOpen) {
            setIsMatLoginMode(!!serviceModal.isLoginMode)
            setMatStep(1)
            setStatus('idle')
            setError('')
        }
    }, [serviceModal.isOpen, serviceModal.isLoginMode]);

    // Step for matrimony: 1 = basic, 2 = payment, 3 = biodata
    const [matStep, setMatStep] = useState(1);

    const [profilePhoto, setProfilePhoto] = useState(null);
    const [photoPreview, setPhotoPreview] = useState(null);

    // ── Step 1: Basic fields ──────────────────────────────────────────
    const [basicData, setBasicData] = useState({
        firstName: '', lastName: '', email: '', phone: '',
        password: '', gender: 'Male', dob: '',
    });

    // ── Step 3: Bio data fields ───────────────────────────────────────
    const [bioData, setBioData] = useState({
        profileFor: 'Myself', maritalStatus: 'Never Married',
        religion: 'Hindu', caste: '', motherTongue: '',
        education: '', profession: '', annualIncome: '',
        height: '', city: '', state: '', about: '',
    });

    // Non-matrimony form
    const [otherForm, setOtherForm] = useState({
        firstName: '', lastName: '', email: '', phone: '',
        preferredCourse: 'Full Stack Development',
        budget: '', timeline: '', message: '',
        country: '', preferredDate: '', preferredTime: ''
    });

    // ── DOB bounds ────────────────────────────────────────────────────
    const dobMax = (() => { const d = new Date(); d.setFullYear(d.getFullYear() - 18); return d.toISOString().split('T')[0]; })();
    const dobMin = (() => { const d = new Date(); d.setFullYear(d.getFullYear() - 60); return d.toISOString().split('T')[0]; })();

    const handleBasicChange = (e) => {
        const { name, value } = e.target;
        if (name === 'phone') { setBasicData(p => ({ ...p, phone: value.replace(/\D/g, '').slice(0, 10) })); return; }
        if (name === 'firstName' || name === 'lastName') { if (!/^[a-zA-Z\s]*$/.test(value)) return; }
        setBasicData(p => ({ ...p, [name]: value }));
    };

    const handleBioChange = (e) => {
        const { name, value } = e.target;
        setBioData(p => ({ ...p, [name]: value }));
    };

    const handleOtherChange = (e) => {
        const { name, value } = e.target;
        if (name === 'phone') { setOtherForm(p => ({ ...p, phone: value.replace(/\D/g, '').slice(0, 10) })); return; }
        setOtherForm(p => ({ ...p, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 50 * 1024 * 1024) { setError('File too large! Max 50MB.'); return; }
            setProfilePhoto(file);
            setPhotoPreview(URL.createObjectURL(file));
        }
    };

    // ── STEP 1: Register basic ────────────────────────────────────────
    const handleBasicSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading'); setError('');
        try {
            if (isMatLoginMode) {
                const res = await api.post('/matrimony/login', { email: basicData.email, password: basicData.password });
                const data = res.data;
                if (data.success) {
                    matrimonyLoginUser(data.data.profile, data.data.token);
                    
                    if (data.data.profile.paymentStatus === 'paid') {
                        // If they have already filled bio data (check a required field like 'profession')
                        if (data.data.profile.profileData && data.data.profile.profileData.profession) {
                            showToast('Logged in successfully!', 'success');
                            closeServiceModal();
                        } else {
                            // If bio data is missing, go to step 3
                            setMatStep(3);
                        }
                    } else {
                        // If unpaid, go to step 2
                        setMatStep(2);
                    }
                    setStatus('idle');
                } else {
                    setError(data.message || 'Login failed'); setStatus('idle');
                }
                return;
            }

            const fd = new FormData();
            Object.keys(basicData).forEach(k => fd.append(k, basicData[k]));
            if (profilePhoto) fd.append('profilePhoto', profilePhoto);

            const res = await api.post('/matrimony/register', fd);
            const data = res.data;

            if (data.success) {
                matrimonyLoginUser(data.data.profile, data.data.token);
                setMatStep(2); // → go to payment
                setStatus('idle');
            } else {
                setError(data.message || 'Registration failed'); setStatus('idle');
            }
        } catch {
            setError('Could not connect to server.'); setStatus('idle');
        }
    };

    // ── STEP 2: Payment ───────────────────────────────────────────────
    const handlePayment = async () => {
        setStatus('payment_loading'); setError('');
        const matToken = sessionStorage.getItem('matToken');
        try {
            const res = await api.post(`/matrimony/${matrimonyProfile.id}/pay`, { simulateSuccess: true }, {
                headers: { Authorization: `Bearer ${matToken}` }
            });
            const data = res.data;
            if (data.success) {
                setMatrimonyProfile(data.data.profile);
                setMatStep(3); // → go to bio data
                setStatus('idle');
            } else {
                setError(data.message || 'Payment failed.'); setStatus('idle');
            }
        } catch {
            setError('Payment error. Please try again.'); setStatus('idle');
        }
    };

    // ── STEP 3: Save bio data ────────────────────────────────────────
    const handleBioSubmit = async (e) => {
        e.preventDefault();
        setStatus('biodata_loading'); setError('');
        const matToken = sessionStorage.getItem('matToken');
        try {
            const res = await api.put('/matrimony/me', bioData, {
                headers: { Authorization: `Bearer ${matToken}` }
            });
            const data = res.data;
            if (data.success) {
                setMatrimonyProfile(data.data.profile);
                setStatus('done');
            } else {
                setError(data.message || 'Failed to save bio data.'); setStatus('idle');
            }
        } catch {
            setError('Could not connect to server.'); setStatus('idle');
        }
    };

    // ── Non-matrimony submit ──────────────────────────────────────────
    const handleOtherSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading'); setError('');
        try {
            let endpoint = '/it-training/enquiry';
            if (serviceModal.type === 'abroad') endpoint = '/abroad/enquiry';
            else if (serviceModal.type === 'real-estate') endpoint = '/real-estate/contact';

            const payload = { 
                ...otherForm, 
                serviceType: serviceModal.type,
                name: `${otherForm.firstName || ''} ${otherForm.lastName || ''}`.trim() 
            };

            const res = await api.post(endpoint, payload);
            const data = res.data;
            if (data.success) { setStatus('done'); }
            else { setError(data.message || 'Submission failed.'); setStatus('idle'); }
        } catch {
            setError('Could not connect to server.'); setStatus('idle');
        }
    };

    if (!serviceModal.isOpen) return null;
    const isMatrimony = serviceModal.type === 'marriage';

    // ── Step indicator ────────────────────────────────────────────────
    const steps = [
        { num: 1, label: 'Basic', icon: User },
        { num: 2, label: 'Payment', icon: CreditCard },
        { num: 3, label: 'Bio Data', icon: FileText },
    ];

    const inputCls = 'w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-400 outline-none text-sm font-medium transition-all';
    const labelCls = 'text-[10px] font-bold text-gray-400 uppercase tracking-widest';

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    onClick={closeServiceModal}
                    className="absolute inset-0 bg-white/60 backdrop-blur-md"
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.92, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.92, y: 20 }}
                    className="relative w-full max-w-lg bg-white rounded-[2rem] shadow-2xl z-10 border border-gray-100 max-h-[92vh] overflow-y-auto"
                >
                    <div className="p-6 md:p-8">
                        {/* Header */}
                        <div className="flex justify-between items-start mb-5">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 font-display">
                                    {!isMatrimony ? serviceModal.title
                                        : isMatLoginMode ? 'Login to Matrimony'
                                        : matStep === 1 ? 'Create Your Profile'
                                        : matStep === 2 ? 'Activate Your Profile'
                                        : 'Complete Your Bio Data'}
                                </h2>
                                {isMatrimony && !isMatLoginMode && status !== 'done' && (
                                    <p className="text-xs text-gray-400 mt-1">
                                        {matStep === 1 ? 'Enter your basic details to get started'
                                            : matStep === 2 ? 'One-time lifetime registration fee'
                                            : 'Fill your detailed profile for better matches'}
                                    </p>
                                )}
                            </div>
                            <button onClick={closeServiceModal} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors flex-shrink-0">
                                <X size={18} />
                            </button>
                        </div>

                        {/* Step Indicator (matrimony only, not login) */}
                        {isMatrimony && !isMatLoginMode && status !== 'done' && (
                            <div className="flex items-center gap-0 mb-6">
                                {steps.map((s, i) => {
                                    const Icon = s.icon;
                                    const isActive = matStep === s.num;
                                    const isDone = matStep > s.num;
                                    return (
                                        <React.Fragment key={s.num}>
                                            <div className="flex flex-col items-center">
                                                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${isDone ? 'bg-rose-500 border-rose-500 text-white' : isActive ? 'bg-white border-rose-500 text-rose-600' : 'bg-gray-50 border-gray-200 text-gray-400'}`}>
                                                    {isDone ? <CheckCircle size={16} /> : <Icon size={15} />}
                                                </div>
                                                <span className={`text-[10px] font-bold mt-1 ${isActive ? 'text-rose-500' : isDone ? 'text-rose-400' : 'text-gray-400'}`}>{s.label}</span>
                                            </div>
                                            {i < steps.length - 1 && (
                                                <div className={`flex-1 h-0.5 mb-4 mx-1 rounded-full transition-all ${matStep > s.num ? 'bg-rose-400' : 'bg-gray-200'}`} />
                                            )}
                                        </React.Fragment>
                                    );
                                })}
                            </div>
                        )}

                        {/* ── SUCCESS ───────────────────────────────────────── */}
                        {status === 'done' ? (
                            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="py-10 text-center">
                                <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-100">
                                    <CheckCircle size={36} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2 font-display">
                                    {isMatrimony ? 'Profile Complete! 🎉' : 'Request Received!'}
                                </h3>
                                <p className="text-gray-400 text-sm mb-6">
                                    {isMatrimony ? 'Your matrimony profile is now fully active. Start finding your match!' : 'Our team will get back to you within 24 hours.'}
                                </p>
                                <button onClick={closeServiceModal} className="px-8 py-2.5 bg-gray-900 text-white rounded-xl font-bold text-sm hover:bg-rose-600 transition-colors">
                                    Close
                                </button>
                            </motion.div>

                        ) : !isMatrimony ? (
                            /* ── OTHER SERVICE FORM ──────────────────────── */
                            <form onSubmit={handleOtherSubmit} className="space-y-3">
                                {error && <div className="bg-red-50 text-red-600 p-3 rounded-xl text-xs border border-red-100">{error}</div>}
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1"><label className={labelCls}>First Name</label><input required name="firstName" value={otherForm.firstName} onChange={handleOtherChange} type="text" className={inputCls} placeholder="John" /></div>
                                    <div className="space-y-1"><label className={labelCls}>Last Name</label><input required name="lastName" value={otherForm.lastName} onChange={handleOtherChange} type="text" className={inputCls} placeholder="Doe" /></div>
                                </div>
                                <div className="space-y-1"><label className={labelCls}>Email</label><input required name="email" value={otherForm.email} onChange={handleOtherChange} type="email" className={inputCls} placeholder="john@example.com" /></div>
                                <div className="space-y-1"><label className={labelCls}>Phone</label><input required name="phone" value={otherForm.phone} onChange={handleOtherChange} type="tel" className={inputCls} placeholder="9876543210" /></div>
                                {serviceModal.type === 'it' && (
                                    <div className="space-y-1"><label className={labelCls}>Preferred Course</label>
                                        <select name="preferredCourse" value={otherForm.preferredCourse} onChange={handleOtherChange} className={inputCls}>
                                            <option>Full Stack Development</option>
                                            <option>Cloud & DevOps</option>
                                            <option>Data Science & AI</option>
                                            <option>Cybersecurity</option>
                                            <option>Other</option>
                                        </select>
                                    </div>
                                )}
                                {serviceModal.type === 'abroad' && (
                                    <>
                                        <div className="space-y-1"><label className={labelCls}>Preferred Destination</label>
                                            <select name="country" value={otherForm.country} onChange={handleOtherChange} className={inputCls} required={serviceModal.type === 'abroad'}>
                                                <option value="">Select a country</option>
                                                <option value="United States">United States</option>
                                                <option value="United Kingdom">United Kingdom</option>
                                                <option value="Canada">Canada</option>
                                                <option value="Australia">Australia</option>
                                                <option value="Europe">Europe</option>
                                                <option value="Other">Not Sure Yet</option>
                                            </select>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="space-y-1"><label className={labelCls}>Preferred Date</label>
                                                <input type="date" name="preferredDate" value={otherForm.preferredDate} onChange={handleOtherChange} className={inputCls} />
                                            </div>
                                            <div className="space-y-1"><label className={labelCls}>Preferred Time</label>
                                                <select name="preferredTime" value={otherForm.preferredTime} onChange={handleOtherChange} className={inputCls}>
                                                    <option value="">Select time slot</option>
                                                    <option value="Morning">Morning (9 AM - 12 PM)</option>
                                                    <option value="Afternoon">Afternoon (12 PM - 4 PM)</option>
                                                    <option value="Evening">Evening (4 PM - 7 PM)</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <label className={labelCls}>Questions or Goals</label>
                                            <textarea name="message" value={otherForm.message} onChange={handleOtherChange} rows="2" className={`${inputCls} resize-none`} placeholder="Tell us about your educational goals..." />
                                        </div>
                                    </>
                                )}
                                {serviceModal.type === 'real-estate' && (
                                    <>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="space-y-1"><label className={labelCls}>Estimated Budget</label>
                                                <select name="budget" value={otherForm.budget} onChange={handleOtherChange} className={inputCls} required={serviceModal.type === 'real-estate'}>
                                                    <option value="">Select Budget</option>
                                                    <option>Under 50 Lakhs</option>
                                                    <option>50 Lakhs - 1 Crore</option>
                                                    <option>1 Crore - 5 Crores</option>
                                                    <option>5 Crores +</option>
                                                </select>
                                            </div>
                                            <div className="space-y-1"><label className={labelCls}>Timeline</label>
                                                <select name="timeline" value={otherForm.timeline} onChange={handleOtherChange} className={inputCls} required={serviceModal.type === 'real-estate'}>
                                                    <option value="">Select Timeline</option>
                                                    <option>Immediately</option>
                                                    <option>Within 3 Months</option>
                                                    <option>Within 6 Months</option>
                                                    <option>Just Browsing</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <label className={labelCls}>Additional Message</label>
                                            <textarea name="message" value={otherForm.message} onChange={handleOtherChange} rows="2" className={`${inputCls} resize-none`} placeholder="Specific requirements or questions..." />
                                        </div>
                                    </>
                                )}
                                <button type="submit" disabled={status === 'loading'} className="w-full py-3 bg-gray-900 text-white font-bold rounded-xl flex items-center justify-center gap-2 text-sm hover:bg-rose-600 transition-colors mt-2">
                                    {status === 'loading' ? <Loader2 className="animate-spin" size={18} /> : <><Send size={16} /> Submit Application</>}
                                </button>
                            </form>

                        ) : matStep === 1 ? (
                            /* ── STEP 1: BASIC DETAILS / LOGIN ───────────── */
                            <form onSubmit={handleBasicSubmit} className="space-y-3">
                                {error && <div className="bg-red-50 text-red-600 p-3 rounded-xl text-xs border border-red-100">{error}</div>}
                                {isMatLoginMode ? (
                                    <>
                                        <div className="space-y-1"><label className={labelCls}>Email Address</label><input required name="email" value={basicData.email} onChange={handleBasicChange} type="email" className={inputCls} placeholder="john@example.com" /></div>
                                        <div className="space-y-1"><label className={labelCls}>Password</label><input required name="password" value={basicData.password} onChange={handleBasicChange} type="password" className={inputCls} placeholder="••••••••" /></div>
                                    </>
                                ) : (
                                    <>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="space-y-1"><label className={labelCls}>First Name</label><input required name="firstName" value={basicData.firstName} onChange={handleBasicChange} minLength={2} maxLength={30} type="text" className={inputCls} placeholder="John" /></div>
                                            <div className="space-y-1"><label className={labelCls}>Last Name</label><input required name="lastName" value={basicData.lastName} onChange={handleBasicChange} minLength={2} maxLength={30} type="text" className={inputCls} placeholder="Doe" /></div>
                                        </div>
                                        <div className="space-y-1"><label className={labelCls}>Email Address</label><input required name="email" value={basicData.email} onChange={handleBasicChange} type="email" className={inputCls} placeholder="john@example.com" /></div>
                                        <div className="space-y-1">
                                            <label className={labelCls}>Phone <span className="normal-case tracking-normal text-rose-400 font-normal">(10 digits)</span></label>
                                            <input required name="phone" value={basicData.phone} onChange={handleBasicChange} type="tel" inputMode="numeric" minLength={10} maxLength={10} className={inputCls} placeholder="9876543210" />
                                            {basicData.phone.length > 0 && basicData.phone.length < 10 && <p className="text-[10px] text-rose-400 mt-0.5">{10 - basicData.phone.length} more digit{10 - basicData.phone.length !== 1 ? 's' : ''} needed</p>}
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="space-y-1"><label className={labelCls}>Gender</label>
                                                <select name="gender" value={basicData.gender} onChange={handleBasicChange} className={inputCls}>
                                                    <option>Male</option><option>Female</option>
                                                </select>
                                            </div>
                                            <div className="space-y-1">
                                                <label className={labelCls}>Date of Birth <span className="normal-case tracking-normal text-rose-400 font-normal">(18–60 yrs)</span></label>
                                                <input required name="dob" value={basicData.dob} onChange={handleBasicChange} type="date" min={dobMin} max={dobMax} className={inputCls} />
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <label className={labelCls}>Password <span className="normal-case tracking-normal text-rose-400 font-normal">(min 8 chars)</span></label>
                                            <input required name="password" value={basicData.password} onChange={handleBasicChange} type="password" minLength={8} className={inputCls} placeholder="••••••••" />
                                            {basicData.password.length > 0 && basicData.password.length < 8 && <p className="text-[10px] text-rose-400 mt-0.5">{8 - basicData.password.length} more character{8 - basicData.password.length !== 1 ? 's' : ''} needed</p>}
                                        </div>
                                        {/* Profile Photo */}
                                        <div className="space-y-1">
                                            <label className={labelCls}>Profile Photo</label>
                                            <div className="flex items-center gap-4 p-3 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl hover:border-rose-300 transition-colors">
                                                {photoPreview ? (
                                                    <div className="relative w-16 h-16 flex-shrink-0 group">
                                                        <img src={photoPreview} alt="Preview" className="w-full h-full object-cover rounded-lg shadow" />
                                                        <button type="button" onClick={() => { setProfilePhoto(null); setPhotoPreview(null); }} className="absolute -top-1.5 -right-1.5 bg-red-500 text-white p-0.5 rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity"><X size={12} /></button>
                                                    </div>
                                                ) : (
                                                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 flex-shrink-0">
                                                        <User size={24} />
                                                    </div>
                                                )}
                                                <div>
                                                    <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" id="profile-photo-upload" required />
                                                    <label htmlFor="profile-photo-upload" className="cursor-pointer text-xs bg-rose-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-rose-600 transition-colors">
                                                        {profilePhoto ? 'Change Photo' : 'Upload Photo'}
                                                    </label>
                                                    <p className="text-[10px] text-gray-400 mt-1">JPG, PNG · Max 50MB</p>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}
                                <button type="submit" disabled={status === 'loading'} className="w-full py-3 bg-gradient-to-r from-rose-500 to-pink-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 text-sm shadow-lg shadow-rose-200 hover:shadow-xl transition-all mt-2">
                                    {status === 'loading' ? <Loader2 className="animate-spin" size={18} /> : <>{isMatLoginMode ? 'Login' : 'Continue to Payment'} <ArrowRight size={16} /></>}
                                </button>
                                <div className="text-center">
                                    <button type="button" onClick={() => setIsMatLoginMode(!isMatLoginMode)} className="text-xs font-bold text-gray-400 hover:text-rose-500 transition-colors">
                                        {isMatLoginMode ? 'Need an account? Register Here' : 'Already registered? Login Here'}
                                    </button>
                                </div>
                            </form>

                        ) : matStep === 2 ? (
                            /* ── STEP 2: PAYMENT ─────────────────────────── */
                            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="py-2 text-center">
                                <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-rose-100">
                                    <ShieldCheck size={32} />
                                </div>
                                <div className="bg-gradient-to-br from-rose-50 to-pink-50 border border-rose-100 rounded-2xl p-5 mb-5 text-left">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 text-center">Lifetime Registration</p>
                                    <div className="text-center mb-4">
                                        <span className="text-4xl font-black text-gray-900">₹499</span>
                                        <span className="text-gray-400 text-sm ml-2">one-time · no renewal</span>
                                    </div>
                                    <ul className="space-y-1.5">
                                        {['Unlimited profile browsing', 'Direct contact with matches', 'Priority listing', 'Dedicated relationship manager', 'Lifetime visibility'].map((f, i) => (
                                            <li key={i} className="flex items-center gap-2 text-xs text-gray-600">
                                                <CheckCircle size={13} className="text-rose-400 flex-shrink-0" /> {f}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                {error && <div className="bg-red-50 text-red-600 p-3 rounded-xl text-xs border border-red-100 mb-3">{error}</div>}
                                <button onClick={handlePayment} disabled={status === 'payment_loading'} className="w-full py-3 bg-gradient-to-r from-rose-500 to-pink-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 text-sm shadow-lg shadow-rose-200 hover:shadow-xl transition-all">
                                    {status === 'payment_loading' ? <Loader2 className="animate-spin" size={18} /> : <><CreditCard size={16} /> Pay ₹499 & Continue <ArrowRight size={16} /></>}
                                </button>
                                <p className="text-[10px] text-gray-400 mt-3">Secure payment · Profile review after payment</p>
                            </motion.div>

                        ) : (
                            /* ── STEP 3: BIO DATA ────────────────────────── */
                            <motion.form initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} onSubmit={handleBioSubmit} className="space-y-3">
                                {error && <div className="bg-red-50 text-red-600 p-3 rounded-xl text-xs border border-red-100">{error}</div>}

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1"><label className={labelCls}>Profile For</label>
                                        <select name="profileFor" value={bioData.profileFor} onChange={handleBioChange} className={inputCls}>
                                            <option>Myself</option><option>Son</option><option>Daughter</option><option>Sibling</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1"><label className={labelCls}>Marital Status</label>
                                        <select name="maritalStatus" value={bioData.maritalStatus} onChange={handleBioChange} className={inputCls}>
                                            <option>Never Married</option><option>Divorced</option><option>Widowed</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1"><label className={labelCls}>Religion</label>
                                        <select name="religion" value={bioData.religion} onChange={handleBioChange} className={inputCls}>
                                            <option>Hindu</option><option>Christian</option><option>Muslim</option><option>Sikh</option><option>Other</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1"><label className={labelCls}>Caste / Sub-Caste</label>
                                        <input required name="caste" value={bioData.caste} onChange={handleBioChange} type="text" className={inputCls} placeholder="E.g. Brahmin" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1"><label className={labelCls}>Mother Tongue</label>
                                        <input required name="motherTongue" value={bioData.motherTongue} onChange={handleBioChange} type="text" className={inputCls} placeholder="Telugu, Hindi…" />
                                    </div>
                                    <div className="space-y-1"><label className={labelCls}>Height</label>
                                        <select name="height" value={bioData.height} onChange={handleBioChange} className={inputCls}>
                                            <option value="">Select</option>
                                            {["4'6\"","4'8\"","4'10\"","5'0\"","5'1\"","5'2\"","5'3\"","5'4\"","5'5\"","5'6\"","5'7\"","5'8\"","5'9\"","5'10\"","5'11\"","6'0\"","6'1\"","6'2\"","6'3\""].map(h => <option key={h}>{h}</option>)}
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1"><label className={labelCls}>Education</label>
                                        <input required name="education" value={bioData.education} onChange={handleBioChange} type="text" className={inputCls} placeholder="B.Tech, MBA…" />
                                    </div>
                                    <div className="space-y-1"><label className={labelCls}>Profession</label>
                                        <input required name="profession" value={bioData.profession} onChange={handleBioChange} type="text" className={inputCls} placeholder="Software Engineer…" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1"><label className={labelCls}>Annual Income</label>
                                        <select name="annualIncome" value={bioData.annualIncome} onChange={handleBioChange} className={inputCls}>
                                            <option value="">Select</option>
                                            {['Below ₹3 LPA','₹3–5 LPA','₹5–10 LPA','₹10–15 LPA','₹15–25 LPA','₹25–50 LPA','Above ₹50 LPA'].map(i => <option key={i}>{i}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-1"><label className={labelCls}>City</label>
                                        <input required name="city" value={bioData.city} onChange={handleBioChange} type="text" className={inputCls} placeholder="Hyderabad" />
                                    </div>
                                </div>

                                <div className="space-y-1"><label className={labelCls}>State</label>
                                    <input required name="state" value={bioData.state} onChange={handleBioChange} type="text" className={inputCls} placeholder="Telangana" />
                                </div>

                                <div className="space-y-1"><label className={labelCls}>About Yourself</label>
                                    <textarea name="about" value={bioData.about} onChange={handleBioChange} rows={2} className={inputCls + ' resize-none'} placeholder="A brief description about yourself, your family and expectations…" />
                                </div>

                                <button type="submit" disabled={status === 'biodata_loading'} className="w-full py-3 bg-gradient-to-r from-rose-500 to-pink-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 text-sm shadow-lg shadow-rose-200 hover:shadow-xl transition-all mt-1">
                                    {status === 'biodata_loading' ? <Loader2 className="animate-spin" size={18} /> : <><CheckCircle size={16} /> Complete My Profile</>}
                                </button>
                                <p className="text-[10px] text-gray-400 text-center">You can update these details anytime from your profile</p>
                            </motion.form>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default ServiceModal;
