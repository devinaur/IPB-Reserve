import React from 'react';
import './BorrowCard.css';

const BorrowCard = ({ id, title, purpose, date, time, onEdit }) => {
  return (
    <div className="borrow-card">
      <div className="borrow-card-content">
        <h3 className="borrow-card-title">{title}</h3>
        <p className="borrow-card-purpose">{purpose}</p>
        <div className="borrow-card-meta">
          <div className="meta-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
            {date}
          </div>
          <div className="meta-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            {time}
          </div>
        </div>
      </div>
      <div className="borrow-card-actions">
        <button className="btn-edit" onClick={() => onEdit(id)}>EDIT</button>
        <button className="btn-menu">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
        </button>
      </div>
    </div>
  );
};

export default BorrowCard;
