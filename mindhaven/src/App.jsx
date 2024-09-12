import React, { useCallback, useEffect, useState } from 'react';
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

  const connectWebSocket = useCallback(() => {
    if (isAuthenticated && currentUser && currentUser.id) {
      setupWebSocket(dispatch, currentUser.id);
    }
  }, [dispatch, currentUser, isAuthenticated]);

  useEffect(() => {
  console.log("All env variables:", import.meta.env);
  console.log("Agora App ID:", import.meta.env.VITE_AGORA_APP_ID);
}, []);
  
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
          if (!isAuthenticated){
            consol.log("not logged in");
            return;
          }
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
        // closeWebSocket();
        socket.close();
      }
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
      }
    };
  }, [dispatch, currentUser, isAuthenticated, reconnectAttempts]);

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
