import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout/Layout';
import StatCard from '../../components/StatCard/StatCard';
import PengajuanCard from '../../components/PengajuanCard/PengajuanCard';
import CancelModal from '../../components/CancelModal/CancelModal';
import { reservationService } from '../../services/api';
import './PengajuanSaya.css';

const PengajuanSaya = () => {
  const navigate = useNavigate();
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancellingInfo, setCancellingInfo] = useState({ id: null, title: '' });
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const data = await reservationService.getMyReservations();
      setReservations(data);
    } catch (error) {
      console.error('Failed to fetch reservations');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelClick = (id, title) => {
    setCancellingInfo({ id, title });
    setIsCancelModalOpen(true);
  };

  const handleConfirmCancel = async (reason) => {
    try {
      await reservationService.deleteReservation(cancellingInfo.id);
      alert(`Pengajuan berhasil dibatalkan dan dihapus.`);
      setIsCancelModalOpen(false);
      fetchData(); // Refresh the list
    } catch (error) {
      alert('Gagal membatalkan pengajuan: ' + (error.response?.data?.detail || error.message));
    }
  };

  const stats = {
    waiting: reservations.filter(r => r.status === 'MENUNGGU').length,
    approved: reservations.filter(r => r.status === 'DISETUJUI').length,
    rejected: reservations.filter(r => r.status === 'DITOLAK').length,
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const formatTime = (dateStr) => {
    return new Date(dateStr).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Layout>
      <div className="pengajuan-page-wrapper">
        <header className="pengajuan-header">
          <div className="header-text">
            <h1 className="pengajuan-title">Pengajuan Saya</h1>
            <p className="pengajuan-subtitle">Lacak pengajuan fasilitas Anda.</p>
          </div>
          <button className="btn-ajukan-reservasi" onClick={() => navigate('/reservasi')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
            + AJUKAN RESERVASI
          </button>
        </header>

        <section className="month-section">
          <h3 className="section-label">STATISTIK PENGAJUAN</h3>
          <div className="stats-grid">
            <StatCard 
              title="Menunggu Persetujuan" 
              value={stats.waiting} 
              colorClass="red-bg"
              icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>}
            />
            <StatCard 
              title="Pengajuan Disetujui" 
              value={stats.approved} 
              colorClass="green"
              icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="16 12 12 8 8 12"></polyline><line x1="12" y1="16" x2="12" y2="8"></line></svg>}
            />
            <StatCard 
              title="Pengajuan Ditolak" 
              value={stats.rejected} 
              colorClass="red"
              icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>}
            />
          </div>
        </section>

        <section className="current-requests-section">
          <h3 className="section-label">PENGAJUAN SAAT INI</h3>
          <div className="requests-list">
            {loading ? (
              <p>Memuat pengajuan...</p>
            ) : reservations.length > 0 ? (
              reservations.map(res => (
                <PengajuanCard 
                  key={res.id}
                  id={res.id}
                  icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18"></path><path d="M3 7v1a3 3 0 0 0 6 0v-1m12 1a3 3 0 0 1-6 0v-1m0 1a3 3 0 0 0 6 0v-1m-12 1a3 3 0 0 1-6 0v-1m0 1v14"></path><path d="M9 21V10"></path><path d="M15 21V10"></path><path d="M21 7V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2"></path></svg>}
                  tags={['DRAMAGA', 'FACILITY']}
                  title={res.facility_name || `Fasilitas #${res.facility_id}`}
                  subtitle={res.purpose}
                  date={formatDate(res.start_date)}
                  time={`${formatTime(res.start_date)} - ${formatTime(res.end_date)}`}
                  status={res.status}
                  rejectionReason={res.rejection_reason}
                  onCancel={handleCancelClick}
                />
              ))
            ) : (
              <p className="empty-msg">Belum ada pengajuan reservasi.</p>
            )}
          </div>
        </section>
      </div>

      <CancelModal 
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        onConfirm={handleConfirmCancel}
        title={cancellingInfo.title}
      />
    </Layout>
  );
};

export default PengajuanSaya;
