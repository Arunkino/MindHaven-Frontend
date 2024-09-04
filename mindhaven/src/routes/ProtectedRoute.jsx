import React, { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/user/userSlice';
import authService from '../utils/authService';
import { LoadingSpinner } from '../components/LoadingSpinner';


const ProtectedRoute = ({ allowedRoles }) => {
  const { isAuthenticated, role, accessToken } = useSelector(state => state.user);
  const dispatch = useDispatch();

  // useEffect(() => {
  //   const verifyToken = async () => {
  //     if (accessToken) {
  //       try {
  //         const result = await authService.verifyToken(accessToken);
  //         if (!result.success) {
  //           dispatch(logout());
  //         }
  //       } catch (error) {
  //         console.error('Token verification failed:', error);
  //         dispatch(logout());
  //       }
  //     }
  //   };

  //   verifyToken();
  // }, [accessToken, dispatch]);

  

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(role)) {
    switch (role) {
      case 'admin':
        return <Navigate to="/admin/dashboard" replace />;
      case 'mentor':
        return <Navigate to="/mentor/dashboard" replace />;
      case 'normal':
        return <Navigate to="/dashboard" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;