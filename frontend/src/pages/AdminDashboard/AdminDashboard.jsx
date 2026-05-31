import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout/Layout';
import DashboardCard from '../../components/DashboardCard/DashboardCard';
import { reservationService } from '../../services/api';
import './AdminDashboard.css';

const getUserProfile = (email, role) => {
  if (!email) return { name: 'Pengguna Sistem', description: 'Mahasiswa' };
  const prefix = email.split('@')[0];
  const name = prefix.charAt(0).toUpperCase() + prefix.slice(1);
  
  let desc = 'Mahasiswa';
  if (role === 'ADMIN' || email.includes('admin')) desc = 'Administrator';
  else if (role === 'DOSEN') desc = 'Dosen';
  else if (role === 'ORGANISASI') desc = 'Organisasi';
  
  return { name, description: desc };
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const data = await reservationService.getAllReservations();
      // Sort: newest first
      const sorted = [...data].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setReservations(sorted);
      setError('');
    } catch (err) {
      console.error('Error fetching reservations:', err);
      setError('Gagal memuat data reservasi.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  // Compute stats
  const pendingCount = reservations.filter(r => r.status === 'MENUNGGU').length;
  const activeCount = reservations.filter(r => r.status === 'DISETUJUI').length;
  const totalCount = reservations.length;
  const reportedIssues = reservations.filter(r => r.damage_report).length;

  return (
    <Layout>
      <div className="admin-dashboard-wrapper">
        <header className="admin-dashboard-header">
          <div>
            <h1 className="admin-dashboard-title">Dashboard Admin</h1>
            <p className="admin-dashboard-subtitle">Monitor and kelola seluruh pengajuan reservasi di sistem.</p>
          </div>
        </header>

        <div className="admin-stats-grid">
          <DashboardCard 
            title="Perlu Disetujui" 
            value={pendingCount} 
            subtitle="Menunggu verifikasi admin" 
            icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#EA580C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>}
            iconBgColor="#FFF7ED"
          />
          <DashboardCard 
            title="Peminjaman Aktif" 
            value={activeCount} 
            subtitle="Fasilitas sedang disewa" 
            icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>}
            iconBgColor="#F0FDF4"
          />
          <DashboardCard 
            title="Pemanfaatan Fasilitas" 
            value={totalCount} 
            subtitle="Total seluruh pengajuan" 
            icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>}
            iconBgColor="#EFF6FF"
          />
          <DashboardCard 
            title="Kerusakan Fasilitas" 
            value={reportedIssues} 
            subtitle="Nilai Aman" 
            icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>}
            iconBgColor="#FEF2F2"
          />
        </div>

        <section className="request-management-section">
          <div className="section-header">
            <h2>Request Management</h2>
            <button className="btn-refresh" onClick={fetchReservations} disabled={loading}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={loading ? 'spin' : ''}><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"></path></svg>
              Refresh
            </button>
          </div>

          {error && <p className="error-message">{error}</p>}

          <div className="table-responsive">
            {loading ? (
              <p className="loading-message">Memuat daftar pengajuan...</p>
            ) : reservations.length > 0 ? (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>REQ ID</th>
                    <th>PEMOHON</th>
                    <th>FASILITAS</th>
                    <th>TANGGAL PEMINJAMAN</th>
                    <th>TUJUAN</th>
                    <th>STATUS</th>
                    <th>AKSI</th>
                  </tr>
                </thead>
                <tbody>
                  {reservations.map((item) => {
                    const profile = getUserProfile(item.user_email, item.user_role);
                    const formattedStart = new Date(item.start_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
                    const formattedTime = `${new Date(item.start_date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - ${new Date(item.end_date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
                    
                    return (
                      <tr key={item.id}>
                        <td className="col-req-id">#REQ-{String(item.id).padStart(3, '0')}</td>
                        <td className="col-user">
                          <div className="user-info-cell">
                            <span className="user-name-text">{profile.name}</span>
                            <span className="user-role-text">{profile.description}</span>
                          </div>
                        </td>
                        <td className="col-facility">{item.facility_name}</td>
                        <td className="col-date">
                          <div className="date-info-cell">
                            <span className="date-text">{formattedStart}</span>
                            <span className="time-text">{formattedTime}</span>
                          </div>
                        </td>
                        <td className="col-purpose">{item.purpose}</td>
                        <td className="col-status">
                          <span className={`status-badge ${item.status}`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="col-actions">
                          {item.status === 'MENUNGGU' ? (
                            <button 
                              className="btn-kelola" 
                              onClick={() => navigate('/admin/pengajuan')}
                              style={{
                                padding: '0.4rem 0.8rem',
                                backgroundColor: '#0f172a',
                                color: '#ffffff',
                                border: 'none',
                                borderRadius: '6px',
                                fontSize: '0.85rem',
                                cursor: 'pointer',
                                fontWeight: '500',
                                transition: 'background-color 0.15s'
                              }}
                              onMouseOver={(e) => e.target.style.backgroundColor = '#334155'}
                              onMouseOut={(e) => e.target.style.backgroundColor = '#0f172a'}
                            >
                              Kelola
                            </button>
                          ) : (
                            <span className="action-completed">-</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <p className="empty-message">Belum ada pengajuan reservasi.</p>
            )}
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
