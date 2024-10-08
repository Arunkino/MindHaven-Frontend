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

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchNotifications());
    }
  }, [isAuthenticated, dispatch]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
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
    <header className={`bg-${role === 'mentor' ? 'custom-mentor' : 'custom-bg'} text-white p-4 shadow-md`}>
      <nav className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold flex items-center">
          <img src={logo} alt="Mind Haven Logo" className="h-8 w-auto mr-2 animate-pulse" />

          {/* <span className="hidden sm:inline">Mind Haven</span> */}

        </Link>
        
        {/* Mobile menu button */}
        <button
          className="sm:hidden text-white"
          onClick={() => setShowMobileMenu(!showMobileMenu)}
        >
          {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop menu */}
        <ul className="hidden sm:flex space-x-6 items-center">
          {isAuthenticated && (
            <>
              <Link to='dashboard'>
                <li className="text-custom-text text-lg">
                  Hi, {currentUser.role === 'admin' ? 'Admin' : currentUser.first_name}
                </li>
              </Link>
              <li className="relative" ref={notificationRef}>
                {/* ... (keep existing notification button and dropdown) */}
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="hover:text-custom-accent transition-colors duration-300"
                >
                  <Bell />
                  {notifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                      {notifications.length}
                    </span>
                  )}
                </button>
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl overflow-hidden z-20">
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
                      {notifications.length === 0 ? (
                        <p className="px-4 py-3 text-sm text-gray-500">No new notifications</p>
                      ) : (
                        <ul className="max-h-96 overflow-y-auto">
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
                )}
              </li>
            </>
          )}
          <li><Link to="" className="hover:text-custom-accent transition-colors duration-300">Home</Link></li>
          {isAuthenticated ? (
            <li><button onClick={handleLogout} className="hover:text-custom-accent transition-colors duration-300">Logout</button></li>
          ) : (
            <>
              <li><Link to="/login" className="hover:text-custom-accent transition-colors duration-300">Login</Link></li>
              <li><Link to="/signup" className="bg-white text-custom-bg px-4 py-2 rounded-full hover:bg-custom-accent hover:text-white transition-colors duration-300">Sign Up</Link></li>
            </>
          )}
        </ul>

        {/* Mobile menu */}
        {showMobileMenu && (
          <div className="absolute top-16 left-0 right-0 bg-custom-bg sm:hidden z-50">
            <ul className="flex flex-col items-center py-4 space-y-4">
              {isAuthenticated && (
                <>
                  <Link to='dashboard' onClick={() => setShowMobileMenu(false)}>
                    <li className="text-custom-text text-lg">
                      Hi, {currentUser.role === 'admin' ? 'Admin' : currentUser.first_name}
                    </li>
                  </Link>
                  <li className="relative" ref={notificationRef} >
                    {/* ... (add mobile-friendly notification button and dropdown) */}
                    <button onClick={() => setShowMobileMenu(false)}>Bell</button>
                  </li>
                </>
              )}
              <li><Link to="" className="hover:text-custom-accent transition-colors duration-300">Home</Link></li>
              {isAuthenticated ? (
                <li><button onClick={handleLogout} className="hover:text-custom-accent transition-colors duration-300">Logout</button></li>
              ) : (
                <>
                  <li><Link to="/login" className="hover:text-custom-accent transition-colors duration-300">Login</Link></li>
                  <li><Link to="/signup" className="bg-white text-custom-bg px-4 py-2 rounded-full hover:bg-custom-accent hover:text-white transition-colors duration-300">Sign Up</Link></li>
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
