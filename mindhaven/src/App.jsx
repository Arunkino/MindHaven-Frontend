import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import MainRoutes from './routes/MainRoutes';
import MentorRoutes from './routes/MentorRoutes';
import AdminRoutes from './routes/AdminRoutes';
import { setupAxiosInterceptors } from './utils/setupAxiosInterceptors';
import { closeWebSocket, setupWebSocket } from './features/websocketService';
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
    let socket = null;
    let reconnectTimeout = null;

    const connectWebSocket = () => {
      if (isAuthenticated && currentUser && currentUser.id) {
        socket = setupWebSocket(dispatch, currentUser.id);
        
        socket.onclose = (event) => {
          console.log('WebSocket closed. Attempting to reconnect...');
          if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
            reconnectTimeout = setTimeout(() => {
              setReconnectAttempts(prev => prev + 1);
              connectWebSocket();
            }, 5000); // Wait 5 seconds before attempting to reconnect
          } else {
            toast.error('Unable to establish WebSocket connection. Please refresh the page.');
          }
        };

        socket.onerror = (error) => {
          console.error('WebSocket error:', error);
          toast.error('WebSocket error occurred. Please check your connection.');
        };
      }
    };

    connectWebSocket();

    return () => {
      if (socket) {
        closeWebSocket();
      }
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
      }
    };
  }, [dispatch, currentUser, isAuthenticated, reconnectAttempts]);

  return (
    <PersistGate loading={null} persistor={persistor}>
      <Router>
        <ToastContainer />
        <Routes>
          <Route path="/*" element={<MainRoutes />} />
          <Route path="/mentor/*" element={<MentorRoutes />} />
          <Route path="/admin/*" element={<AdminRoutes />} />
          <Route path="/video-call/:callId" element={<VideoCallWrapper />} />
        </Routes>
      </Router>
    </PersistGate>
  );
}

export default App;