import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout/Layout';
import DashboardCard from '../../components/DashboardCard/DashboardCard';
import { reservationService } from '../../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ total: 0, waiting: 0, approved: 0 });
  const [latestActivities, setLatestActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsData = await reservationService.getStats();
        const reservations = await reservationService.getMyReservations();
        setStats(statsData);
        setLatestActivities(reservations.slice(0, 4));
      } catch (error) {
        console.error('Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <Layout>
      <div className="dashboard-content-wrapper">
        <header className="dashboard-header">
          <h1 className="dashboard-title">Dashboard User</h1>
          <div className="dashboard-header-right">
            <button className="btn-ajukan" onClick={() => navigate('/reservasi')}>
              <span className="btn-icon">+</span> AJUKAN RESERVASI
            </button>
          </div>
        </header>

        <div className="dashboard-cards-container">
          <DashboardCard 
            title="Total Peminjaman" 
            value={stats.total} 
            subtitle="Peminjaman diajukan" 
            icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>}
            iconBgColor="#EFF6FF"
          />
          <DashboardCard 
            title="Menunggu Persetujuan" 
            value={stats.waiting} 
            subtitle="Sedang diproses admin" 
            icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>}
            iconBgColor="#FEF2F2"
          />
          <DashboardCard 
            title="Disetujui" 
            value={stats.approved} 
            subtitle="Fasilitas siap digunakan" 
            icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>}
            iconBgColor="#EEF2FF"
          />
        </div>

        <div className="dashboard-content-grid">
          <div className="activities-section">
            <div className="section-header">
              <h2>Aktivitas Terbaru</h2>
              <span className="see-all" onClick={() => navigate('/pengajuan-saya')}>Lihat Semua</span>
            </div>
            <div className="activities-list">
              {latestActivities.length > 0 ? latestActivities.map(activity => (
                <div className="activity-item" key={activity.id}>
                  <div className={`activity-icon ${activity.status === 'DISETUJUI' ? 'success' : activity.status === 'DITOLAK' ? 'error' : 'info'}`}>
                    {activity.status === 'DISETUJUI' ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                    )}
                  </div>
                  <div className="activity-details">
                    <h4 className="activity-title">{activity.facility_name || `Fasilitas #${activity.facility_id}`} - {activity.status}</h4>
                    <p className="activity-desc">Tujuan: {activity.purpose}</p>
                  </div>
                  <div className="activity-time">Baru saja</div>
                </div>
              )) : <p className="empty-msg">Belum ada aktivitas.</p>}
            </div>
          </div>

          <div className="timeline-section">
            <div className="section-header">
              <h2>Peminjaman anda saat ini</h2>
            </div>
            <div className="timeline-list">
              {latestActivities.filter(a => a.status === 'DISETUJUI').length > 0 ? (
                latestActivities.filter(a => a.status === 'DISETUJUI').map(item => (
                  <div className="timeline-item" key={item.id}>
                    <div className="timeline-date-circle active">
                      {new Date(item.start_date).getDate()}
                    </div>
                    <div className="timeline-content">
                      <p className="timeline-date-text">
                        {new Date(item.start_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })} - {new Date(item.start_date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </p>
                      <h4 className="timeline-title">{item.purpose}</h4>
                      <div className="timeline-location">
                        <span className="location-icon">🏢</span> {item.facility_name || 'Fasilitas'}
                      </div>
                    </div>
                  </div>
                ))
              ) : <p className="empty-msg">Tidak ada peminjaman aktif.</p>}
            </div>
          </div>
        </div>
      </div>

    </Layout>
  );
};

export default Dashboard;
