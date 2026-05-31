import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout/Layout';
import { reservationService } from '../../services/api';
import DamageReportModal from '../../components/DamageReportModal/DamageReportModal';
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

const AdminPeminjaman = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isDamageModalOpen, setIsDamageModalOpen] = useState(false);
  const [damageTargetId, setDamageTargetId] = useState(null);
  const [damageTargetFacility, setDamageTargetFacility] = useState('');

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const data = await reservationService.getAllReservations();
      // Filter only APPROVED
      const approved = data.filter(r => r.status === 'DISETUJUI');
      // Sort: newest first
      approved.sort((a, b) => new Date(b.start_date) - new Date(a.start_date));
      setReservations(approved);
      setError('');
    } catch (err) {
      console.error('Error fetching reservations:', err);
      setError('Gagal memuat data peminjaman.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleOpenDamageModal = (id, facilityName) => {
    setDamageTargetId(id);
    setDamageTargetFacility(facilityName);
    setIsDamageModalOpen(true);
  };

  const handleConfirmDamage = async (report) => {
    try {
      await reservationService.reportDamage(damageTargetId, report);
      setIsDamageModalOpen(false);
      fetchReservations();
      alert('Laporan kerusakan berhasil dikirim.');
    } catch (err) {
      console.error(err);
      alert('Gagal mengirim laporan kerusakan.');
    }
  };

  return (
    <Layout>
      <div className="admin-dashboard-wrapper">
        <header className="admin-dashboard-header">
          <div>
            <h1 className="admin-dashboard-title">Lihat Peminjaman Aktif</h1>
            <p className="admin-dashboard-subtitle">Daftar seluruh fasilitas yang sedang atau akan digunakan sesuai persetujuan.</p>
          </div>
        </header>

        <section className="request-management-section">
          <div className="section-header">
            <h2>Peminjaman Disetujui</h2>
            <button className="btn-refresh" onClick={fetchReservations} disabled={loading}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={loading ? 'spin' : ''}><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"></path></svg>
              Refresh
            </button>
          </div>

          {error && <p className="error-message">{error}</p>}

          <div className="table-responsive">
            {loading ? (
              <p className="loading-message">Memuat daftar peminjaman...</p>
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
                          {item.damage_report ? (
                            <div className="damage-info-badge">
                              <span className="damage-badge-title">Rusak</span>
                              <span className="damage-badge-desc">{item.damage_report}</span>
                            </div>
                          ) : (
                            <button 
                              className="btn-damage" 
                              onClick={() => handleOpenDamageModal(item.id, item.facility_name)}
                            >
                              Tulis Kerusakan
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <p className="empty-message">Tidak ada peminjaman aktif saat ini.</p>
            )}
          </div>
        </section>
      </div>

      <DamageReportModal
        isOpen={isDamageModalOpen}
        onClose={() => setIsDamageModalOpen(false)}
        onConfirm={handleConfirmDamage}
        facilityName={damageTargetFacility}
      />
    </Layout>
  );
};

export default AdminPeminjaman;
