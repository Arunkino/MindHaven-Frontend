import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import MainRoutes from './routes/MainRoutes';
import MentorRoutes from './routes/MentorRoutes';
import AdminRoutes from './routes/AdminRoutes';
import VideoCallWrapper from './components/VideoCall';
import NotFound from './components/NotFound';
import { setupAxiosInterceptors } from './utils/setupAxiosInterceptors';
import { setupWebSocket, disconnectWebSocket, isWebSocketConnected, reconnectWebSocket } from './features/websocketService';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

function App() {
  const dispatch = useDispatch();
  const currentUser = useSelector(state => state.user.currentUser);
  const isAuthenticated = useSelector(state => state.user.isAuthenticated);

  useEffect(() => {
    setupAxiosInterceptors();
  }, []);

  useEffect(() => {
    let checkConnectionInterval;
  
    if (isAuthenticated && currentUser && currentUser.id) {
      const socket = setupWebSocket(dispatch, currentUser.id);
  
      checkConnectionInterval = setInterval(() => {
        if (!isWebSocketConnected()) {
          reconnectWebSocket();
        }
      }, 10000);
    } else {
      disconnectWebSocket();
    }
  
    return () => {
      disconnectWebSocket();
      if (checkConnectionInterval) {
        clearInterval(checkConnectionInterval);
      }
    };
  }, [dispatch, currentUser, isAuthenticated]);

  return (
    <Router>
      <ToastContainer />
      <Routes>
        {/* Main routes with all its nested routes */}
        <Route path="/*" element={<MainRoutes />} />
        
        {/* Mentor routes */}
        <Route path="/mentor/*" element={<MentorRoutes />} />
        
        {/* Admin routes */}
        <Route path="/admin/*" element={<AdminRoutes />} />
        
        {/* Video call route */}
        <Route path="/video-call/:callId" element={<VideoCallWrapper />} />
      </Routes>
    </Router>
  );
}

export default App;