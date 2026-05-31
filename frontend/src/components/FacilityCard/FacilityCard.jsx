import React from 'react';
import { useNavigate } from 'react-router-dom';
import './FacilityCard.css';

const FacilityCard = ({ id, image, title, location, capacity, status, campus, category, variant = 'default', isAdmin = false, onDelete }) => {
  const navigate = useNavigate();
  
  let statusClass = 'status-available';
  if (status === 'BOOKED TODAY') {
    statusClass = 'status-booked-today';
  } else if (status === 'BOOKED') {
    statusClass = 'status-booked';
  } else if (status === 'MAINTENANCE') {
    statusClass = 'status-maintenance';
  }

  const handleActionClick = () => {
    if (isAdmin) {
      navigate(`/admin/fasilitas/edit/${id}`);
    } else {
      navigate(`/fasilitas/${id}`);
    }
  };

  return (
    <div className={`facility-card ${variant === 'small' ? 'variant-small' : ''}`}>
      <div className="facility-image-container">
        <img src={image} alt={title} className="facility-image" />
        <span className={`facility-status ${statusClass}`}>{status}</span>
      </div>
      <div className="facility-content">
        {(campus || category) && (
          <div className="facility-badges">
            {campus && <span className="facility-badge badge-campus">{campus}</span>}
            {category && <span className="facility-badge badge-category">{category}</span>}
          </div>
        )}
        {location && (
          <div className="facility-location">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="location-pin"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            {location}
          </div>
        )}
        <h3 className="facility-title">{title}</h3>
        <div className="facility-info-row" style={{ marginTop: 'auto' }}>
          {capacity && (
            <div className="facility-capacity">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="capacity-icon"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              {capacity}
            </div>
          )}
          <div className="facility-actions" style={{ display: 'flex', gap: '8px' }}>
            {isAdmin && onDelete && (
              <button className="btn-delete" onClick={(e) => { e.stopPropagation(); onDelete(id, title); }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                Hapus
              </button>
            )}
            <button className="btn-info" onClick={handleActionClick}>
              {isAdmin ? (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="info-icon"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                  Edit
                </>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="info-icon"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                  Info
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacilityCard;
