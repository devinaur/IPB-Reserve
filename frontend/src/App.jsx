import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminLogin from './pages/AdminLogin/AdminLogin';
import UserLogin from './pages/UserLogin/UserLogin';
import Dashboard from './pages/Dashboard/Dashboard';
import Fasilitas from './pages/Fasilitas/Fasilitas';
import PeminjamanSaya from './pages/PeminjamanSaya/PeminjamanSaya';
import PengajuanSaya from './pages/PengajuanSaya/PengajuanSaya';
import FacilityDetail from './pages/FacilityDetail/FacilityDetail';
import Riwayat from './pages/Riwayat/Riwayat';
import ReservationForm from './pages/ReservationForm/ReservationForm';
import UserProfile from './pages/UserProfile/UserProfile';

// Admin Pages
import AdminDashboard from './pages/AdminDashboard/AdminDashboard';
import AdminFasilitas from './pages/AdminFasilitas/AdminFasilitas';
import AdminPeminjaman from './pages/AdminPeminjaman/AdminPeminjaman';
import AdminPengajuan from './pages/AdminPengajuan/AdminPengajuan';
import AdminRiwayat from './pages/AdminRiwayat/AdminRiwayat';
import AdminTambahFasilitas from './pages/AdminTambahFasilitas/AdminTambahFasilitas';
import AdminEditFasilitas from './pages/AdminEditFasilitas/AdminEditFasilitas';

import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<UserLogin />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/" element={<Fasilitas />} />
          <Route path="/fasilitas" element={<Fasilitas />} />
          <Route path="/fasilitas/:id" element={<FacilityDetail />} />
          
          {/* User Protected Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute><Dashboard /></ProtectedRoute>
          } />
          <Route path="/peminjaman-saya" element={
            <ProtectedRoute><PeminjamanSaya /></ProtectedRoute>
          } />
          <Route path="/pengajuan-saya" element={
            <ProtectedRoute><PengajuanSaya /></ProtectedRoute>
          } />
          <Route path="/riwayat" element={
            <ProtectedRoute><Riwayat /></ProtectedRoute>
          } />
          <Route path="/reservasi" element={
            <ProtectedRoute><ReservationForm /></ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute><UserProfile /></ProtectedRoute>
          } />

          {/* Admin Protected Routes */}
          <Route path="/admin/dashboard" element={
            <ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>
          } />
          <Route path="/admin/fasilitas" element={
            <ProtectedRoute requiredRole="admin"><AdminFasilitas /></ProtectedRoute>
          } />
          <Route path="/admin/fasilitas/tambah" element={
            <ProtectedRoute requiredRole="admin"><AdminTambahFasilitas /></ProtectedRoute>
          } />
          <Route path="/admin/fasilitas/edit/:id" element={
            <ProtectedRoute requiredRole="admin"><AdminEditFasilitas /></ProtectedRoute>
          } />
          <Route path="/admin/peminjaman" element={
            <ProtectedRoute requiredRole="admin"><AdminPeminjaman /></ProtectedRoute>
          } />
          <Route path="/admin/pengajuan" element={
            <ProtectedRoute requiredRole="admin"><AdminPengajuan /></ProtectedRoute>
          } />
          <Route path="/admin/riwayat" element={
            <ProtectedRoute requiredRole="admin"><AdminRiwayat /></ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
