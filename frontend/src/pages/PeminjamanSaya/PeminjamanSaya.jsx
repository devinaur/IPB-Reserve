import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout/Layout';
import BorrowCard from '../../components/BorrowCard/BorrowCard';
import { reservationService } from '../../services/api';
import './PeminjamanSaya.css';

const PeminjamanSaya = () => {
  const navigate = useNavigate();
  const [borrows, setBorrows] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBorrows = async () => {
    try {
      setLoading(true);
      const data = await reservationService.getMyReservations();
      // Filter only approved and active reservations (end_date >= now)
      const now = new Date();
      const activeApproved = data.filter(r => 
        r.status === 'DISETUJUI' && new Date(r.end_date) >= now
      );
      setBorrows(activeApproved);
    } catch (error) {
      console.error('Failed to load active borrowings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBorrows();
  }, []);

  const handleEditClick = (id) => {
    alert("Peminjaman yang telah disetujui tidak dapat diedit secara langsung untuk menjaga validasi jadwal. Silakan batalkan pengajuan Anda di halaman 'Pengajuan Saya' dan ajukan reservasi baru.");
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const formatTime = (dateStr) => {
    return new Date(dateStr).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Layout>
      <div className="peminjaman-page-wrapper">
        <header className="peminjaman-header">
          <div className="header-text">
            <h1 className="peminjaman-title">Peminjaman Saya</h1>
            <p className="peminjaman-subtitle">Kelola peminjaman fasilitas Anda yang telah disetujui.</p>
          </div>
          <button className="btn-ajukan-reservasi" onClick={() => navigate('/reservasi')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
            + AJUKAN RESERVASI
          </button>
        </header>

        <div className="summary-card">
          <div className="summary-text">
            <p className="summary-label">Fasilitas yang Saat Ini Dipinjam</p>
            <h2 className="summary-value">{loading ? '...' : borrows.length}</h2>
          </div>
          <button className="btn-refresh" onClick={fetchBorrows} disabled={loading}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={loading ? 'spin' : ''}><path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/></svg>
          </button>
        </div>

        <div className="borrowed-list-container">
          <h3 className="section-heading">PEMINJAMAN AKTIF</h3>
          {loading ? (
            <p className="loading-msg">Memuat peminjaman aktif...</p>
          ) : borrows.length > 0 ? (
            <div className="borrowed-list">
              {borrows.map((borrow) => (
                <BorrowCard 
                  key={borrow.id}
                  id={borrow.id}
                  title={borrow.facility_name || `Fasilitas #${borrow.facility_id}`}
                  purpose={borrow.purpose}
                  date={formatDate(borrow.start_date)}
                  time={`${formatTime(borrow.start_date)} - ${formatTime(borrow.end_date)}`}
                  onEdit={handleEditClick}
                />
              ))}
            </div>
          ) : (
            <p className="empty-msg" style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#666', padding: '2rem 0' }}>Tidak ada peminjaman aktif saat ini.</p>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default PeminjamanSaya;
