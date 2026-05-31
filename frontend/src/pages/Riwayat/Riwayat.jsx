import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout/Layout';
import RiwayatCard from '../../components/RiwayatCard/RiwayatCard';
import { reservationService } from '../../services/api';
import './Riwayat.css';

const Riwayat = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const data = await reservationService.getMyReservations();
        // Riwayat is for:
        // 1. status is 'DITOLAK'
        // 2. OR end_date is in the past (end_date < now)
        const now = new Date();
        const historyData = data.filter(r => 
          r.status === 'DITOLAK' || new Date(r.end_date) < now
        );
        setHistory(historyData);
      } catch (error) {
        console.error('Failed to fetch history:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const formatTime = (dateStr) => {
    return new Date(dateStr).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Layout>
      <div className="riwayat-page-wrapper">
        <header className="riwayat-header">
          <div className="header-text">
            <h1 className="riwayat-title">Riwayat Peminjaman</h1>
            <p className="riwayat-subtitle">Lihat riwayat peminjaman fasilitas Anda.</p>
          </div>
          <button className="btn-ajukan-reservasi" onClick={() => navigate('/reservasi')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
            + AJUKAN RESERVASI
          </button>
        </header>

        <div className="summary-card riwayat-summary">
          <div className="summary-text">
            <p className="summary-label">Total Riwayat Peminjaman</p>
            <h2 className="summary-value">{loading ? '...' : history.length}</h2>
          </div>
        </div>

        <section className="riwayat-list-section">
          <h3 className="section-label">RIWAYAT PEMINJAMAN</h3>
          {loading ? (
            <p className="loading-msg">Memuat riwayat peminjaman...</p>
          ) : history.length > 0 ? (
            <div className="riwayat-list">
              {history.map((item) => (
                <RiwayatCard 
                  key={item.id}
                  icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18"></path><path d="M3 7v1a3 3 0 0 0 6 0v-1m12 1a3 3 0 0 1-6 0v-1m0 1a3 3 0 0 0 6 0v-1m-12 1a3 3 0 0 1-6 0v-1m0 1v14"></path><path d="M9 21V10"></path><path d="M15 21V10"></path><path d="M21 7V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2"></path></svg>}
                  tags={['IPB', 'FACILITY']}
                  title={item.facility_name || `Fasilitas #${item.facility_id}`}
                  date={formatDate(item.start_date)}
                  time={`${formatTime(item.start_date)} - ${formatTime(item.end_date)}`}
                  status={item.status}
                  rejectionReason={item.rejection_reason}
                />
              ))}
            </div>
          ) : (
            <p className="empty-msg" style={{ textAlign: 'center', color: '#666', padding: '2rem 0' }}>Belum ada riwayat peminjaman.</p>
          )}
        </section>
      </div>
    </Layout>
  );
};

export default Riwayat;
