import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout/Layout';
import FacilityCard from '../../components/FacilityCard/FacilityCard';
import { useAuth } from '../../context/AuthContext';
import { facilityService } from '../../services/api';
import './FacilityDetail.css';

const FacilityDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const [currentFacility, setCurrentFacility] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const data = await facilityService.getFacilityDetail(id);
        setCurrentFacility(data);
      } catch (error) {
        console.error('Failed to load facility detail');
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  const handleBookingClick = () => {
    if (!isAuthenticated) {
      alert('Silakan login terlebih dahulu untuk mengajukan reservasi.');
      navigate('/login', { state: { from: { pathname: `/fasilitas/${id}` } } });
      return;
    }
    navigate('/reservasi', { state: { facilityId: id } });
  };

  if (loading) return <Layout><div className="loading-container">Memuat detail fasilitas...</div></Layout>;
  if (!currentFacility) return <Layout><div className="error-container">Fasilitas tidak ditemukan.</div></Layout>;

  const isAvailable = currentFacility.status === 'AVAILABLE';

  return (
    <Layout>
      <div className="facility-detail-wrapper">
        <div className="detail-top-section">
          <div className="detail-image-container">
            <img src={currentFacility.image || "/images/IPB-fasilitas.png"} alt={currentFacility.name} className="detail-hero-image" />
            <div className="detail-image-footer">
              <div className="detail-tags">
                {currentFacility.campus && (
                  <span className="detail-tag campus-tag" style={{ backgroundColor: '#E0F2FE', color: '#0369A1', padding: '4px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: '600' }}>
                    {currentFacility.campus}
                  </span>
                )}
                {(currentFacility.category || currentFacility.tags) && (
                  <span className="detail-tag category-tag" style={{ backgroundColor: '#FEF3C7', color: '#92400E', padding: '4px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: '600' }}>
                    {currentFacility.category || currentFacility.tags}
                  </span>
                )}
              </div>
              <span className={`detail-status ${!isAvailable ? 'status-red' : ''}`}>
                {currentFacility.status}
              </span>
            </div>
          </div>
          <div className="detail-info-section">
            <div className="detail-header">
              <h1 className="detail-title">{currentFacility.name}</h1>
              <button 
                className={`btn-ajukan-detail ${!isAvailable ? 'btn-booked-detail' : ''}`} 
                onClick={handleBookingClick}
                disabled={!isAvailable && isAuthenticated} // Only disable if logged in and not available
              >
                {isAvailable ? (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                    + AJUKAN RESERVASI
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
                    BOOKED
                  </>
                )}
              </button>
            </div>
            <div className="detail-description">
              <p>{currentFacility.description}</p>
            </div>
          </div>
        </div>

        <section className="other-facilities-section">
          <div className="section-header">
            <h2>FASILITAS LAIN YANG DAPAT DIPINJAM</h2>
            <Link to="/fasilitas" className="link-see-all">Lihat Semua &rarr;</Link>
          </div>
          <div className="other-facilities-grid">
             {/* This could be fetched as well, leaving empty or placeholder for now */}
             <p className="hint-text">Gunakan menu Fasilitas untuk melihat pilihan lainnya.</p>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default FacilityDetail;
