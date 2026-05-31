import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout/Layout';
import FacilityCard from '../../components/FacilityCard/FacilityCard';
import DeleteConfirmationModal from '../../components/DeleteConfirmationModal/DeleteConfirmationModal';
import { facilityService } from '../../services/api';
import '../Fasilitas/Fasilitas.css';
import heroImage from '../../assets/IPB-fasilitas.png';

const AdminFasilitas = () => {
  const navigate = useNavigate();
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [facilityToDelete, setFacilityToDelete] = useState(null);
  const [deleteError, setDeleteError] = useState('');
  
  // Filter and Search states
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // all, available, booked, maintenance
  const [sortOrder, setSortOrder] = useState('default'); // default, a-z, z-a

  const handleDeleteClick = (id, name) => {
    setFacilityToDelete({ id, name });
    setDeleteError('');
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!facilityToDelete) return;
    try {
      await facilityService.deleteFacility(facilityToDelete.id);
      setFacilities(prev => prev.filter(f => f.id !== facilityToDelete.id));
      setDeleteModalOpen(false);
      setFacilityToDelete(null);
    } catch (error) {
      console.error('Failed to delete facility:', error);
      setDeleteError(error.response?.data?.detail || 'Gagal menghapus fasilitas. Silakan coba lagi.');
    }
  };

  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const data = await facilityService.getFacilities(`?t=${new Date().getTime()}`);
        setFacilities(data);
      } catch (error) {
        console.error('Failed to load facilities');
      } finally {
        setLoading(false);
      }
    };
    fetchFacilities();
  }, []);

  // Filter and sort logic
  const filteredAndSortedFacilities = React.useMemo(() => {
    let result = [...facilities];

    // 1. Search term
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      result = result.filter(f => 
        f.name.toLowerCase().includes(term) || 
        (f.location && f.location.toLowerCase().includes(term))
      );
    }

    // 2. Status
    if (statusFilter === 'available') {
      result = result.filter(f => f.status === 'AVAILABLE');
    } else if (statusFilter === 'booked') {
      result = result.filter(f => f.status === 'BOOKED' || f.status === 'BOOKED TODAY');
    } else if (statusFilter === 'maintenance') {
      result = result.filter(f => f.status === 'MAINTENANCE');
    }

    // 3. Sort
    if (sortOrder === 'a-z') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOrder === 'z-a') {
      result.sort((a, b) => b.name.localeCompare(a.name));
    }

    return result;
  }, [facilities, searchTerm, statusFilter, sortOrder]);

  return (
    <Layout>
      <div className="fasilitas-page">
        {/* Hero Banner */}
        <div className="fasilitas-hero" style={{ backgroundImage: `url(${heroImage})` }}>
          <div className="hero-overlay"></div>
          <div className="hero-content">
            <h1 className="hero-title">KELOLA FASILITAS</h1>
            <p className="hero-subtitle">
              Daftar seluruh fasilitas Kampus IPB University. Pantau kapasitas, lokasi, dan status operasional fasilitas secara real-time.
            </p>
          </div>
        </div>

        {/* Action Bar */}
        <div className="fasilitas-action-bar">
          <div className="action-left">
            <div className="search-input-container">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="search-icon"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              <input 
                type="text" 
                placeholder="Cari Lab, Ruangan, atau Gedung..." 
                className="search-input" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button 
              className={`btn-filter ${showFilters ? 'active' : ''}`}
              onClick={() => setShowFilters(!showFilters)}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="filter-icon"><line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line></svg>
              FILTERS {(statusFilter !== 'all' || sortOrder !== 'default') && '•'}
            </button>
          </div>
          <button className="btn-ajukan-fasilitas" onClick={() => navigate('/admin/fasilitas/tambah')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="btn-icon"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            + TAMBAH FASILITAS
          </button>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="filter-options-panel">
            <div className="filter-group">
              <label>Status Fasilitas</label>
              <div className="filter-buttons">
                <button 
                  className={statusFilter === 'all' ? 'active' : ''} 
                  onClick={() => setStatusFilter('all')}
                >
                  Semua
                </button>
                <button 
                  className={statusFilter === 'available' ? 'active' : ''} 
                  onClick={() => setStatusFilter('available')}
                >
                  Tersedia
                </button>
                <button 
                  className={statusFilter === 'booked' ? 'active' : ''} 
                  onClick={() => setStatusFilter('booked')}
                >
                  Dipinjam
                </button>
                <button 
                  className={statusFilter === 'maintenance' ? 'active' : ''} 
                  onClick={() => setStatusFilter('maintenance')}
                >
                  Perbaikan
                </button>
              </div>
            </div>
            
            <div className="filter-group">
              <label>Urutkan Nama</label>
              <div className="filter-buttons">
                <button 
                  className={sortOrder === 'default' ? 'active' : ''} 
                  onClick={() => setSortOrder('default')}
                >
                  Bawaan
                </button>
                <button 
                  className={sortOrder === 'a-z' ? 'active' : ''} 
                  onClick={() => setSortOrder('a-z')}
                >
                  A ke Z
                </button>
                <button 
                  className={sortOrder === 'z-a' ? 'active' : ''} 
                  onClick={() => setSortOrder('z-a')}
                >
                  Z ke A
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Facility Grid */}
        <div className="facility-grid">
          {loading ? (
            <div className="loading-state" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem 0', color: '#666' }}>Memuat fasilitas...</div>
          ) : filteredAndSortedFacilities.length > 0 ? (
            filteredAndSortedFacilities.map(facility => (
              <FacilityCard 
                key={facility.id}
                id={facility.id}
                image={facility.image || "/images/IPB-fasilitas.png"}
                status={facility.status}
                location={facility.location}
                title={facility.name}
                capacity={`${facility.capacity} Kursi`}
                campus={facility.campus}
                category={facility.category || facility.tags}
                isAdmin={true}
                onDelete={handleDeleteClick}
              />
            ))
          ) : (
            <div className="empty-state" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem 0', color: '#666' }}>Tidak ada fasilitas yang ditemukan.</div>
          )}
        </div>
      </div>

      <DeleteConfirmationModal 
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        facilityName={facilityToDelete?.name || ''}
        error={deleteError}
      />
    </Layout>
  );
};

export default AdminFasilitas;
