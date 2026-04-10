import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code, Terminal, Database, CheckCircle, ArrowRight, Briefcase, Sparkles, Star, Phone, X, Layers, Target, Trophy, Users, BookOpen, Clock, BadgeCheck, Zap, Laptop, ShieldCheck, TrendingUp, Info } from 'lucide-react';
import { courses as rawCourses, jobOffers } from '../../data/mockData';
import { useUI } from '../../context/UIContext';
import api from '../../api/client';

// Detailed data per course including descriptive paragraphs
const COURSE_EXTENSIONS = {
    1: {
        about: "Our Full Stack Development track is a rigorous architectural journey. We focus on building scalable, production-ready applications from the ground up. You will master the intricate dance between frontend reactivity and backend efficiency, learning how to handle state, security, and database optimization like a seasoned professional in a top-tier MNC.",
        syllabus: ["Architecture of MERN", "React Hooks & Context", "Node.js Event Loop", "Database Indexing", "Deployment on AWS"],
        outcomes: ["Certified Full Stack Architect", "10+ Real-world Projects", "Guaranteed MNC Interviews"],
        salary: "8 - 15 LPA",
        role: "Architecture Specialist"
    },
    2: {
        about: "The Cloud & DevOps program is designed for those who want to build the backbone of the internet. You'll move beyond simple coding to understanding infrastructure as code. Our curriculum covers the entire automation lifecycle, teaching you how to manage massive traffic and ensure 99.9% uptime using the same tools used by companies like Netflix and Amazon.",
        syllabus: ["AWS Core Services", "Docker Containerization", "Kubernetes Orchestration", "CI/CD Pipelines", "IaC with Terraform"],
        outcomes: ["DevOps Professional Cert", "Cloud Migration Projects", "Infrastructure Mastery"],
        salary: "12 - 25 LPA",
        role: "Cloud Engineer"
    },
    3: {
        about: "Dive deep into the era of intelligence. This track doesn't just teach you how to write Python; it teaches you how to make machines think. From statistical foundations to implementing complex neural networks, you will gain the expertise to turn raw data into actionable insights and build AI agents that can solve real-world problems autonomously.",
        syllabus: ["Statistics for AI", "Machine Learning Models", "Deep Learning with TensorFlow", "Natural Language Processing", "Big Data Analytics"],
        outcomes: ["AI Researcher Cert", "NLP & Vision Projects", "Data Strategy Board"],
        salary: "15 - 30 LPA",
        role: "Data Scientist"
    },
    4: {
        about: "In an age of increasing digital threats, our Cybersecurity program prepares you to be the ultimate defender. We take an offensive-to-defensive approach, teaching you to think like a hacker to build impenetrable systems. You'll master network security, ethical hacking, and risk compliance, ensuring you're ready to protect vital enterprise data.",
        syllabus: ["Network Penetration", "Risk Assessment", "Web App Security", "Incident Response", "Compliance Standards"],
        outcomes: ["Certified Ethical Hacker", "Security Audit Projects", "Vulnerability Research"],
        salary: "10 - 20 LPA",
        role: "Security Auditor"
    },
};

const ITServices = () => {
    const [activeTab, setActiveTab] = useState('courses');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [expandedCourse, setExpandedCourse] = useState(null);
    const { openServiceModal } = useUI();

    const openEnrollment = () => setIsFormOpen(true);
    const closeEnrollment = () => setIsFormOpen(false);

    const toggleDetails = (id) => {
        setExpandedCourse(expandedCourse === id ? null : id);
    };

    return (
        <div className="pt-3 min-h-screen bg-slate-50/30">
            {/* Hero Section */}
            <section className="relative rounded-[2.5rem] margin-x-custom mx-4 md:mx-6 mb-16 overflow-hidden min-h-[600px] flex items-center shadow-2xl shadow-blue-100/50">
                <div className="absolute inset-0">
                    <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop" alt="IT Academy Team" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent"></div>
                </div>

                <div className="container-custom relative z-10 px-8 md:px-12 py-12">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="max-w-3xl"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600/10 backdrop-blur-md border border-blue-600/20 text-blue-800 text-xs font-bold uppercase tracking-wider mb-8 shadow-sm">
                            <Sparkles size={14} className="text-blue-600" />
                            Premium Career Architecture
                        </div>

                        <h1 className="text-5xl md:text-8xl font-bold mb-6 text-gray-900 font-display leading-tight">
                            Build Your <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-700">Tech Future</span>
                        </h1>
                        <p className="text-xl text-gray-700 max-w-2xl mb-12 leading-relaxed font-medium">
                            Industry-validated curriculum, live project experience, and guaranteed placement support from architects working in top MNCs.
                        </p>

                        <div className="flex flex-wrap gap-6">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={openEnrollment}
                                className="px-10 py-5 rounded-2xl bg-gradient-to-r from-blue-700 to-indigo-800 text-white font-bold shadow-xl shadow-blue-200 flex items-center gap-3 text-lg"
                            >
                                Apply Now <ArrowRight size={20} />
                            </motion.button>
                            <button
                                onClick={() => setActiveTab('courses')}
                                className="px-10 py-5 rounded-2xl bg-white text-gray-900 font-bold border border-gray-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all shadow-lg text-lg"
                            >
                                Browse Courses
                            </button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Courses / Skills Section */}
            <div className="container-custom py-12">
                <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-8">
                    <div>
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 font-display">Specialized Tracks</h2>
                        <p className="text-gray-500 mt-2 text-lg">Detailed curriculum for aspiring software architects.</p>
                    </div>
                    <div className="bg-white p-2 rounded-2xl shadow-lg border border-gray-100 flex gap-2">
                        <button
                            onClick={() => setActiveTab('courses')}
                            className={`px-8 py-3 rounded-xl font-bold transition-all ${activeTab === 'courses' ? 'bg-gray-900 text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'}`}
                        >
                            Courses
                        </button>
                        <button
                            onClick={() => setActiveTab('jobs')}
                            className={`px-8 py-3 rounded-xl font-bold transition-all ${activeTab === 'jobs' ? 'bg-gray-900 text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'}`}
                        >
                            Placements
                        </button>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {activeTab === 'courses' ? (
                        <motion.div
                            key="courses"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="space-y-12"
                        >
                            {rawCourses.map((course, idx) => {
                                const ext = COURSE_EXTENSIONS[course.id] || {
                                    about: `This ${course.title} course is designed to take you from foundational concepts to advanced architectural patterns. You'll spend significant time on live projects, ensuring that you graduate not just with a certificate, but with a portfolio that speaks volumes about your capability as a first-day-ready professional.`,
                                    outcomes: ["Professional Cert", "Capston Project", "MNC Prep"],
                                    salary: "6 - 12 LPA",
                                    role: "Software Professional",
                                    syllabus: ["Fundamentals", "Advanced Modules", "Project"]
                                };
                                return (
                                    <motion.div
                                        key={course.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        className={`bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100 flex flex-col ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-stretch min-h-[320px] transition-all duration-500 hover:shadow-xl`}
                                    >
                                        {/* Image Side */}
                                        <div className="md:w-5/12 relative min-h-[200px] md:min-h-full overflow-hidden group">
                                            <img src={course.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" alt={course.title} />
                                            <div className="absolute top-3 left-3">
                                                <span className="bg-white/95 backdrop-blur-md px-3 py-1 rounded-lg text-[11px] font-bold text-blue-700 shadow-md border border-white/50">{course.level}</span>
                                            </div>
                                        </div>

                                        {/* Content Side */}
                                        <div className="md:w-7/12 p-5 md:p-8 flex flex-col justify-center">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-1.5 text-amber-500 font-bold text-sm">
                                                    <Star size={14} fill="currentColor" /> {course.rating} <span className="text-gray-400 font-medium ml-1 text-xs">({course.reviews} Students)</span>
                                                </div>
                                                <div className="flex items-center gap-1.5 text-gray-400 font-semibold text-xs">
                                                    <Clock size={13} /> {course.duration}
                                                </div>
                                            </div>

                                            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 font-display leading-tight">{course.title}</h3>

                                            <div className="flex flex-wrap gap-1.5 mb-3">
                                                {course.tech.map((t, i) => (
                                                    <span key={i} className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-full border border-blue-100">{t}</span>
                                                ))}
                                            </div>

                                            {/* DESCRIPTIVE ABOUT PARAGRAPH */}
                                            <div className="mb-4">
                                                <div className="flex items-center gap-1.5 text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-1.5">
                                                    <Info size={11} /> Course Overview
                                                </div>
                                                <p className="text-gray-500 leading-relaxed text-xs font-medium line-clamp-3">
                                                    {ext.about}
                                                </p>
                                            </div>

                                            {/* Key Info Grid */}
                                            <div className="grid grid-cols-2 gap-3 mb-4 border-y border-gray-100 py-3">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-500 flex items-center justify-center flex-shrink-0">
                                                        <TrendingUp size={15} />
                                                    </div>
                                                    <div>
                                                        <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Est. Salary</div>
                                                        <div className="font-bold text-gray-900 text-sm">{ext.salary}</div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-500 flex items-center justify-center flex-shrink-0">
                                                        <Laptop size={15} />
                                                    </div>
                                                    <div>
                                                        <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Future Role</div>
                                                        <div className="font-bold text-gray-900 text-sm">{ext.role}</div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex flex-col sm:flex-row gap-2">
                                                <button
                                                    onClick={() => toggleDetails(course.id)}
                                                    className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-1.5 border-2 ${expandedCourse === course.id ? 'bg-gray-100 border-gray-200 text-gray-600' : 'bg-white border-blue-600 text-blue-600 hover:bg-blue-50'}`}
                                                >
                                                    {expandedCourse === course.id ? 'Hide Details' : 'View Syllabus'} <BookOpen size={14} />
                                                </button>
                                                <button
                                                    onClick={openEnrollment}
                                                    className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-gray-900 transition-all shadow-lg shadow-blue-100 flex items-center justify-center gap-1.5"
                                                >
                                                    Apply Now <ArrowRight size={14} />
                                                </button>
                                            </div>

                                            {/* Expandable Details Area */}
                                            <AnimatePresence>
                                                {expandedCourse === course.id && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: 'auto', opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        className="overflow-hidden"
                                                    >
                                                        <div className="mt-5 pt-5 border-t border-gray-100 grid grid-cols-1 gap-4">
                                                            <div>
                                                                <div className="text-xs font-bold text-blue-700 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                                                                    <Layers size={13} /> Technical Curriculum
                                                                </div>
                                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                                    {ext.syllabus.map((item, i) => (
                                                                        <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-2 text-xs text-gray-700 font-bold group/skill hover:bg-white hover:border-blue-200 transition-all">
                                                                            <ShieldCheck size={13} className="text-blue-500 group-hover/skill:scale-125 transition-transform" /> {item}
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                            <div className="bg-gradient-to-br from-gray-900 to-slate-800 p-5 rounded-2xl text-white">
                                                                <div className="flex items-center gap-2 mb-3">
                                                                    <Zap size={15} className="text-amber-400" />
                                                                    <div className="font-bold text-sm">Value Proposition</div>
                                                                </div>
                                                                <ul className="space-y-2">
                                                                    {[
                                                                        "200+ hours of live architecture training",
                                                                        "One-to-one mentorship with MNC Leads",
                                                                        "Weekly mock interviews & resume building",
                                                                        "Lifetime access to our recruitment portal"
                                                                    ].map((benefit, i) => (
                                                                        <li key={i} className="text-xs text-gray-300 flex items-start gap-2">
                                                                            <CheckCircle size={13} className="text-emerald-400 mt-0.5 flex-shrink-0" /> {benefit}
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="jobs"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-6"
                        >
                            {jobOffers.map((job) => (
                                <div key={job.id} className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-xl hover:border-emerald-200 transition-colors flex flex-col md:flex-row items-center justify-between gap-8">
                                    <div className="flex items-center gap-6">
                                        <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 font-bold text-xxl shadow-sm border border-emerald-100">{job.role[0]}</div>
                                        <div>
                                            <div className="inline-block px-3 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-widest mb-2 border border-emerald-100">Active Hiring</div>
                                            <h3 className="text-2xl font-bold text-gray-900 font-display">{job.role}</h3>
                                            <p className="text-gray-500 font-medium">{job.company} • {job.location}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-12 text-center md:text-left">
                                        <div>
                                            <div className="text-3xl font-bold text-gray-900 font-display">{job.package}</div>
                                            <div className="text-xs text-gray-400 font-bold uppercase tracking-widest">Base CTC</div>
                                        </div>
                                        <button
                                            onClick={openEnrollment}
                                            className="px-10 py-5 bg-gray-900 text-white rounded-2xl font-bold hover:bg-emerald-600 transition-all shadow-xl"
                                        >
                                            Quick Apply
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Testimonials */}
            <section className="py-24 bg-slate-900 text-white rounded-[4rem] mx-4 md:mx-6 mb-20 shadow-2xl overflow-hidden relative">
                <div className="absolute -top-20 -right-20 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>
                <div className="container-custom relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold font-display mb-4">Minds Transformed</h2>
                        <p className="text-gray-400">Success stories from top MNC architects.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { name: "Priya Sharma", role: "Sr. Dev @ Infosys", text: "The architectural depth of this program is unmatched in India." },
                            { name: "Rahul Verma", role: "Cloud Lead @ TCS", text: "From basics to Kubernetes, the transition was seamless." },
                            { name: "Anita Gupta", role: "Architect @ Wipro", text: "Best investment for a high-pay IT career." }
                        ].map((t, i) => (
                            <div key={i} className="p-10 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-md">
                                <div className="text-blue-400 mb-6 font-display text-4xl">"</div>
                                <p className="text-gray-300 mb-8 italic text-lg leading-relaxed">{t.text}</p>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center font-bold">{t.name[0]}</div>
                                    <div>
                                        <div className="font-bold text-white">{t.name}</div>
                                        <div className="text-xs text-blue-400 font-bold uppercase tracking-widest">{t.role}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final Contact Strip */}
            <section className="py-20 text-center">
                <div className="container-custom">
                    <span className="text-xs font-bold uppercase tracking-[0.4em] text-gray-400 mb-4 block">Ready to start?</span>
                    <a href="tel:9441809692" className="text-5xl md:text-6xl font-black text-gray-900 hover:text-blue-600 transition-colors font-display">9441809692</a>
                    <div className="text-sm text-gray-400 mt-6 font-medium tracking-wide">ADMISSIONS OFFICE: CHANAKYA SRIPATHI</div>
                </div>
            </section>

            {/* Enrollment Form Modal */}
            <AnimatePresence>
                {isFormOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-md bg-gray-900/60"
                        onClick={closeEnrollment}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            onClick={e => e.stopPropagation()}
                            className="bg-white w-full max-w-lg rounded-3xl shadow-2xl relative overflow-hidden"
                        >
                            <button
                                onClick={closeEnrollment}
                                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 text-gray-400 flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-colors z-20"
                            >
                                <X size={16} />
                            </button>

                            <div className="p-6 md:p-8">
                                <EnrollmentForm onClose={closeEnrollment} />
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// ── Enrollment Form Component ─────────────────────────────────────────────────
const COURSE_OPTIONS = [
    'Full Stack Development', 'Data Science & AI', 'Cloud & DevOps',
    'Python Programming', 'Cybersecurity', 'Web Design (UI/UX)',
    'Java & Spring Boot', 'React & Node.js', 'Digital Marketing', 'Other',
];

const EnrollmentForm = ({ onClose }) => {
    const { user } = useUI();
    const [form, setForm] = useState({ 
        name: user?.name || '', 
        email: user?.email || '', 
        phone: user?.phone || '', 
        course: '', 
        experience: '', 
        message: '' 
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); setError(''); setSuccess('');
        try {
            const res = await api.post('/it-training/enquiry', form);
            if (res.data.success) {
                setSuccess('✅ Success! Our counselor will call you within 24 hours.');
                setForm({ name: '', email: '', phone: '', course: '', experience: '', message: '' });
                setTimeout(() => {
                    if (onClose) onClose();
                }, 3000);
            } else {
                setError(res.data.message || 'Submission failed.');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Could not connect to server.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative">
            <div className="mb-5">
                <h3 className="text-xl font-bold text-gray-900 font-display mb-1">Apply for Selection</h3>
                <p className="text-gray-400 text-xs font-medium">Join the next batch of elite tech professionals.</p>
            </div>

            {success && <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-700 font-semibold text-sm text-center animate-pulse">{success}</div>}
            {error && <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 font-semibold text-sm text-center">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                        <input type="text" name="name" required value={form.name} onChange={handleChange} placeholder="Enter your name" className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm font-medium" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Email</label>
                        <input type="email" name="email" required value={form.email} onChange={handleChange} placeholder="your@email.com" className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm font-medium" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Phone</label>
                        <input type="tel" name="phone" required value={form.phone} onChange={handleChange} placeholder="+91 00000 00000" className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm font-medium" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Course</label>
                        <select name="course" required value={form.course} onChange={handleChange} className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm font-medium appearance-none">
                            <option value="">Select Course</option>
                            {COURSE_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                </div>
                <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Experience Level</label>
                    <select name="experience" value={form.experience} onChange={handleChange} className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm font-medium appearance-none">
                        <option value="">Choose Level</option>
                        <option value="Beginner">Student / New Graduate</option>
                        <option value="Intermediate">1-3 Years Experience</option>
                        <option value="Advanced">3+ Years Experience (Senior Role)</option>
                    </select>
                </div>
                <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Your Goals</label>
                    <textarea name="message" value={form.message} onChange={handleChange} rows={2} placeholder="What do you want to achieve with this course?" className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm resize-none font-medium" />
                </div>
                <button type="submit" disabled={loading} className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-100 hover:bg-blue-700 active:scale-95 transition-all text-sm mt-1">
                    {loading ? 'Submitting...' : 'Send Application'}
                </button>
            </form>
        </div>
    );
};

export default ITServices;
