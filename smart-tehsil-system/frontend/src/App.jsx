import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Public Pages
import Home from './pages/public/Home';
import Services from './pages/public/Services';
import ServiceDetail from './pages/public/ServiceDetail';
import Documents from './pages/public/Documents';
import Villages from './pages/public/Villages';
import VillageDetail from './pages/public/VillageDetail';
import VillageMap from './pages/public/VillageMap';
import Schemes from './pages/public/Schemes';
import Notices from './pages/public/Notices';
import StaffDirectory from './pages/public/StaffDirectory';
import SearchPage from './pages/public/SearchPage';
import TrackApplication from './pages/public/TrackApplication';
import TrackComplaint from './pages/public/TrackComplaint';
import AIAssistant from './pages/public/AIAssistant';
import Login from './pages/public/Login';
import Register from './pages/public/Register';

// Citizen Pages
import CitizenDashboard from './pages/citizen/CitizenDashboard';
import CitizenApplications from './pages/citizen/CitizenApplications';
import NewApplication from './pages/citizen/NewApplication';
import CitizenAppointments from './pages/citizen/CitizenAppointments';
import CitizenTokens from './pages/citizen/CitizenTokens';
import CitizenComplaints from './pages/citizen/CitizenComplaints';
import CitizenNotifications from './pages/citizen/CitizenNotifications';
import CitizenProfile from './pages/citizen/CitizenProfile';

// Staff Pages
import StaffDashboard from './pages/staff/StaffDashboard';
import StaffQueue from './pages/staff/StaffQueue';

// Officer Pages
import OfficerDashboard from './pages/officer/OfficerDashboard';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminStaff from './pages/admin/AdminStaff';
import AdminServices from './pages/admin/AdminServices';
import AdminVillages from './pages/admin/AdminVillages';
import AdminSchemes from './pages/admin/AdminSchemes';
import AdminNotices from './pages/admin/AdminNotices';
import AdminApplications from './pages/admin/AdminApplications';
import AdminComplaints from './pages/admin/AdminComplaints';
import AdminAIKB from './pages/admin/AdminAIKB';

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <Routes>
            {/* PUBLIC ROUTES */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/services" element={<Services />} />
              <Route path="/services/:id" element={<ServiceDetail />} />
              <Route path="/documents" element={<Documents />} />
              <Route path="/villages" element={<Villages />} />
              <Route path="/villages/:id" element={<VillageDetail />} />
              <Route path="/villages/map" element={<VillageMap />} />
              <Route path="/schemes" element={<Schemes />} />
              <Route path="/notices" element={<Notices />} />
              <Route path="/staff" element={<StaffDirectory />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/track-application" element={<TrackApplication />} />
              <Route path="/track-complaint" element={<TrackComplaint />} />
              <Route path="/ai-assistant" element={<AIAssistant />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Route>

            {/* CITIZEN PORTAL */}
            <Route element={<DashboardLayout allowedRoles={['citizen', 'staff', 'officer', 'admin']} />}>
              <Route path="/citizen/dashboard" element={<CitizenDashboard />} />
              <Route path="/citizen/applications" element={<CitizenApplications />} />
              <Route path="/citizen/applications/new" element={<NewApplication />} />
              <Route path="/citizen/appointments" element={<CitizenAppointments />} />
              <Route path="/citizen/tokens" element={<CitizenTokens />} />
              <Route path="/citizen/complaints" element={<CitizenComplaints />} />
              <Route path="/citizen/notifications" element={<CitizenNotifications />} />
              <Route path="/citizen/profile" element={<CitizenProfile />} />
            </Route>

            {/* STAFF PORTAL */}
            <Route element={<DashboardLayout allowedRoles={['staff', 'admin']} />}>
              <Route path="/staff/dashboard" element={<StaffDashboard />} />
              <Route path="/staff/queue" element={<StaffQueue />} />
            </Route>

            {/* OFFICER PORTAL */}
            <Route element={<DashboardLayout allowedRoles={['officer', 'admin']} />}>
              <Route path="/officer/dashboard" element={<OfficerDashboard />} />
            </Route>

            {/* ADMIN PORTAL */}
            <Route element={<DashboardLayout allowedRoles={['admin']} />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/staff" element={<AdminStaff />} />
              <Route path="/admin/services" element={<AdminServices />} />
              <Route path="/admin/villages" element={<AdminVillages />} />
              <Route path="/admin/schemes" element={<AdminSchemes />} />
              <Route path="/admin/notices" element={<AdminNotices />} />
              <Route path="/admin/applications" element={<AdminApplications />} />
              <Route path="/admin/complaints" element={<AdminComplaints />} />
              <Route path="/admin/ai-knowledge" element={<AdminAIKB />} />
            </Route>

            {/* FALLBACK */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
