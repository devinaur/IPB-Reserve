import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout/Layout';
import DashboardCard from '../../components/DashboardCard/DashboardCard';
import { reservationService } from '../../services/api';
import '../AdminDashboard/AdminDashboard.css';

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

const AdminRiwayat = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [analytics, setAnalytics] = useState({
    total: 0,
    mostUsed: '-',
    approvalRate: 0,
    monthlyStats: []
  });

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const data = await reservationService.getAllReservations();
      
      // Compute analytics on all data
      const total = data.length;
      
      // Find most used facility
      const facilityCounts = {};
      let mostUsed = '-';
      let maxCount = 0;
      data.forEach(r => {
        if (r.facility_name) {
          facilityCounts[r.facility_name] = (facilityCounts[r.facility_name] || 0) + 1;
          if (facilityCounts[r.facility_name] > maxCount) {
            maxCount = facilityCounts[r.facility_name];
            mostUsed = r.facility_name;
          }
        }
      });

      // Compute approval rate
      const approvedCount = data.filter(r => r.status === 'DISETUJUI').length;
      const approvalRate = total > 0 ? Math.round((approvedCount / total) * 100) : 0;

      // Compute monthly stats for chart
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun'];
      const monthlyStats = months.map(m => ({ name: m, count: 0 }));
      
      data.forEach(r => {
        const d = new Date(r.start_date);
        const monthIndex = d.getMonth();
        if (monthIndex < 6) {
          monthlyStats[monthIndex].count += 1;
        }
      });

      setAnalytics({ total, mostUsed, approvalRate, monthlyStats });

      // Filter out pending, or display everything including approved and rejected for history.
      const history = data.filter(r => r.status === 'DISETUJUI' || r.status === 'DITOLAK');
      // Sort: newest first
      history.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setReservations(history);
      setError('');
    } catch (err) {
      console.error('Error fetching reservations:', err);
      setError('Gagal memuat riwayat peminjaman.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  return (
    <Layout>
      <div className="admin-dashboard-wrapper">
        <header className="admin-dashboard-header">
          <div>
            <h1 className="admin-dashboard-title">Riwayat Peminjaman & Analitik</h1>
            <p className="admin-dashboard-subtitle">Daftar arsip seluruh pengajuan reservasi dan analitik penggunaan sistem.</p>
          </div>
        </header>

        <section className="analytics-section">
          <div className="riwayat-stats-grid">
            <DashboardCard 
              title="Total Pengajuan Sistem" 
              value={loading ? '...' : analytics.total} 
              subtitle="Seluruh reservasi terdaftar" 
              icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>}
              iconBgColor="#EFF6FF"
            />
            <DashboardCard 
              title="Pemanfaatan Terbanyak" 
              value={loading ? '...' : analytics.mostUsed} 
              subtitle="Fasilitas paling sering dipinjam" 
              icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>}
              iconBgColor="#FFFBEB"
            />
            <DashboardCard 
              title="Tingkat Persetujuan" 
              value={loading ? '...' : `${analytics.approvalRate}%`} 
              subtitle="Persentase reservasi diterima" 
              icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>}
              iconBgColor="#F0FDF4"
            />
          </div>
        </section>

        <section className="chart-section" style={{ marginTop: '32px', marginBottom: '32px' }}>
          <h3 style={{ fontSize: '12px', fontWeight: 700, color: '#012A58', marginBottom: '16px', letterSpacing: '0.5px' }}>STATISTIK BULANAN</h3>
          <div className="chart-container">
            <div className="chart-bars">
              {analytics.monthlyStats.map((stat, idx) => {
                const maxCount = Math.max(...analytics.monthlyStats.map(s => s.count), 5);
                const heightPercent = (stat.count / maxCount) * 100;
                
                return (
                  <div className="bar-group" key={idx}>
                    <div className="bar-wrapper">
                      <div className="bar-fill" style={{ height: `${heightPercent}%` }}>
                        <span className="bar-tooltip">{stat.count} Pengajuan</span>
                      </div>
                    </div>
                    <span className="bar-label">{stat.name}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="request-management-section">
          <div className="section-header">
            <h2>Arsip Riwayat</h2>
            <button className="btn-refresh" onClick={fetchReservations} disabled={loading}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={loading ? 'spin' : ''}><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"></path></svg>
              Refresh
            </button>
          </div>

          {error && <p className="error-message">{error}</p>}

          <div className="table-responsive">
            {loading ? (
              <p className="loading-message">Memuat riwayat peminjaman...</p>
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
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <p className="empty-message">Belum ada riwayat peminjaman yang tersimpan.</p>
            )}
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default AdminRiwayat;
