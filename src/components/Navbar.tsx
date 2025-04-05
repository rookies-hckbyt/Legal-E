// src/components/Navbar.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { 
  Scale, 
  Menu, 
  X, 
  ChevronDown, 
  Search,
  Bell,
  User,
  Settings,
  LogOut,
  HelpCircle,
  BookOpen,
  MessageSquare,
  Users,
  FileText,
  Sparkles,
  Archive,
  Clock,
  Star
} from 'lucide-react';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'New case assigned', time: '2m ago', unread: true },
    { id: 2, title: 'Document review pending', time: '1h ago', unread: true },
    { id: 3, title: 'Meeting scheduled', time: '3h ago', unread: false },
  ]);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string | null>(null);
  
  const { scrollY } = useScroll();
  const location = useLocation();
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
      label: 'Solutions',
      id: 'solutions',
      dropdownItems: [
        { 
          label: 'For Judges', 
          path: '/judge', 
          icon: <Scale className="w-4 h-4" />,
          description: 'Streamline case management and decision making'
        },
        { 
          label: 'For Lawyers', 
          path: '/lawyer', 
          icon: <BookOpen className="w-4 h-4" />,
          description: 'Enhanced legal research and document preparation'
        },
        { 
          label: 'For Users', 
          path: '/user', 
          icon: <User className="w-4 h-4" />,
          description: 'Easy access to legal services and case tracking'
        },
      ]
    },
    {
      label: 'Resources',
      id: 'resources',
      dropdownItems: [
        { 
          label: 'Documentation', 
          path: '/docs', 
          icon: <BookOpen className="w-4 h-4" />,
          description: 'Detailed guides and API documentation'
        },
        { 
          label: 'Community', 
          path: '/community', 
          icon: <Users className="w-4 h-4" />,
          description: 'Join our growing legal tech community'
        },
        { 
          label: 'Tutorials', 
          path: '/tutorials', 
          icon: <MessageSquare className="w-4 h-4" />,
          description: 'Learn through interactive tutorials'
        },
      ]
    },
    { 
      label: 'Pricing',
      id: 'pricing',
      features: [
        { icon: <Star />, label: 'Premium Features' },
        { icon: <Clock />, label: 'Real-time Support' },
        { icon: <Archive />, label: 'Unlimited Storage' },
      ]
    },
  ];

  const searchResults = [
    { type: 'page', title: 'Dashboard', path: '/dashboard' },
    { type: 'doc', title: 'Legal Documentation', path: '/docs' },
    { type: 'feature', title: 'AI Analysis', path: '/features' },
  ].filter(result => 
    searchQuery && result.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const DropdownContent = ({ item }: { item: any }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg overflow-hidden"
    >
      <div className="p-4">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
          {item.label}
        </h3>
        <div className="space-y-4">
          {item.dropdownItems?.map((dropdownItem: any, idx: number) => (
            <Link
              key={idx}
              to={dropdownItem.path}
              className="group flex items-start p-2 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                {dropdownItem.icon}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">{dropdownItem.label}</p>
                <p className="text-xs text-gray-500">{dropdownItem.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
      {item.features && (
        <div className="bg-gray-50 p-4">
          <div className="grid grid-cols-2 gap-4">
            {item.features.map((feature: any, idx: number) => (
              <div key={idx} className="flex items-center space-x-2 text-sm text-gray-600">
                {feature.icon}
                <span>{feature.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
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

        <div className="container mx-auto px-4">
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
                className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent"
              >
                Legal-E
              </motion.span>
            </Link>

            {/* Desktop Navigation with Mega Menu */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <div
                  key={item.id}
                  className="relative"
                  onMouseEnter={() => setActiveTab(item.id)}
                  onMouseLeave={() => setActiveTab(null)}
                >
                  <button className="flex items-center space-x-1 text-gray-700 hover:text-primary">
                    <span>{item.label}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${
                      activeTab === item.id ? 'rotate-180' : ''
                    }`} />
                  </button>

                  <AnimatePresence>
                    {activeTab === item.id && <DropdownContent item={item} />}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            {/* Right Section with Notifications and Profile */}
            <div className="hidden md:flex items-center space-x-4">
              {/* Search Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsSearchOpen(true)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <Search className="w-5 h-5 text-gray-700" />
              </motion.button>

              {/* Notifications */}
              <div ref={notificationRef} className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                  className="p-2 hover:bg-gray-100 rounded-full relative"
                >
                  <Bell className="w-5 h-5 text-gray-700" />
                  {notifications.some(n => n.unread) && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                  )}
                </motion.button>

                <AnimatePresence>
                  {isNotificationOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-2"
                    >
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`px-4 py-3 hover:bg-gray-50 cursor-pointer ${
                            notification.unread ? 'bg-blue-50/50' : ''
                          }`}
                        >
                          <div className="flex justify-between items-start">
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
                  className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-full"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                </motion.button>

                <AnimatePresence>
                  {isProfileDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2"
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
                          className="w-full flex items-center space-x-2 px-4 py-2 hover:bg-gray-50 text-gray-700"
                        >
                          {item.icon}
                          <span>{item.label}</span>
                        </motion.button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="md:hidden p-2"
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

      {/* Search Modal with Enhanced UX */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center pt-20 px-4"
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
                <div className="flex items-center space-x-2 bg-gray-100 rounded-lg px-4 py-2">
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
                      className="p-1 hover:bg-gray-200 rounded-full"
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
                        className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg cursor-pointer"
                      >
                        {result.type === 'page' && <BookOpen className="w-4 h-4 text-blue-500" />}
                        {result.type === 'doc' && <FileText className="w-4 h-4 text-green-500" />}
                        {result.type === 'feature' && <Sparkles className="w-4 h-4 text-purple-500" />}
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