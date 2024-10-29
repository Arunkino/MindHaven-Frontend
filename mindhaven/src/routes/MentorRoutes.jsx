import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MentorLayout from '../layouts/MentorLayout';
import Home from '../pages/Home';
import Login from '../pages/Login';
import MentorSignup from '../pages/mentor/MentorSignup';
import MentorDashboard from '../pages/mentor/MentorDashboard';
import ProtectedRoute from './ProtectedRoute';
import ScheduleAvailability from '../pages/mentor/ScheduleAvailability';
import NotFound from '../components/NotFound';

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
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default MentorRoutes;
