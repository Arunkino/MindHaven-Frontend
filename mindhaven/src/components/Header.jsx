import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/user/userSlice';
import { resetChatState } from '../features/user/chatSlice';
import { fetchNotifications, markNotificationAsRead, clearAllNotifications } from '../features/notifications/notificationSlice';
import { Bell, Menu, X, ChevronRight } from 'lucide-react';
import { resetCallState } from '../features/videoCall/videoCallSlice';
import logo from '../assets/logo.svg';

const Header = () => {
  const { currentUser, isAuthenticated, role } = useSelector(state => state.user);
  const { notifications } = useSelector(state => state.notifications);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const notificationRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const headerRef = useRef(null);

  // Enhanced click outside detection
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if click is outside both the menu button and menu content
      const isOutsideMenu = mobileMenuRef.current && 
        !mobileMenuRef.current.contains(event.target) &&
        !headerRef.current.contains(event.target);
      
      // Check if click is on the backdrop
      const isBackdropClick = event.target.classList.contains('mobile-menu-backdrop');
      
      if (isOutsideMenu || isBackdropClick) {
        setShowMobileMenu(false);
      }

      // Handle notifications panel
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    // Handle escape key
    const handleEscKey = (event) => {
      if (event.key === 'Escape') {
        setShowMobileMenu(false);
        setShowNotifications(false);
      }
    };

    // Handle scroll lock
    if (showMobileMenu) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscKey);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'unset';
    };
  }, [showMobileMenu]);

  // Handle route changes
  useEffect(() => {
    const handleRouteChange = () => {
      setShowMobileMenu(false);
      setShowNotifications(false);
    };

    window.addEventListener('popstate', handleRouteChange);
    return () => window.removeEventListener('popstate', handleRouteChange);
  }, []);

  const handleLogout = () => {
    setShowMobileMenu(false);
    dispatch(logout());
    dispatch(resetChatState());
    dispatch(resetCallState());
    navigate('/');
  };

  return (
    <div className="relative">
      <header 
        ref={headerRef}
        className={`fixed top-0 w-full z-50 bg-${role === 'mentor' ? 'custom-mentor' : 'custom-bg'} text-white shadow-lg`}
      >
        <nav className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <Link to="/" className="text-2xl font-bold flex items-center">
              <img src={logo} alt="Mind Haven Logo" className="h-8 w-auto mr-2" />
            </Link>
            
            {/* Animated mobile menu button */}
            <button
              className="sm:hidden p-2 hover:bg-white/10 rounded-lg transition-all duration-300 transform active:scale-95"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              aria-label="Toggle menu"
              aria-expanded={showMobileMenu}
            >
              <div className="relative w-6 h-6">
                <div className={`absolute inset-0 transition-all duration-300 transform ${showMobileMenu ? 'rotate-180 opacity-0' : 'rotate-0 opacity-100'}`}>
                  <Menu size={24} />
                </div>
                <div className={`absolute inset-0 transition-all duration-300 transform ${showMobileMenu ? 'rotate-0 opacity-100' : '-rotate-180 opacity-0'}`}>
                  <X size={24} />
                </div>
              </div>
            </button>

            {/* Desktop menu */}
            <ul className="hidden sm:flex items-center space-x-6">
              {/* ... (desktop menu items remain unchanged) ... */}
            </ul>
          </div>

          {/* Enhanced Mobile menu with backdrop */}
          <div 
            className={`fixed inset-0 mobile-menu-backdrop bg-black/50 transition-opacity duration-300 sm:hidden ${
              showMobileMenu ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
            style={{ marginTop: '60px' }}
            aria-hidden={!showMobileMenu}
          >
            <div
              ref={mobileMenuRef}
              className={`absolute top-0 left-0 right-0 bg-white transform transition-all duration-300 ease-out ${
                showMobileMenu ? 'translate-y-0 shadow-lg' : '-translate-y-full'
              }`}
            >
              <ul className="flex flex-col divide-y divide-gray-100">
                {isAuthenticated && (
                  <>
                    <li>
                      <Link 
                        to="dashboard"
                        className="flex items-center justify-between px-4 py-3 text-gray-800 hover:bg-blue-50 active:bg-blue-100 transition-colors"
                        onClick={() => setShowMobileMenu(false)}
                      >
                        <span className="text-lg">Hi, {currentUser.role === 'admin' ? 'Admin' : currentUser.first_name}</span>
                        <ChevronRight className="text-gray-400" size={20} />
                      </Link>
                    </li>
                    <li>
                      <button 
                        onClick={() => {
                          setShowNotifications(!showNotifications);
                          setShowMobileMenu(false);
                        }}
                        className="flex items-center justify-between w-full px-4 py-3 text-gray-800 hover:bg-blue-50 active:bg-blue-100 transition-colors"
                      >
                        <div className="flex items-center">
                          <Bell className="mr-2" />
                          <span>Notifications</span>
                        </div>
                        {notifications.length > 0 && (
                          <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                            {notifications.length}
                          </span>
                        )}
                      </button>
                    </li>
                  </>
                )}
                <li>
                  <Link 
                    to=""
                    className="flex items-center justify-between px-4 py-3 text-gray-800 hover:bg-blue-50 active:bg-blue-100 transition-colors"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    <span>Home</span>
                    <ChevronRight className="text-gray-400" size={20} />
                  </Link>
                </li>
                {isAuthenticated ? (
                  <li>
                    <button 
                      onClick={handleLogout}
                      className="w-full px-4 py-3 text-left text-gray-800 hover:bg-blue-50 active:bg-blue-100 transition-colors"
                    >
                      Logout
                    </button>
                  </li>
                ) : (
                  <>
                    <li>
                      <Link 
                        to="/login"
                        className="flex items-center justify-between px-4 py-3 text-gray-800 hover:bg-blue-50 active:bg-blue-100 transition-colors"
                        onClick={() => setShowMobileMenu(false)}
                      >
                        <span>Login</span>
                        <ChevronRight className="text-gray-400" size={20} />
                      </Link>
                    </li>
                    <li>
                      <Link 
                        to="/mentor"
                        className="flex items-center justify-between px-4 py-3 text-gray-500 hover:bg-blue-50 active:bg-blue-100 transition-colors"
                        onClick={() => setShowMobileMenu(false)}
                      >
                        <span>Are You a Mentor?</span>
                        <ChevronRight className="text-gray-400" size={20} />
                      </Link>
                    </li>
                    <li className="p-4">
                      <Link 
                        to="/signup"
                        className="block w-full py-3 px-6 text-center text-white bg-blue-600 rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors shadow-sm"
                        onClick={() => setShowMobileMenu(false)}
                      >
                        Sign Up
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </nav>
      </header>
    </div>
  );
};

export default Header;