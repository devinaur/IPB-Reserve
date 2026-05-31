import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout/Layout';
import RejectionModal from '../../components/RejectionModal/RejectionModal';
import { reservationService, facilityService } from '../../services/api';
import './AdminPengajuan.css';

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

const AdminPengajuan = () => {
  const [allReservations, setAllReservations] = useState([]);
  const [pendingReservations, setPendingReservations] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Rejection modal state
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectTargetId, setRejectTargetId] = useState(null);
  const [rejectTargetTitle, setRejectTargetTitle] = useState('');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const fetchData = async () => {
    try {
      setLoading(true);
      const [resData, facData] = await Promise.all([
        reservationService.getAllReservations(),
        facilityService.getFacilities()
      ]);

      setAllReservations(resData);
      setFacilities(facData);

      // Extract pending
      const pending = resData.filter(r => r.status === 'MENUNGGU');
      pending.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setPendingReservations(pending);
      setError('');
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Gagal memuat data pengajuan.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApprove = async (id) => {
    if (!window.confirm('Setujui pengajuan reservasi ini?')) return;
    try {
      await reservationService.updateStatus(id, 'APPROVED');
      fetchData();
    } catch (err) {
      console.error('Failed to approve:', err);
      alert('Gagal menyetujui pengajuan.');
    }
  };

  const handleRejectClick = (id, title) => {
    setRejectTargetId(id);
    setRejectTargetTitle(title);
    setIsRejectModalOpen(true);
  };

  const handleConfirmReject = async (reason) => {
    try {
      await reservationService.updateStatus(rejectTargetId, 'REJECTED', reason);
      setIsRejectModalOpen(false);
      fetchData();
    } catch (err) {
      console.error('Failed to reject:', err);
      alert('Gagal menolak pengajuan.');
    }
  };

  // Stats calculation
  const stats = {
    waiting: allReservations.filter(r => r.status === 'MENUNGGU').length,
    approved: allReservations.filter(r => r.status === 'DISETUJUI' || r.status === 'APPROVED').length,
    activeFacilities: facilities.filter(f => f.status === 'BOOKED').length,
    totalReservations: allReservations.length
  };

  // Pagination calculation
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = pendingReservations.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(pendingReservations.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <Layout>
      <div className="admin-pengajuan-wrapper">
        <header className="admin-pengajuan-header">
          <div>
            <h1 className="admin-title">Daftar Persetujuan Peminjaman</h1>
            <p className="admin-subtitle">Kelola dan tinjau permohonan reservasi fasilitas dari mahasiswa dan staf.</p>
          </div>
          <button className="btn-refresh" onClick={fetchData} disabled={loading}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={loading ? 'spin' : ''}><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"></path></svg>
            Refresh
          </button>
        </header>

        {/* Stats Grid */}
        <section className="admin-stats-grid">
          <div className="admin-stat-card waiting">
            <span className="admin-stat-label">MENUNGGU</span>
            <h2 className="admin-stat-value">{loading ? '...' : stats.waiting}</h2>
          </div>
          <div className="admin-stat-card approved">
            <span className="admin-stat-label">DISETUJUI</span>
            <h2 className="admin-stat-value">{loading ? '...' : stats.approved}</h2>
          </div>
          <div className="admin-stat-card active">
            <span className="admin-stat-label">FASILITAS AKTIF</span>
            <h2 className="admin-stat-value">{loading ? '...' : stats.activeFacilities}</h2>
          </div>
          <div className="admin-stat-card total">
            <span className="admin-stat-label">TOTAL RESERVASI</span>
            <h2 className="admin-stat-value">{loading ? '...' : stats.totalReservations}</h2>
          </div>
        </section>

        {/* List Content */}
        <section className="admin-list-section">
          <div className="list-section-header">
            <h2>Permohonan Reservasi Baru</h2>
          </div>

          {error && <p style={{ color: '#ef4444', fontWeight: 500 }}>{error}</p>}

          <div className="cards-container">
            {loading ? (
              <p style={{ color: '#64748b', fontSize: '0.95rem' }}>Memuat daftar permohonan...</p>
            ) : currentItems.length > 0 ? (
              currentItems.map((item) => {
                const profile = getUserProfile(item.user_email, item.user_role);
                const facility = facilities.find(f => f.id === item.facility_id);
                const facilityImage = facility?.image || '/images/ahn.png';
                const campusCategory = facility?.campus || 'Dramaga';
                const facilityCategory = facility?.category || 'Auditorium';
                
                const formattedDate = new Date(item.start_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
                const formattedTime = `${new Date(item.start_date).toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'})} - ${new Date(item.end_date).toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'})}`;

                return (
                  <div className="request-horizontal-card" key={item.id}>
                    <div className="request-image-wrapper">
                      <img src={facilityImage} alt={item.facility_name} onError={(e) => { e.target.src = '/images/ahn.png'; }} />
                    </div>
                    <div className="request-info-center">
                      <div className="info-top-row">
                        <span className="category-tag">{facilityCategory}</span>
                        <span className="category-tag" style={{ backgroundColor: '#f0fdf4', color: '#16a34a' }}>{campusCategory}</span>
                        <span className="request-id-tag">ID: REQ-{String(item.id).padStart(5, '0')}</span>
                      </div>
                      <h3 className="request-facility-name">{item.facility_name}</h3>
                      <p className="request-purpose-text">{item.purpose}</p>
                      
                      <div className="info-metadata-row">
                        <div className="meta-pill">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                          {formattedDate}
                        </div>
                        <div className="meta-pill">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                          {formattedTime}
                        </div>
                        <div className="meta-pill applicant">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                          Pemohon: {profile.name} - {profile.description}
                        </div>
                      </div>
                    </div>
                    
                    <div className="request-controls-right">
                      <button 
                        className="btn-control-action approve" 
                        onClick={() => handleApprove(item.id)}
                        title="Setujui Pengajuan"
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      </button>
                      <button 
                        className="btn-control-action reject" 
                        onClick={() => handleRejectClick(item.id, item.facility_name)}
                        title="Tolak Pengajuan"
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="admin-empty-state">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M8 12h8"></path></svg>
                <h3>Tidak Ada Permohonan</h3>
                <p>Seluruh pengajuan reservasi masuk telah diproses.</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {pendingReservations.length > itemsPerPage && (
            <div className="pagination-section">
              <span className="pagination-info">
                Menampilkan {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, pendingReservations.length)} dari {pendingReservations.length} permohonan baru
              </span>
              <div className="pagination-controls">
                <button 
                  className="btn-page-nav" 
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  &larr;
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button 
                    key={i + 1} 
                    className={`btn-page-nav ${currentPage === i + 1 ? 'active' : ''}`}
                    onClick={() => paginate(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
                <button 
                  className="btn-page-nav" 
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  &rarr;
                </button>
              </div>
            </div>
          )}
        </section>
      </div>

      <RejectionModal 
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        onConfirm={handleConfirmReject}
        title={rejectTargetTitle}
      />
    </Layout>
  );
};

export default AdminPengajuan;
