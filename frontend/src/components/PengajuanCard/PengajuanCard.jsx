import React, { useState } from 'react';
import './PengajuanCard.css';

const PengajuanCard = ({ id, icon, tags, title, subtitle, date, time, status, rejectionReason, onCancel }) => {
  const [showMenu, setShowMenu] = useState(false);

  const getStatusClass = (status) => {
    switch (status) {
      case 'DISETUJUI':
        return 'status-approved';
      case 'DITOLAK':
        return 'status-rejected';
      case 'MENUNGGU':
        return 'status-pending';
      default:
        return '';
    }
  };

  return (
    <div className="pengajuan-card">
      <div className="card-left">
        <div className="icon-container">
          {icon}
        </div>
        <div className="card-details">
          <div className="card-tags">
            {tags.map((tag, index) => (
              <span key={index} className="card-tag">{tag}</span>
            ))}
          </div>
          <h3 className="card-title">{title}</h3>
          <p className="card-subtitle">{subtitle}</p>
          {status === 'DITOLAK' && rejectionReason && (
            <div className="rejection-reason-box">
              <strong>Alasan Penolakan:</strong> {rejectionReason}
            </div>
          )}
        </div>
      </div>
      <div className="card-right">
        <div className="card-meta">
          <div className="meta-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
            {date}
          </div>
          <div className="meta-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            {time}
          </div>
        </div>
        <div className={`status-badge ${getStatusClass(status)}`}>
          {status}
        </div>
        <div className="kebab-menu-container">
          <button className="btn-kebab" onClick={() => setShowMenu(!showMenu)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
          </button>
          {showMenu && (
            <div className="kebab-dropdown">
              <button 
                className="dropdown-item delete" 
                onClick={() => {
                  onCancel(id, title);
                  setShowMenu(false);
                }}
              >
                Batalkan Pengajuan
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PengajuanCard;
