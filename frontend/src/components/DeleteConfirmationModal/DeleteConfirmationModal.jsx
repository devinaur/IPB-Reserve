import React from 'react';
import './DeleteConfirmationModal.css';

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, facilityName, error }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content delete-modal">
        <div className="modal-header">
          <h2>Hapus Fasilitas</h2>
          <button className="btn-close" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
        <div className="modal-body">
          <div className="delete-icon-container">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="delete-warning-icon">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
          </div>
          <p className="delete-warning">
            Apakah Anda yakin ingin menghapus fasilitas <strong>{facilityName}</strong>?
          </p>
          <p className="delete-subtext">
            Tindakan ini tidak dapat dibatalkan dan seluruh riwayat peminjaman terkait fasilitas ini akan ikut terpengaruh.
          </p>
          {error && (
            <div className="error-message" style={{
              color: '#EF4444',
              backgroundColor: '#FEF2F2',
              border: '1px solid #FEE2E2',
              borderRadius: '6px',
              padding: '10px',
              fontSize: '13px',
              marginBottom: '16px',
              textAlign: 'center',
              fontWeight: '500'
            }}>
              {error}
            </div>
          )}
        </div>
        <div className="modal-actions">
          <button className="btn-back" onClick={onClose}>Batal</button>
          <button className="btn-confirm-delete" onClick={onConfirm}>
            Ya, Hapus
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
