import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/user/userSlice';
import { resetChatState } from '../features/user/chatSlice';
import { fetchNotifications, markNotificationAsRead, clearAllNotifications } from '../features/notifications/notificationSlice';
import { Bell, Menu, X } from 'lucide-react';
import logo from '../assets/logo.svg';
import Notification from './Notification';
import { resetCallState } from '../features/videoCall/videoCallSlice';

function Header() {
  const { currentUser, isAuthenticated, role } = useSelector(state => state.user);
  const { notifications } = useSelector(state => state.notifications);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const notificationRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const headerRef = useRef(null);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchNotifications());
    }
  }, [isAuthenticated, dispatch]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Handle notification panel clicks
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      
      // Handle mobile menu clicks
      if (mobileMenuRef.current && 
          !mobileMenuRef.current.contains(event.target) && 
          !headerRef.current.contains(event.target)) {
        setShowMobileMenu(false);
      }
    };

    // Close mobile menu on route change
    const handleRouteChange = () => {
      setShowMobileMenu(false);
      setShowNotifications(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('popstate', handleRouteChange);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  const handleLogout = () => {
    setShowMobileMenu(false);
    dispatch(logout());
    dispatch(resetChatState());
    dispatch(resetCallState());
    navigate('/');
  };

  const handleMarkAsRead = (notificationId) => {
    dispatch(markNotificationAsRead(notificationId));
  };

  const handleClearAll = () => {
    dispatch(clearAllNotifications());
  };

  return (
    <header 
      ref={headerRef}
      className={`fixed top-0 w-full z-50 bg-${role === 'mentor' ? 'custom-mentor' : 'custom-bg'} text-white shadow-lg`}
    >
      <nav className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold flex items-center">
            <img src={logo} alt="Mind Haven Logo" className="h-8 w-auto mr-2 animate-pulse" />
          </Link>
          
          {/* Mobile menu button */}
          <button
            className="sm:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            aria-label="Toggle menu"
          >
            {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Desktop menu */}
          <ul className="hidden sm:flex items-center space-x-6">
            {isAuthenticated && (
              <>
                <Link to='dashboard'>
                  <li className="text-custom-text text-lg hover:text-custom-accent transition-colors">
                    Hi, {currentUser.role === 'admin' ? 'Admin' : currentUser.first_name}
                  </li>
                </Link>
                <li className="relative" ref={notificationRef}>
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                  >
                    <Bell />
                    {notifications.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                        {notifications.length}
                      </span>
                    )}
                  </button>
                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl overflow-hidden">
                      <div className="py-2">
                        <div className="flex justify-between items-center px-4 py-2 bg-gray-100">
                          <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
                          <button
                            onClick={handleClearAll}
                            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                          >
                            Clear All
                          </button>
                        </div>
                        <div className="max-h-96 overflow-y-auto">
                          {notifications.length === 0 ? (
                            <p className="px-4 py-3 text-sm text-gray-500">No new notifications</p>
                          ) : (
                            <ul>
                              {notifications.map(notification => (
                                <Notification 
                                  key={notification.id}
                                  notification={notification}
                                  onMarkAsRead={handleMarkAsRead}
                                />
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </li>
              </>
            )}
            <li><Link to="" className="hover:text-custom-accent transition-colors">Home</Link></li>
            {isAuthenticated ? (
              <li><button onClick={handleLogout} className="hover:text-custom-accent transition-colors">Logout</button></li>
            ) : (
              <>
                <li><Link to="/login" className="hover:text-custom-accent transition-colors">Login</Link></li>
                <li>
                  <Link to="/signup" className="bg-white text-custom-bg px-4 py-2 rounded-full hover:bg-custom-accent hover:text-white transition-colors">
                    Sign Up
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>

        {/* Mobile menu */}
        {showMobileMenu && (
          <div 
            ref={mobileMenuRef}
            className="absolute top-full left-0 right-0 bg-custom-bg sm:hidden border-t border-white/10 shadow-lg"
          >
            <ul className="flex flex-col py-2">
              {isAuthenticated && (
                <>
                  <Link 
                    to='dashboard' 
                    className="px-4 py-3 hover:bg-white/10 transition-colors"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    <li className="text-custom-text text-lg">
                      Hi, {currentUser.role === 'admin' ? 'Admin' : currentUser.first_name}
                    </li>
                  </Link>
                  <li className="px-4 py-3 hover:bg-white/10 transition-colors flex items-center justify-between">
                    <button 
                      onClick={() => {
                        setShowNotifications(!showNotifications);
                        setShowMobileMenu(false);
                      }}
                      className="flex items-center w-full"
                    >
                      <Bell className="mr-2" />
                      Notifications
                      {notifications.length > 0 && (
                        <span className="ml-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                          {notifications.length}
                        </span>
                      )}
                    </button>
                  </li>
                </>
              )}
              <Link 
                to="" 
                className="px-4 py-3 hover:bg-white/10 transition-colors block"
                onClick={() => setShowMobileMenu(false)}
              >
                Home
              </Link>
              {isAuthenticated ? (
                <button 
                  onClick={handleLogout}
                  className="px-4 py-3 hover:bg-white/10 transition-colors w-full text-left"
                >
                  Logout
                </button>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="px-4 py-3 hover:bg-white/10 transition-colors block"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    Login
                  </Link>
                  <Link 
                    to="/signup" 
                    className="mx-4 my-2 bg-white text-custom-bg px-4 py-2 rounded-full hover:bg-custom-accent hover:text-white transition-colors block text-center"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </ul>
          </div>
        )}
      </nav>
    </header>
  );
}

export default Header;