import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import MainRoutes from './routes/MainRoutes';
import MentorRoutes from './routes/MentorRoutes';
import AdminRoutes from './routes/AdminRoutes';
import { setupAxiosInterceptors } from './utils/setupAxiosInterceptors';
import { setupWebSocket, disconnectWebSocket, isWebSocketConnected, reconnectWebSocket } from './features/websocketService';
import VideoCallWrapper from './components/VideoCall';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { persistor } from './app/store';

function App() {
  const dispatch = useDispatch();
  const currentUser = useSelector(state => state.user.currentUser);
  const isAuthenticated = useSelector(state => state.user.isAuthenticated);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const MAX_RECONNECT_ATTEMPTS = 5;

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
        <Route path="/*" element={<MainRoutes />} />
        <Route path="/mentor/*" element={<MentorRoutes />} />
        <Route path="/admin/*" element={<AdminRoutes />} />
        <Route path="/video-call/:callId" element={<VideoCallWrapper />} />
      </Routes>
    </Router>
  );
}

export default App;