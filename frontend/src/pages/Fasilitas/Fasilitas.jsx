import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout/Layout';
import FacilityCard from '../../components/FacilityCard/FacilityCard';
import { facilityService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import './Fasilitas.css';

// Import images
import heroImage from '../../assets/IPB-fasilitas.png';

const Fasilitas = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filter and Search states
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // all, available, booked
  const [sortOrder, setSortOrder] = useState('default'); // default, a-z, z-a

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

  const handleGlobalBooking = () => {
    if (!isAuthenticated) {
      alert('Silakan login terlebih dahulu untuk mengajukan reservasi.');
      navigate('/login', { state: { from: { pathname: '/fasilitas' } } });
      return;
    }
    navigate('/reservasi');
  };

  // Memoized filter and sort logic
  const filteredAndSortedFacilities = React.useMemo(() => {
    let result = [...facilities];

    // 1. Filter by search term
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      result = result.filter(f => 
        f.name.toLowerCase().includes(term) || 
        (f.location && f.location.toLowerCase().includes(term))
      );
    }

    // 2. Filter by status
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
            <h1 className="hero-title">FASILITAS</h1>
            <p className="hero-subtitle">
              Jelajahi fasilitas yang tersedia di seluruh ekosistem IPB University. Pilih fasilitas untuk melihat ketersediaan dan mengajukan permintaan reservasi.
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
          <button className="btn-ajukan-fasilitas" onClick={handleGlobalBooking}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="btn-icon"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
            + AJUKAN RESERVASI
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
                  Tersedia (Available)
                </button>
                <button 
                  className={statusFilter === 'booked' ? 'active' : ''} 
                  onClick={() => setStatusFilter('booked')}
                >
                  Dipinjam (Booked)
                </button>
                <button 
                  className={statusFilter === 'maintenance' ? 'active' : ''} 
                  onClick={() => setStatusFilter('maintenance')}
                >
                  Perbaikan (Maintenance)
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
              />
            ))
          ) : (
            <div className="empty-state" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem 0', color: '#666' }}>Tidak ada fasilitas yang cocok dengan kriteria pencarian atau filter.</div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Fasilitas;
