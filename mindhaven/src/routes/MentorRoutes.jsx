import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MentorLayout from '../layouts/MentorLayout';
import Home from '../pages/Home';
import Login from '../pages/Login';
import MentorSignup from '../pages/mentor/MentorSignup';
import MentorDashboard from '../pages/mentor/MentorDashboard';
import ProtectedRoute from './ProtectedRoute';
import ScheduleAvailability from '../pages/mentor/ScheduleAvailability';

function MentorRoutes() {
  return (
    <Routes>
      <Route element={<MentorLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<MentorSignup />} />
        <Route element={<ProtectedRoute allowedRoles={['mentor']} />}>
        <Route path="dashboard" element={<MentorDashboard />}>
          <Route path="schedule_availability" element={<ScheduleAvailability />} />
        </Route>
        </Route>
          
      </Route>
    </Routes>
  );
}

export default MentorRoutes;
