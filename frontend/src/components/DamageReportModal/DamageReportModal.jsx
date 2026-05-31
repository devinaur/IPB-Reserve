import React, { useState } from 'react';
import './DamageReportModal.css';

const DamageReportModal = ({ isOpen, onClose, onConfirm, facilityName }) => {
  const [report, setReport] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!report.trim()) {
      setError('Keterangan kerusakan wajib diisi!');
      return;
    }
    setError('');
    onConfirm(report);
    setReport('');
  };

  return (
    <div className="damage-modal-overlay">
      <div className="damage-modal-container">
        <div className="damage-modal-header">
          <h2>Laporkan Kerusakan</h2>
          <button className="btn-close-modal" onClick={onClose}>&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="damage-modal-body">
          <p className="modal-instruction">
            Silakan laporkan detail kerusakan untuk fasilitas <strong>{facilityName}</strong> setelah digunakan:
          </p>
          
          <div className="form-group">
            <label htmlFor="damage-report-text">Detail Kerusakan <span className="required-star">*</span></label>
            <textarea
              id="damage-report-text"
              placeholder="Contoh: AC bocor, kursi patah sebanyak 2 buah, proyektor mati..."
              value={report}
              onChange={(e) => {
                setReport(e.target.value);
                if (e.target.value.trim()) setError('');
              }}
              rows={4}
              className={error ? 'error-input' : ''}
            />
            {error && <span className="error-message">{error}</span>}
          </div>

          <div className="damage-modal-actions">
            <button type="button" className="btn-modal-cancel" onClick={onClose}>
              Batal
            </button>
            <button type="submit" className="btn-modal-submit">
              Laporkan Kerusakan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DamageReportModal;
