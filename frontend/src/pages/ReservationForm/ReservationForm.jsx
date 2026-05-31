import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Layout from '../../components/Layout/Layout';
import './ReservationForm.css';

import { facilityService, reservationService } from '../../services/api';

const ReservationForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [facilities, setFacilities] = useState([]);
  
  // Use facilityId from navigation state if available
  const initialFacilityId = location.state?.facilityId || '';
  
  const [formData, setFormData] = useState({
    facility_id: initialFacilityId,
    start_date: '',
    end_date: '',
    purpose: ''
  });
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  React.useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const data = await facilityService.getFacilities();
        setFacilities(data);
      } catch (error) {
        console.error('Failed to load facilities');
      }
    };
    fetchFacilities();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      alert('Unggah bukti pendukung wajib diisi.');
      return;
    }
    setIsLoading(true);
    try {
      await reservationService.createReservation({
        facility_id: parseInt(formData.facility_id),
        start_date: formData.start_date,
        end_date: formData.end_date,
        purpose: formData.purpose
      });
      alert('Permohonan reservasi berhasil diajukan!');
      navigate('/pengajuan-saya');
    } catch (error) {
      alert('Gagal mengajukan reservasi: ' + (error.response?.data?.detail || error.message));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="reservation-form-wrapper">
        <div className="form-card">
          <header className="form-header">
            <div className="form-header-top">
              <button className="btn-back-header" onClick={handleCancel}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
              </button>
              <h1 className="form-title">Form Peminjaman</h1>
            </div>
            <p className="form-subtitle">
              Silakan lengkapi formulir di bawah ini untuk mengajukan permohonan peminjaman fasilitas atau alat.
            </p>
          </header>

          <form onSubmit={handleSubmit} className="actual-form">
            <section className="form-section">
              <label className="section-label">Nama Fasilitas/Alat <span style={{ color: '#EF4444' }}>*</span></label>
              <div className="select-wrapper">
                <select 
                  className="form-select" 
                  name="facility_id"
                  value={formData.facility_id}
                  onChange={handleInputChange}
                  required
                >
                  <option value="" disabled>Pilih fasilitas atau alat yang ingin dipinjam...</option>
                  {facilities.map(f => (
                    <option key={f.id} value={f.id}>{f.name}</option>
                  ))}
                </select>
              </div>
            </section>

            <section className="form-section">
              <h3 className="section-heading">Jadwal Peminjaman</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Tanggal & Waktu Peminjaman <span style={{ color: '#EF4444' }}>*</span></label>
                  <input 
                    type="datetime-local" 
                    className="form-input-picker" 
                    name="start_date"
                    value={formData.start_date}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Tanggal & Waktu Pengembalian <span style={{ color: '#EF4444' }}>*</span></label>
                  <input 
                    type="datetime-local" 
                    className="form-input-picker" 
                    name="end_date"
                    value={formData.end_date}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </section>

            <section className="form-section">
              <h3 className="section-heading">Tujuan & Bukti Pendukung</h3>
              <div className="form-group">
                <label>Tujuan peminjaman <span style={{ color: '#EF4444' }}>*</span></label>
                <textarea 
                  placeholder="Jelaskan tujuan spesifik dan aktivitas yang direncanakan..." 
                  className="form-textarea"
                  rows="4"
                  name="purpose"
                  value={formData.purpose}
                  onChange={handleInputChange}
                  required
                ></textarea>
              </div>
              <div className="form-group">
                <label>Unggah Bukti Pendukung <span style={{ color: '#EF4444' }}>*</span></label>
                <div 
                  className={`upload-zone ${dragActive ? 'active' : ''} ${selectedFile ? 'has-file' : ''}`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById('file-upload').click()}
                >
                  <div className="upload-content">
                    <div className="upload-icon-box">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="12" y1="18" x2="12" y2="12"></line><polyline points="9 15 12 12 15 15"></polyline></svg>
                    </div>
                    <p className="upload-text">
                      {selectedFile ? selectedFile.name : 'Click to upload or drag and drop'}
                    </p>
                    <p className="upload-subtext">PDF, JPG, PNG (Max 5MB) - Wajib diunggah</p>
                  </div>
                  <input 
                    id="file-upload"
                    type="file" 
                    className="file-input" 
                    onChange={handleChange}
                    style={{ display: 'none' }}
                  />
                </div>
              </div>
            </section>

            <div className="form-actions">
              <button type="button" className="btn-cancel-form" onClick={handleCancel} disabled={isLoading}>CANCEL</button>
              <button type="submit" className="btn-submit-form" disabled={isLoading}>
                {isLoading ? 'SUBMITTING...' : 'SUBMIT REQUEST'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default ReservationForm;
