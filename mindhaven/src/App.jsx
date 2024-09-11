import React, { useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import MainRoutes from './routes/MainRoutes';
import MentorRoutes from './routes/MentorRoutes';
import AdminRoutes from './routes/AdminRoutes';
import { setupAxiosInterceptors } from './utils/setupAxiosInterceptors';
import { setupWebSocket, disconnectWebSocket, isWebSocketConnected, reconnectWebSocket } from './features/websocketService';
import VideoCallWrapper from './components/VideoCall';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

function App() {
  const dispatch = useDispatch();
  const currentUser = useSelector(state => state.user.currentUser);
  const isAuthenticated = useSelector(state => state.user.isAuthenticated);

  const connectWebSocket = useCallback(() => {
    if (isAuthenticated && currentUser && currentUser.id) {
      setupWebSocket(dispatch, currentUser.id);
    }
  }, [dispatch, currentUser, isAuthenticated]);

  useEffect(() => {
    setupAxiosInterceptors();
  }, []);

  useEffect(() => {
    if (isAuthenticated && currentUser) {
      connectWebSocket();
    } else {
      disconnectWebSocket();
    }

    return () => {
      disconnectWebSocket();
    };
  }, [isAuthenticated, currentUser, connectWebSocket]);

  useEffect(() => {
    const checkConnection = setInterval(() => {
      if (isAuthenticated && currentUser && !isWebSocketConnected()) {
        reconnectWebSocket();
      }
    }, 10000); // Check every 10 seconds

    return () => clearInterval(checkConnection);
  }, [isAuthenticated, currentUser]);

  return (
    <Router>
      <ToastContainer />
      <Routes>
        <Route path="/*" element={<MainRoutes />} />
        <Route path="/mentor/*" element={<MentorRoutes />} />
        <Route path="/admin/*" element={<AdminRoutes />} />
        <Route path="/video-call/:callId" element={<VideoCallWrapper />} />
      </Routes>
    </Router>
  );
}

export default App;