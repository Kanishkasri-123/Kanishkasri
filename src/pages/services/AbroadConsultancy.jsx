import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plane, GraduationCap, Briefcase, FileCheck, ArrowRight, Sparkles, Globe, Award, BookOpen, Star, Search, CheckCircle, X } from 'lucide-react';
import { useUI } from '../../context/UIContext';

const examsData = [
    {
        name: 'IELTS',
        fullName: 'International English Language Testing System',
        color: 'blue',
        description: "The IELTS test is the world's most popular English language proficiency test for study, work, and migration. Accepted by over 11,000 organizations globally including universities, employers, professional bodies, and immigration authorities.",
        whoShouldTake: 'Students planning to study in UK, Australia, Canada, New Zealand, or seeking immigration.',
        testFormat: [
            'Listening (30 mins): 40 questions',
            'Reading (60 mins): 40 questions',
            'Writing (60 mins): 2 tasks',
            'Speaking (11-14 mins): Face-to-face interview'
        ],
        details: [
            'Score range: 0-9 bands',
            'Two types: Academic & General',
            'Validity: 2 years from test date',
            'Results: Available in 3-5 days'
        ],
        preparationTips: [
            'Practice all four skills daily',
            'Take regular mock tests',
            'Focus on academic vocabulary'
        ]
    },
    {
        name: 'TOEFL',
        fullName: 'Test of English as a Foreign Language',
        color: 'purple',
        description: 'TOEFL iBT measures your ability to use and understand English at the university level. Accepted by 160+ countries and 11,500+ universities.',
        whoShouldTake: 'Students applying to American, Canadian universities, or English-speaking institutions.',
        testFormat: [
            'Reading (54-72 mins): 3-4 passages',
            'Listening (41-57 mins): Academic lectures',
            'Speaking (17 mins): 4 tasks',
            'Writing (50 mins): 2 tasks'
        ],
        details: [
            'Score range: 0-120 (30 pts/section)',
            'Duration: ~3 hours',
            'Validity: 2 years',
            'Results: Available in 4-8 days'
        ],
        preparationTips: [
            'Master integrated note-taking',
            'Build 3-hour test stamina',
            'Practice fast computer typing'
        ]
    },
    {
        name: 'GRE',
        fullName: 'Graduate Record Examination',
        color: 'indigo',
        description: "The GRE General Test measures verbal reasoning, quantitative reasoning, and analytical writing skills. Required for admission to graduate and business schools worldwide.",
        whoShouldTake: "Students applying for Master's, PhD, MBA, and other graduate programs globally. Strongly preferred in the USA.",
        testFormat: [
            'Analytical Writing: 2 essays',
            'Verbal Reasoning: 2 sections',
            'Quantitative Reasoning: 2 sections',
            'Computer-adaptive format'
        ],
        details: [
            'Score range: 260-340',
            'Duration: ~3 hrs 45 mins',
            'Validity: 5 years',
            'Fee: $220 USD worldwide'
        ],
        preparationTips: [
            'Master high-frequency vocabulary',
            'Practice mental math shortcuts',
            'Take full adaptive mock tests'
        ]
    },
    {
        name: 'PTE',
        fullName: 'Pearson Test of English Academic',
        color: 'emerald',
        description: 'Computer-based English test for study abroad and immigration. Known for fast results and unbiased AI scoring, assessing real-life academic English.',
        whoShouldTake: 'Students seeking faster results and computer-based testing. Popular for Australia, New Zealand, UK, and Canada.',
        testFormat: [
            'Speaking & Writing (54-67 mins)',
            'Reading (29-30 mins)',
            'Listening (30-43 mins)',
            'AI integrated scoring'
        ],
        details: [
            'Score range: 10-90 points',
            'Fully computer-based',
            'Validity: 2 years',
            'Results: Within 48 hours!'
        ],
        preparationTips: [
            'Master computerized interface',
            'Practice speaking clearly',
            'Learn template-based strategies'
        ]
    },
    {
        name: 'Duolingo',
        fullName: 'Duolingo English Test',
        color: 'teal',
        description: 'An affordable, convenient online English proficiency test. Completed entirely online in under an hour, it\'s increasingly accepted globally.',
        whoShouldTake: 'Students needing a fast, low-cost online alternative. Accepted by thousands of universities worldwide.',
        testFormat: [
            'Adaptive Setup (5 mins)',
            'Graded Test (45 mins)',
            'Video Interview (10 mins)',
            'All sections computer-adaptive'
        ],
        details: [
            'Score range: 10-160',
            'Duration: Under 1 hour',
            'Fee: ~$59 USD (very affordable)',
            'Results: Within 48 hours'
        ],
        preparationTips: [
            'Use free official practice tests',
            'Ensure stable internet',
            'Familiarize with adaptive formats'
        ]
    }
];

const destinationsData = [
    {
        name: 'United States', flag: '🇺🇸',
        img: '/abroad-assets/usa_study_destination_1767878848400.png',
        universities: '200+ Universities', highlights: 'Ivy League, Tech Hubs, Research Excellence',
        desc: 'Study in the world\'s leading economy with access to cutting-edge research, innovation, and career opportunities.',
        topUniversities: ['Harvard', 'Stanford', 'MIT', 'Yale'],
    },
    {
        name: 'United Kingdom', flag: '🇬🇧',
        img: '/abroad-assets/uk_study_destination_1767878865705.png',
        universities: '100+ Universities', highlights: 'Oxford, Cambridge, World-Class Education',
        desc: 'Experience historic academic excellence combined with modern innovation in the UK\'s prestigious universities.',
        topUniversities: ['Oxford', 'Cambridge', 'Imperial College', 'LSE'],
    },
    {
        name: 'Canada', flag: '🇨🇦',
        img: '/abroad-assets/canada_study_destination_1767878895785.png',
        universities: '80+ Universities', highlights: 'Immigration Benefits, Quality Education',
        desc: 'Enjoy high-quality education with excellent post-study work opportunities and immigration pathways.',
        topUniversities: ['UofT', 'UBC', 'McGill', 'Waterloo'],
    },
    {
        name: 'Australia', flag: '🇦🇺',
        img: '/abroad-assets/australia_study_destination_1767878913275.png',
        universities: '60+ Universities', highlights: 'Work Opportunities, Beach Lifestyle',
        desc: 'Experience world-class education in a vibrant, multicultural environment with excellent work-life balance.',
        topUniversities: ['Melbourne', 'Sydney', 'ANU', 'UNSW'],
    },
    {
        name: 'Ireland', flag: '🇮🇪',
        img: '/abroad-assets/ireland_university.png',
        universities: '30+ Universities', highlights: '2-Year Post-Study Work Permit',
        desc: 'Study in the Emerald Isle with access to quality education, friendly culture, and excellent post-study work opportunities.',
        topUniversities: ['Trinity College', 'UCD', 'NUI Galway', 'UCC'],
    },
    {
        name: 'New Zealand', flag: '🇳🇿',
        img: '/abroad-assets/new_zealand_university.png',
        universities: '40+ Universities', highlights: 'High-Quality Education & Natural Beauty',
        desc: 'Experience world-renowned education in stunning natural landscapes with welcoming communities and work opportunities.',
        topUniversities: ['Auckland', 'Otago', 'Victoria', 'Canterbury'],
    },
    {
        name: 'Europe', flag: '🇪🇺',
        img: '/abroad-assets/europe_study_destination_1767878934797.png',
        universities: '150+ Universities', highlights: 'Affordable Tuition, Cultural Diversity',
        desc: 'Explore diverse cultures while accessing affordable, high-quality education across European nations.',
        topUniversities: ['ETH Zurich', 'TU Munich', 'Sorbonne', 'KU Leuven'],
    }
];

const AbroadConsultancy = () => {
    const { openServiceModal } = useUI();
    const [activeTab, setActiveTab] = useState('study');
    const [selectedCountry, setSelectedCountry] = useState(null);

    return (
        <div className="pt-3 min-h-screen">
            {/* Hero */}
            <section className="relative rounded-[2.5rem] margin-x-custom mx-4 md:mx-6 mb-16 overflow-hidden min-h-[500px] flex items-center shadow-2xl shadow-sky-100/50">
                <div className="absolute inset-0">
                    <img src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" alt="Study Abroad" className="w-full h-full object-cover" />
                </div>
                
                <div className="absolute inset-0 bg-gradient-to-r from-sky-900/90 via-sky-800/60 to-transparent"></div>

                <div className="container-custom relative z-10 px-8 md:px-12 py-12">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-3xl"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-500/20 backdrop-blur-md border border-sky-500/50 text-sky-200 text-xs font-bold uppercase tracking-wider mb-8 shadow-sm">
                            <Plane size={14} />
                            Your Global Journey Starts Here
                        </div>

                        <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white font-display leading-tight drop-shadow-lg">
                            Go Beyond <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-indigo-300">Borders</span>
                        </h1>
                        <p className="text-xl text-sky-100 max-w-2xl mb-12 leading-relaxed font-sans font-medium">
                            Expert guidance for your overseas education, global career opportunities, and competitive exam preparations.
                        </p>
                        
                        <div className="flex flex-wrap gap-4">
                            <button
                                onClick={() => setActiveTab('study')}
                                className={`px-8 py-4 rounded-full font-bold transition-all shadow-lg hover:-translate-y-1 ${activeTab === 'study' ? 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-sky-900/20' : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'}`}
                            >
                                Study Abroad
                            </button>
                            <button
                                onClick={() => setActiveTab('work')}
                                className={`px-8 py-4 rounded-full font-bold transition-all shadow-lg hover:-translate-y-1 ${activeTab === 'work' ? 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-sky-900/20' : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'}`}
                            >
                                Work Permits & Visas
                            </button>
                            <button
                                onClick={() => setActiveTab('exams')}
                                className={`px-8 py-4 rounded-full font-bold transition-all shadow-lg hover:-translate-y-1 ${activeTab === 'exams' ? 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-sky-900/20' : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'}`}
                            >
                                Exam Preparation
                            </button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Steps & Features */}
            <section className="py-12">
                <div className="container-custom">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {[
                            { title: "University Selection", desc: "Get unbiased advice to choose the university that fits your goals.", icon: GraduationCap },
                            { title: "Test Prep", desc: "Expert coaching for IELTS, TOEFL, GRE, and PTE.", icon: BookOpen },
                            { title: "Visa Assistance", desc: "End-to-end support for a hassle-free visa application process.", icon: FileCheck },
                            { title: "Global Networks", desc: "Extensive tie-ups with top institutions globally.", icon: Globe }
                        ].map((feature, idx) => (
                            <div key={idx} className="p-6 rounded-3xl bg-white/40 border border-slate-100 hover:bg-white hover:shadow-xl hover:border-sky-100 transition-all duration-300 group">
                                <div className="w-12 h-12 bg-white rounded-2xl shadow-sm text-sky-600 flex items-center justify-center mb-4 border border-slate-100 group-hover:scale-110 transition-transform">
                                    <feature.icon size={24} />
                                </div>
                                <h3 className="font-bold text-lg text-gray-900 mb-2 font-display">{feature.title}</h3>
                                <p className="text-sm text-gray-500 leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Content Section */}
            <div className="container-custom pb-20 mt-10">
                {activeTab === 'study' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-12"
                    >
                        {/* Featured Countries */}
                        <div>
                            <div className="text-center max-w-2xl mx-auto mb-12">
                                <span className="text-sky-600 font-bold tracking-widest uppercase text-xs mb-3 block">Top Destinations</span>
                                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 font-display">Study in the World's Best Universities</h2>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {destinationsData.map((country, idx) => (
                                    <div 
                                        key={idx} 
                                        onClick={() => setSelectedCountry(country)}
                                        className="relative rounded-[2rem] overflow-hidden group shadow-lg h-80 border border-gray-100 cursor-pointer"
                                    >
                                        <img src={country.img} alt={country.name} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/50 to-transparent"></div>
                                        <div className="absolute bottom-6 left-6 right-6 text-white">
                                            <div className="text-4xl mb-2">{country.flag}</div>
                                            <h3 className="text-2xl font-bold mb-1">{country.name}</h3>
                                            <p className="text-sky-200 text-[10px] font-bold uppercase tracking-wider mb-2">{country.universities}</p>
                                            <p className="text-sky-100/90 text-sm line-clamp-2">{country.desc}</p>
                                            <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <span className="text-sky-300 font-bold text-sm flex items-center gap-1">View Details <ArrowRight size={14} /></span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <div className="bg-sky-50 rounded-[2rem] p-8 flex flex-col justify-center items-center text-center border border-sky-100 hover:bg-sky-100 transition-colors">
                                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-sky-600 mb-4 shadow-sm">
                                        <Globe size={32} />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">And Many More</h3>
                                    <p className="text-sky-700/80 mb-6 text-sm">Discover programs in Ireland, New Zealand, Singapore & Europe.</p>
                                    <button 
                                        onClick={() => openServiceModal('abroad', 'General Enquiry')}
                                        className="text-sky-600 font-bold hover:underline flex items-center gap-2"
                                    >
                                        Consult Now <ArrowRight size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {activeTab === 'work' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-8"
                    >
                        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl border border-gray-100 flex flex-col md:flex-row gap-12 items-center">
                            <div className="flex-1 w-full h-[400px] rounded-[2rem] overflow-hidden order-2 md:order-1">
                                <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Work Abroad" className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 order-1 md:order-2">
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-50 text-sky-700 font-bold text-xs uppercase tracking-wider mb-6">
                                    Global Careers
                                </div>
                                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 font-display">Work Overseas Visas & PR</h2>
                                <p className="text-gray-600 mb-8 leading-relaxed text-lg">
                                    Secure your future with professional guidance on skilled worker visas, permanent residency (PR), and corporate immigrations.
                                </p>
                                <ul className="space-y-4 mb-8 text-gray-700">
                                    <li className="flex items-center gap-3 font-medium">
                                        <div className="w-6 h-6 rounded-full bg-sky-100 flex items-center justify-center text-sky-600">
                                            <Briefcase size={14} />
                                        </div>
                                        H-1B, L1 (USA) & Tier 2 (UK) processing
                                    </li>
                                    <li className="flex items-center gap-3 font-medium">
                                        <div className="w-6 h-6 rounded-full bg-sky-100 flex items-center justify-center text-sky-600">
                                            <FileCheck size={14} />
                                        </div>
                                        Express Entry & PNP Programs for Canada PR
                                    </li>
                                    <li className="flex items-center gap-3 font-medium">
                                        <div className="w-6 h-6 rounded-full bg-sky-100 flex items-center justify-center text-sky-600">
                                            <Plane size={14} />
                                        </div>
                                        Australia Skilled Migration Visas
                                    </li>
                                </ul>
                                <button 
                                    onClick={() => openServiceModal('abroad', `Immigration Consultation`)}
                                    className="px-8 py-4 bg-sky-600 text-white rounded-xl font-bold hover:bg-sky-700 transition-colors shadow-lg shadow-sky-200"
                                >
                                    Check Eligibility
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}

                {activeTab === 'exams' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-12"
                    >
                        <div className="text-center max-w-2xl mx-auto mb-12">
                            <span className="text-sky-600 font-bold tracking-widest uppercase text-xs mb-3 block">Test Preparation</span>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 font-display">Master Your Target Scores</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {examsData.map((exam, idx) => (
                                <div key={idx} className={`bg-white rounded-[2rem] p-8 shadow-lg border border-gray-100 hover:border-${exam.color}-200 transition-colors group flex flex-col`}>
                                    <div className="flex justify-between items-start mb-6">
                                        <div>
                                            <h3 className={`text-2xl font-bold text-${exam.color}-600 font-display`}>{exam.name}</h3>
                                            <p className="text-xs text-gray-400 font-bold uppercase tracking-tight">{exam.fullName}</p>
                                        </div>
                                        <div className={`w-12 h-12 rounded-2xl bg-${exam.color}-50 text-${exam.color}-600 flex items-center justify-center`}>
                                            <BookOpen size={24} />
                                        </div>
                                    </div>
                                    
                                    <p className="text-gray-600 text-sm mb-6 leading-relaxed flex-grow">{exam.description}</p>
                                    
                                    <div className="grid grid-cols-2 gap-4 mb-8">
                                        <div className="space-y-2">
                                            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Test Format</h4>
                                            <ul className="space-y-1">
                                                {exam.testFormat.slice(0, 3).map((f, i) => (
                                                    <li key={i} className="text-xs text-gray-600 flex items-center gap-1.5">
                                                        <div className={`w-1 h-1 rounded-full bg-${exam.color}-400`}></div> {f}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div className="space-y-2">
                                            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Key Details</h4>
                                            <ul className="space-y-1">
                                                {exam.details.slice(0, 3).map((d, i) => (
                                                    <li key={i} className="text-xs text-gray-600 flex items-center gap-1.5">
                                                        <div className={`w-1 h-1 rounded-full bg-${exam.color}-400`}></div> {d}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>

                                    <button 
                                        onClick={() => openServiceModal('exams', `Enquiry: ${exam.name}`)}
                                        className={`w-full py-3 bg-${exam.color}-50 text-${exam.color}-600 rounded-xl font-bold hover:bg-${exam.color}-600 hover:text-white transition-all text-sm`}
                                    >
                                        View Details
                                    </button>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Application Services & Timeline */}
            <section className="py-16 mt-8 bg-sky-50">
                <div className="container-custom">
                    <div className="text-center max-w-2xl mx-auto mb-12">
                        <span className="text-sky-600 font-bold tracking-widest uppercase text-xs mb-3 block">Our Services</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 font-display">How We Fast-Track <br/>Your Global Success</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
                        {[
                            { step: '01', title: 'Initial Consultation', desc: 'Complimentary personalized counseling session to understand your goals and profile.', time: '1 Hour' },
                            { step: '02', title: 'University Shortlisting', desc: 'Curated list of universities matching your profile, budget, and career aspirations.', time: '1-2 Days' },
                            { step: '03', title: 'Application Prep', desc: 'Comprehensive support for essays, SOPs, LORs, and documentation.', time: '1-2 Days' },
                            { step: '04', title: 'Visa & Departure', desc: 'Expert assistance with visa documentation, interview prep, and submission.', time: '2-3 Days' }
                        ].map((process, idx) => (
                            <div key={idx} className="bg-white p-8 rounded-3xl shadow-sm border border-sky-100 relative group hover:shadow-xl hover:-translate-y-2 transition-all">
                                <div className="text-5xl font-display font-black text-sky-100 mb-6 group-hover:text-sky-50 transition-colors">{process.step}</div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{process.title}</h3>
                                <p className="text-gray-600 text-sm leading-relaxed mb-4 min-h-[60px]">{process.desc}</p>
                                <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold tracking-wider">{process.time}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            
            <section className="py-16 bg-gradient-to-r from-sky-900 to-indigo-900 text-white mt-auto">
                <div className="container-custom">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-white/20">
                        <div>
                            <div className="text-4xl md:text-5xl font-bold text-sky-400 mb-2 font-display">2000+</div>
                            <div className="text-sm md:text-base text-sky-100/80 font-medium">Students Enrolled</div>
                        </div>
                        <div>
                            <div className="text-4xl md:text-5xl font-bold text-sky-400 mb-2 font-display">95%</div>
                            <div className="text-sm md:text-base text-sky-100/80 font-medium">Visa Success Rate</div>
                        </div>
                        <div>
                            <div className="text-4xl md:text-5xl font-bold text-sky-400 mb-2 font-display">20+</div>
                            <div className="text-sm md:text-base text-sky-100/80 font-medium">Countries Reached</div>
                        </div>
                        <div>
                            <div className="text-4xl md:text-5xl font-bold text-sky-400 mb-2 font-display">300+</div>
                            <div className="text-sm md:text-base text-sky-100/80 font-medium">Global University Tie-Ups</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Country Details Modal */}
            <AnimatePresence>
                {selectedCountry && (
                    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={() => setSelectedCountry(null)}
                            className="absolute inset-0"
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="relative w-full max-w-2xl bg-white p-8 md:p-12 rounded-3xl shadow-2xl z-10"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-4">
                                    <span className="text-5xl">{selectedCountry.flag}</span>
                                    <h2 className="text-3xl font-display font-bold text-gray-900">
                                        {selectedCountry.name}
                                    </h2>
                                </div>
                                <button
                                    onClick={() => setSelectedCountry(null)}
                                    className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                                {selectedCountry.desc}
                            </p>

                            <div className="mb-6 bg-sky-50 rounded-2xl p-6 border border-sky-100">
                                <h3 className="font-display font-bold text-lg text-sky-900 mb-4 flex items-center gap-2">
                                    <Award size={20} className="text-sky-500"/> Top Universities
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {selectedCountry.topUniversities.map((uni, i) => (
                                        <span key={i} className="px-4 py-2 bg-white text-sky-700 border border-sky-200 rounded-full text-sm font-bold shadow-sm">
                                            {uni}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="text-sm font-medium text-slate-500 mb-8 flex items-center gap-2">
                                <CheckCircle size={16} className="text-emerald-500"/>
                                Access to <strong>{selectedCountry.universities}</strong> worldwide.
                            </div>

                            <button
                                onClick={() => {
                                    setSelectedCountry(null);
                                    openServiceModal('abroad', `Study in ${selectedCountry.name}`);
                                }}
                                className="w-full px-8 py-4 bg-gradient-to-r from-sky-500 to-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-sky-200 hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
                            >
                                Start Your Application Process <ArrowRight size={18}/>
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AbroadConsultancy;
