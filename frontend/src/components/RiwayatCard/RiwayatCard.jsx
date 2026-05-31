import React from 'react';
import { useNavigate } from 'react-router-dom';
import './RiwayatCard.css';

const RiwayatCard = ({ icon, tags, title, date, time, status, rejectionReason }) => {
  const navigate = useNavigate();

  return (
    <div className="riwayat-card">
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
          {status === 'DITOLAK' && rejectionReason && (
            <div className="rejection-reason-box" style={{
              marginTop: '8px',
              backgroundColor: '#FEF2F2',
              borderLeft: '3px solid #EF4444',
              padding: '6px 10px',
              borderRadius: '4px',
              fontSize: '11px',
              color: '#991B1B',
              fontWeight: '550',
              lineHeight: '1.3',
              maxWidth: '400px'
            }}>
              <strong>Alasan Penolakan:</strong> {rejectionReason}
            </div>
          )}
        </div>
      </div>
      <div className="card-right">
        {status === 'KERUSAKAN' ? (
          <div className="status-damage">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
            KERUSAKAN
          </div>
        ) : status === 'DITOLAK' ? (
          <div className="status-damage">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
            DITOLAK
          </div>
        ) : (
          <button className="btn-pinjam-lagi" onClick={() => navigate('/reservasi')}>PINJAM LAGI</button>
        )}
      </div>
    </div>
  );
};

export default RiwayatCard;
