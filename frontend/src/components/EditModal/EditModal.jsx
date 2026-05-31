import React, { useState, useEffect } from 'react';
import './EditModal.css';

const EditModal = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    purpose: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        date: initialData.date || '',
        time: initialData.time || '',
        purpose: initialData.purpose || ''
      });
    }
  }, [initialData]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Edit Peminjaman</h2>
          <button className="btn-close" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Tanggal</label>
            <input 
              type="text" 
              name="date" 
              value={formData.date} 
              onChange={handleChange} 
              placeholder="e.g., Feb 26, 2026"
            />
          </div>
          <div className="form-group">
            <label>Waktu</label>
            <input 
              type="text" 
              name="time" 
              value={formData.time} 
              onChange={handleChange} 
              placeholder="e.g., 08:00 - 17:00"
            />
          </div>
          <div className="form-group">
            <label>Tujuan Peminjaman</label>
            <textarea 
              name="purpose" 
              value={formData.purpose} 
              onChange={handleChange} 
              placeholder="Masukkan tujuan peminjaman"
              rows="3"
            />
          </div>
          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-save">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModal;
