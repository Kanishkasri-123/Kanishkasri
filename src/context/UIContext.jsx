import React, { createContext, useContext, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, X } from 'lucide-react';

const UIContext = createContext();

export const UIProvider = ({ children }) => {
    // Modal states
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [serviceModal, setServiceModal] = useState({ isOpen: false, type: null, title: '', isLoginMode: false });

    // Toast state
    const [toast, setToast] = useState({ isOpen: false, message: '', type: 'success' });

    // Auth state
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);

    // Completely Separate Matrimony Auth State
    const [matrimonyProfile, setMatrimonyProfile] = useState(null);
    const [matToken, setMatToken] = useState(null);

    // Initial auth check
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedMatToken = localStorage.getItem('matToken');
        
        if (storedToken) {
            setToken(storedToken);
            setIsLoggedIn(true);
            const headers = { Authorization: `Bearer ${storedToken}` };
            fetch('http://localhost:5000/api/auth/me', { headers })
                .then(res => res.json())
                .then(data => { if (data.success) setUser(data.data.user); })
                .catch(() => {});
        }

        if (storedMatToken) {
            setMatToken(storedMatToken);
            const headers = { Authorization: `Bearer ${storedMatToken}` };
            fetch('http://localhost:5000/api/matrimony/me', { headers })
                .then(res => res.json())
                .then(data => { if (data.success) setMatrimonyProfile(data.data.profile); })
                .catch(() => {});
        }
    }, []);

    const loginUser = (newToken, userData) => {
        setToken(newToken);
        setUser(userData);
        setIsLoggedIn(true);
        localStorage.setItem('token', newToken);
    };

    const logoutUser = () => {
        setIsLoggedIn(false);
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
        showToast('Successfully logged out from Global Account', 'success');
    };

    // Matrimony Specific Auth Methods
    const matrimonyLoginUser = (profileData, jwtToken) => {
        setMatrimonyProfile(profileData);
        setMatToken(jwtToken);
        localStorage.setItem('matToken', jwtToken);
    };

    const matrimonyLogoutUser = () => {
        setMatrimonyProfile(null);
        setMatToken(null);
        localStorage.removeItem('matToken');
        showToast('Logged out of Matrimony Dashboard', 'success');
    };

    // UI actions
    const openLogin = () => setIsLoginOpen(true);
    const closeLogin = () => setIsLoginOpen(false);

    const openProfile = () => setIsProfileOpen(true);
    const closeProfile = () => setIsProfileOpen(false);

    const toggleMobileMenu = () => setIsMobileMenuOpen(prev => !prev);
    const closeMobileMenu = () => setIsMobileMenuOpen(false);

    const openServiceModal = (type, title, isLoginMode = false) => setServiceModal({ isOpen: true, type, title, isLoginMode });
    const closeServiceModal = () => setServiceModal({ isOpen: false, type: null, title: '', isLoginMode: false });

    const showToast = (message, type = 'success') => {
        setToast({ isOpen: true, message, type });
        setTimeout(() => setToast({ isOpen: false, message: '', type: 'success' }), 4000);
    };
    const closeToast = () => setToast(prev => ({ ...prev, isOpen: false }));

    return (
        <UIContext.Provider value={{
            // Modals
            isLoginOpen, openLogin, closeLogin,
            isProfileOpen, openProfile, closeProfile,
            isMobileMenuOpen, toggleMobileMenu, closeMobileMenu,
            serviceModal, openServiceModal, closeServiceModal,
            
            // Global user and tokens
            user, token, isLoggedIn, loginUser, logoutUser,
            
            // Matrimony specifics
            matrimonyProfile, setMatrimonyProfile,
            matToken, matrimonyLoginUser, matrimonyLogoutUser,
            
            // Toast
            showToast
        }}>
            {children}

            {/* Global Toast Component */}
            <AnimatePresence>
                {toast.isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 20, scale: 1 }}
                        exit={{ opacity: 0, y: -50, scale: 0.9 }}
                        className="fixed top-0 left-1/2 -translate-x-1/2 z-[100] flex items-center p-4 min-w-[320px] bg-white rounded-xl shadow-2xl border border-gray-100"
                    >
                        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${toast.type === 'success' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                            {toast.type === 'success' ? <CheckCircle size={24} /> : <XCircle size={24} />}
                        </div>
                        <div className="ml-4 flex-1">
                            <p className="text-sm font-bold text-gray-900">{toast.type === 'success' ? 'Success' : 'Error'}</p>
                            <p className="text-sm text-gray-500">{toast.message}</p>
                        </div>
                        <button onClick={closeToast} className="ml-4 text-gray-400 hover:text-gray-600">
                            <X size={16} />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </UIContext.Provider>
    );
};

export const useUI = () => useContext(UIContext);
