import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import { PublicLayout } from '../components/layout/PublicLayout';
import { AppLayout } from '../components/layout/AppLayout';

// Route Guards
import { ProtectedRoute } from './ProtectedRoute';
import { RoleBasedRoute } from './RoleBasedRoute';

// Constants
import { ROLES } from '../utils/constants';

// Public Pages
import { LandingPage } from '../pages/public/LandingPage';
import { LoginPage } from '../pages/public/LoginPage';
import { RegisterPage } from '../pages/public/RegisterPage';

// User Pages
import { UserDashboard } from '../pages/user/UserDashboard';
import { CreateReportPage } from '../pages/user/CreateReportPage';
import { UserReportsPage } from '../pages/user/UserReportsPage';
import { UserReportDetailPage } from '../pages/user/UserReportDetailPage';
import { UserProfilePage } from '../pages/user/UserProfilePage';

// Staff Pages
import { StaffDashboard } from '../pages/staff/StaffDashboard';
import { StaffReportsPage } from '../pages/staff/StaffReportsPage';
import { StaffReportDetailPage } from '../pages/staff/StaffReportDetailPage';
import { StaffProfilePage } from '../pages/staff/StaffProfilePage';

// Admin Pages
import { AdminDashboard } from '../pages/admin/AdminDashboard';
import { AdminVerificationPage } from '../pages/admin/AdminVerificationPage';
import { AdminReportsPage } from '../pages/admin/AdminReportsPage';
import { AdminReportDetailPage } from '../pages/admin/AdminReportDetailPage';
import { AdminUsersPage } from '../pages/admin/AdminUsersPage';
import { AdminStaffPage } from '../pages/admin/AdminStaffPage';
import { AdminProfilePage } from '../pages/admin/AdminProfilePage';

// Error Pages
import { ForbiddenPage } from '../pages/error/ForbiddenPage';
import { NotFoundPage } from '../pages/error/NotFoundPage';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* PUBLIC ROUTES */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* USER PROTECTED ROUTES */}
      <Route
        path="/user"
        element={
          <RoleBasedRoute allowedRoles={[ROLES.USER]}>
            <AppLayout />
          </RoleBasedRoute>
        }
      >
        <Route path="dashboard" element={<UserDashboard />} />
        <Route path="report/create" element={<CreateReportPage />} />
        <Route path="reports" element={<UserReportsPage />} />
        <Route path="reports/:id" element={<UserReportDetailPage />} />
        <Route path="profile" element={<UserProfilePage />} />
        <Route index element={<Navigate to="/user/dashboard" replace />} />
      </Route>

      {/* STAFF PROTECTED ROUTES */}
      <Route
        path="/staff"
        element={
          <RoleBasedRoute allowedRoles={[ROLES.STAFF]}>
            <AppLayout />
          </RoleBasedRoute>
        }
      >
        <Route path="dashboard" element={<StaffDashboard />} />
        <Route path="reports" element={<StaffReportsPage />} />
        <Route path="reports/:id" element={<StaffReportDetailPage />} />
        <Route path="profile" element={<StaffProfilePage />} />
        <Route index element={<Navigate to="/staff/dashboard" replace />} />
      </Route>

      {/* ADMIN PROTECTED ROUTES */}
      <Route
        path="/admin"
        element={
          <RoleBasedRoute allowedRoles={[ROLES.ADMIN]}>
            <AppLayout />
          </RoleBasedRoute>
        }
      >
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="verification" element={<AdminVerificationPage />} />
        <Route path="reports" element={<AdminReportsPage />} />
        <Route path="reports/:id" element={<AdminReportDetailPage />} />
        <Route path="users" element={<AdminUsersPage />} />
        <Route path="staff" element={<AdminStaffPage />} />
        <Route path="profile" element={<AdminProfilePage />} />
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
      </Route>

      {/* ERROR ROUTES */}
      <Route path="/403" element={<ForbiddenPage />} />
      <Route path="/404" element={<NotFoundPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
