import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { Scale, Menu, X, Search, Bell, User, Settings, LogOut, HelpCircle, BookOpen, LogIn, UserPlus } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications] = useState([
    { id: 1, title: 'New case assigned', time: '2m ago', unread: true },
    { id: 2, title: 'Document review pending', time: '1h ago', unread: true },
    { id: 3, title: 'Meeting scheduled', time: '3h ago', unread: false },
  ]);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const { scrollY } = useScroll();
  const location = useLocation();
  const navigate = useNavigate();
  const searchRef = useRef<HTMLInputElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Handle clicks outside dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Scroll animation logic
  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 20);
  });

  const navItems = [
    {
      label: 'Summarisation',
      id: 'summarisation',
      path: '/summarisation'
    },
    {
      label: 'Transcript',
      id: 'transcript',
      path: '/transcript'
    },
    {
      label: 'Document Query',
      id: 'doc-query',
      path: '/query'
    },
    {
      label: 'Draft',
      id: 'draft',
      path: '/draft'
    },
    {
      label: 'Advocate Diary',
      id: 'advocate-diary',
      path: '/advocate-diary'
    }
  ];

  const searchResults = [
    { type: 'page', title: 'Summarisation', path: '/summarisation' },
    { type: 'page', title: 'Transcript', path: '/transcript' },
    { type: 'page', title: 'Document Query', path: '/query' },
  ].filter(result => 
    searchQuery && result.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed w-full z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/80 backdrop-blur-lg shadow-lg' 
            : 'bg-transparent'
        }`}
      >
        {/* Progress Indicator */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary origin-left"
          style={{ scaleX: scrollY }}
        />

        <div className="container px-4 mx-auto">
          <div className="flex items-center justify-between h-16">
            {/* Logo with animation */}
            <Link to="/" className="flex items-center space-x-2 group">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <Scale className="w-8 h-8 text-primary" />
              </motion.div>
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-2xl font-bold text-transparent bg-gradient-to-r from-primary to-primary-dark bg-clip-text"
              >
                Legal AI
              </motion.span>
            </Link>

            {/* Desktop Navigation */}
            <div className="items-center hidden space-x-8 md:flex">
              {navItems.map((item) => (
                <Link
                  key={item.id}
                  to={item.path}
                  className={`text-gray-700 hover:text-primary ${
                    location.pathname === item.path ? 'font-semibold text-primary' : ''
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Right Section with Notifications, Profile, and Auth Buttons */}
            <div className="items-center hidden space-x-4 md:flex">
              {/* Search Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsSearchOpen(true)}
                className="p-2 transition-colors rounded-full hover:bg-gray-100"
              >
                <Search className="w-5 h-5 text-gray-700" />
              </motion.button>

              {/* Notifications */}
              <div ref={notificationRef} className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                  className="relative p-2 rounded-full hover:bg-gray-100"
                >
                  <Bell className="w-5 h-5 text-gray-700" />
                  {notifications.some(n => n.unread) && (
                    <span className="absolute w-2 h-2 bg-red-500 rounded-full top-1 right-1" />
                  )}
                </motion.button>

                <AnimatePresence>
                  {isNotificationOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 py-2 mt-2 bg-white rounded-lg shadow-lg w-80"
                    >
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`px-4 py-3 hover:bg-gray-50 cursor-pointer ${
                            notification.unread ? 'bg-blue-50/50' : ''
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <p className="text-sm font-medium text-gray-900">
                              {notification.title}
                            </p>
                            <span className="text-xs text-gray-500">{notification.time}</span>
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Profile Dropdown */}
              <div ref={profileRef} className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center p-2 space-x-2 rounded-full hover:bg-gray-100"
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                </motion.button>

                <AnimatePresence>
                  {isProfileDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 w-48 py-2 mt-2 bg-white rounded-lg shadow-lg"
                    >
                      {[
                        { label: 'Profile', icon: <User className="w-4 h-4" /> },
                        { label: 'Settings', icon: <Settings className="w-4 h-4" /> },
                        { label: 'Help', icon: <HelpCircle className="w-4 h-4" /> },
                        { label: 'Logout', icon: <LogOut className="w-4 h-4" /> },
                      ].map((item, idx) => (
                        <motion.button
                          key={idx}
                          whileHover={{ x: 5 }}
                          className="flex items-center w-full px-4 py-2 space-x-2 text-gray-700 hover:bg-gray-50"
                        >
                          {item.icon}
                          <span>{item.label}</span>
                        </motion.button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Login and Signup Buttons */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/login')}
                className="px-4 py-2 text-sm font-medium text-white transition-colors rounded-md bg-primary hover:bg-primary-dark"
              >
                <LogIn className="inline-block w-4 h-4 mr-2" />
                Login
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/signup')}
                className="px-4 py-2 text-sm font-medium transition-colors bg-white border rounded-md text-primary border-primary hover:bg-primary hover:text-white"
              >
                <UserPlus className="inline-block w-4 h-4 mr-2" />
                Sign Up
              </motion.button>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <AnimatePresence mode="wait">
                {isMobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90 }}
                    animate={{ rotate: 0 }}
                    exit={{ rotate: 90 }}
                  >
                    <X className="w-6 h-6 text-gray-700" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90 }}
                    animate={{ rotate: 0 }}
                    exit={{ rotate: -90 }}
                  >
                    <Menu className="w-6 h-6 text-gray-700" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="fixed inset-x-0 z-40 bg-white shadow-lg top-16"
          >
            <div className="px-4 py-2 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.id}
                  to={item.path}
                  className={`block py-2 text-gray-700 hover:text-primary ${
                    location.pathname === item.path ? 'font-semibold text-primary' : ''
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <div className="flex flex-col pt-2 space-y-2 border-t border-gray-200">
                <button
                  onClick={() => {
                    navigate('/login');
                    setIsMobileMenuOpen(false);
                  }}
                  className="py-2 text-sm font-medium text-white transition-colors rounded-md bg-primary hover:bg-primary-dark"
                >
                  <LogIn className="inline-block w-4 h-4 mr-2" />
                  Login
                </button>
                <button
                  onClick={() => {
                    navigate('/signup');
                    setIsMobileMenuOpen(false);
                  }}
                  className="py-2 text-sm font-medium transition-colors bg-white border rounded-md text-primary border-primary hover:bg-primary hover:text-white"
                >
                  <UserPlus className="inline-block w-4 h-4 mr-2" />
                  Sign Up
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Modal with Enhanced UX */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-20 bg-black/50"
            onClick={() => setIsSearchOpen(false)}
          >
            <motion.div
              initial={{ y: -50 }}
              animate={{ y: 0 }}
              exit={{ y: -50 }}
              className="w-full max-w-2xl bg-white rounded-lg shadow-lg"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-4">
                <div className="flex items-center px-4 py-2 space-x-2 bg-gray-100 rounded-lg">
                  <Search className="w-5 h-5 text-gray-400" />
                  <input
                    ref={searchRef}
                    type="text"
                    className="w-full bg-transparent focus:outline-none"
                    placeholder="Search anything..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="p-1 rounded-full hover:bg-gray-200"
                    >
                      <X className="w-4 h-4 text-gray-400" />
                    </button>
                  )}
                </div>

                {searchResults.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {searchResults.map((result, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex items-center p-2 space-x-2 rounded-lg cursor-pointer hover:bg-gray-100"
                      >
                        {result.type === 'page' && <BookOpen className="w-4 h-4 text-blue-500" />}
                        <span>{result.title}</span>
                      </motion.div>
                    ))}
                  </div>
                )}

                {searchQuery && searchResults.length === 0 && (
                  <div className="mt-4 text-center text-gray-500">
                    No results found for "{searchQuery}"
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;