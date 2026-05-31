import React, { useState, useEffect } from 'react';
import './CancelModal.css';

const CancelModal = ({ isOpen, onClose, onConfirm, title }) => {
  const [reason, setReason] = useState('');

  // Reset reason when modal closes or opens
  useEffect(() => {
    if (!isOpen) {
      setReason('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isInvalid = !reason.trim();

  return (
    <div className="modal-overlay">
      <div className="modal-content cancel-modal">
        <div className="modal-header">
          <h2>Batalkan Pengajuan</h2>
          <button className="btn-close" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
        <div className="modal-body">
          <p className="cancel-warning">
            Apakah Anda yakin ingin membatalkan pengajuan reservasi untuk <strong>{title}</strong>? Tindakan ini tidak dapat dibatalkan.
          </p>
          <div className="form-group">
            <label>Alasan Pembatalan <span style={{ color: '#EF4444' }}>*</span></label>
            <textarea 
              placeholder="Berikan alasan mengapa Anda membatalkan pengajuan ini... (wajib diisi)" 
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows="3"
              required
            ></textarea>
          </div>
        </div>
        <div className="modal-actions">
          <button className="btn-back" onClick={onClose}>Kembali</button>
          <button 
            className="btn-confirm-cancel" 
            onClick={() => {
              if (!isInvalid) {
                onConfirm(reason);
              }
            }}
            disabled={isInvalid}
            style={{
              opacity: isInvalid ? 0.6 : 1,
              cursor: isInvalid ? 'not-allowed' : 'pointer'
            }}
          >
            Ya, Batalkan Pengajuan
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancelModal;
