import React, { useEffect } from 'react';
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
import { ToastContainer } from 'react-toastify';
import { persistor } from './app/store';

function App() {
  const dispatch = useDispatch();
  const currentUser = useSelector(state => state.user.user);
  const isAuthenticated = useSelector(state => state.user.isAuthenticated);

  useEffect(() => {
    setupAxiosInterceptors();
  }, []);

  useEffect(() => {
    if (isAuthenticated && currentUser && currentUser.id) {
      const socket = setupWebSocket(dispatch, currentUser.id);
      console.log('socket:', socket);

      return () => {
        closeWebSocket();
      };
    }
  }, [dispatch, currentUser, isAuthenticated]);

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