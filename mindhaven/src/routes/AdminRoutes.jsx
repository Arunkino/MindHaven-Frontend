import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import MainLayout from '../layouts/MainLayout';
import Home from '../pages/Home';
import Login from '../pages/Login';
import AdminDashboard from '../pages/admin/AdminDashboard'; 
import ProtectedRoute from './ProtectedRoute';


function AdminRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />

        <Route element={<ProtectedRoute allowedRoles={['admin']}/>} >
          <Route path="dashboard" element={<AdminDashboard />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default AdminRoutes;