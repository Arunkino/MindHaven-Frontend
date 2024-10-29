import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import UserDashboard from '../pages/UserDashboard';
import ProtectedRoute from './ProtectedRoute';
import NotFound from '../components/NotFound';

function MainRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        <Route element={<ProtectedRoute allowedRoles={["normal"]} />}>
          <Route path="dashboard/*" element={<UserDashboard />} />
        </Route>
      </Route>
      {/* Handle 404 for main routes */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default MainRoutes;