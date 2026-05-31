import React, { useState } from 'react';
import './RejectionModal.css';

const RejectionModal = ({ isOpen, onClose, onConfirm, title }) => {
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!reason.trim()) {
      setError('Alasan penolakan wajib diisi!');
      return;
    }
    setError('');
    onConfirm(reason);
    setReason('');
  };

  return (
    <div className="rejection-modal-overlay">
      <div className="rejection-modal-container">
        <div className="rejection-modal-header">
          <h2>Tolak Pengajuan</h2>
          <button className="btn-close-modal" onClick={onClose}>&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="rejection-modal-body">
          <p className="modal-instruction">
            Anda akan menolak pengajuan reservasi untuk <strong>{title}</strong>. 
            Silakan masukkan alasan penolakan di bawah ini:
          </p>
          
          <div className="form-group">
            <label htmlFor="rejection-reason">Alasan Penolakan <span className="required-star">*</span></label>
            <textarea
              id="rejection-reason"
              placeholder="Contoh: Jadwal bertabrakan dengan acara universitas / Fasilitas sedang tidak dapat digunakan..."
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                if (e.target.value.trim()) setError('');
              }}
              rows={4}
              className={error ? 'error-input' : ''}
            />
            {error && <span className="error-message">{error}</span>}
          </div>

          <div className="rejection-modal-actions">
            <button type="button" className="btn-modal-cancel" onClick={onClose}>
              Batal
            </button>
            <button type="submit" className="btn-modal-reject">
              Tolak Pengajuan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RejectionModal;
