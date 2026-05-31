import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../../components/Layout/Layout';
import { facilityService } from '../../services/api';
import '../AdminTambahFasilitas/AdminFacilityForm.css';

const AdminEditFasilitas = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: '',
    location: '', // Detail Lokasi (manual text input)
    campus: '', // Kategori Lokasi (dropdown)
    category: '', // Kategori Fasilitas (dropdown)
    capacity: '',
    description: '',
    image: '',
    status: 'AVAILABLE', // AVAILABLE, BOOKED, MAINTENANCE
  });
  
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFacilityDetails = async () => {
      try {
        const facility = await facilityService.getFacilityDetail(id);
        setFormData({
          name: facility.name || '',
          location: facility.location || '',
          campus: facility.campus || 'Dramaga',
          category: facility.category || facility.tags || 'Auditorium',
          capacity: facility.capacity?.toString() || '',
          description: facility.description || '',
          image: facility.image || '',
          status: facility.status || 'AVAILABLE',
        });
      } catch (err) {
        setError('Gagal memuat detail fasilitas.');
      } finally {
        setLoading(false);
      }
    };

    fetchFacilityDetails();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          image: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleStatusToggle = (e) => {
    setFormData(prev => ({
      ...prev,
      status: e.target.checked ? 'AVAILABLE' : 'MAINTENANCE'
    }));
  };

  const getFallbackImage = (category) => {
    const cat = category.toLowerCase();
    if (cat.includes('auditorium')) {
      return 'https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=800&q=80';
    }
    if (cat.includes('lab') || cat.includes('komputer')) {
      return 'https://images.unsplash.com/photo-1562774053-f5a02f6dab66?auto=format&fit=crop&w=800&q=80';
    }
    if (cat.includes('gym') || cat.includes('gymnasium') || cat.includes('olahraga')) {
      return 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80';
    }
    return 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.location || !formData.campus || !formData.category || !formData.capacity) {
      setError('Semua kolom bertanda * wajib diisi.');
      return;
    }

    setSaveLoading(true);
    setError('');

    try {
      const finalImage = formData.image || getFallbackImage(formData.category);
      await facilityService.updateFacility(id, {
        name: formData.name,
        location: formData.location,
        campus: formData.campus,
        category: formData.category,
        capacity: parseInt(formData.capacity),
        description: formData.description,
        tags: formData.category, // tags are kept equal to category for compatibility
        image: finalImage,
        status: formData.status
      });
      navigate('/admin/fasilitas');
    } catch (err) {
      setError(err.response?.data?.detail || 'Gagal menyimpan perubahan fasilitas.');
    } finally {
      setSaveLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="facility-form-page" style={{ textAlign: 'center', padding: '100px 0' }}>
          <p style={{ color: '#64748B', fontSize: '16px' }}>Memuat data fasilitas...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="facility-form-page">
        <div className="form-header-wrapper" style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
          <button type="button" className="btn-back-circle" onClick={() => navigate('/admin/fasilitas')} style={{
            background: '#ffffff',
            border: '1px solid #E5E7EB',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
            color: '#012A58',
            transition: 'all 0.2s'
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
          </button>
          <div className="form-header" style={{ margin: 0 }}>
            <h1 className="form-title" style={{ margin: 0 }}>Edit Fasilitas</h1>
            <p className="form-subtitle" style={{ margin: '4px 0 0 0' }}>Ubah informasi detail untuk mengedit fasilitas yang sudah ada dalam sistem.</p>
          </div>
        </div>

        {error && (
          <div style={{
            backgroundColor: '#FEE2E2',
            border: '1px solid #FCA5A5',
            color: '#991B1B',
            padding: '12px 16px',
            borderRadius: '8px',
            fontSize: '14px',
            marginBottom: '24px',
            fontWeight: '500'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="form-container">
          {/* Left Column inputs */}
          <div className="form-left-col">
            <div className="form-group">
              <label className="form-label">Nama Fasilitas *</label>
              <input 
                type="text" 
                name="name"
                className="form-input" 
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-row-2col">
              <div className="form-group">
                <label className="form-label">Kategori Lokasi (Kampus) *</label>
                <select 
                  name="campus"
                  className="form-select"
                  value={formData.campus}
                  onChange={handleChange}
                  required
                >
                  <option value="">Pilih Kampus</option>
                  <option value="Dramaga">Dramaga</option>
                  <option value="Baranangsiang">Baranangsiang</option>
                  <option value="Cilibende">Cilibende</option>
                  <option value="Gunung Gede">Gunung Gede</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Kategori Fasilitas *</label>
                <select 
                  name="category"
                  className="form-select"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">Pilih Kategori</option>
                  <option value="Auditorium">Auditorium</option>
                  <option value="Lab Komputer">Lab Komputer</option>
                  <option value="Gymnasium">Gymnasium</option>
                  <option value="Ruang Seminar">Ruang Seminar</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Detail Lokasi (Fakultas / Gedung / Ruangan) *</label>
              <input 
                type="text" 
                name="location"
                className="form-input" 
                placeholder="Contoh: Fakultas Kehutanan Lantai 1" 
                value={formData.location}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Kapasitas (Orang) *</label>
              <input 
                type="number" 
                name="capacity"
                className="form-input" 
                value={formData.capacity}
                onChange={handleChange}
                required
                min="1"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Deskripsi Fasilitas</label>
              <textarea 
                name="description"
                className="form-textarea" 
                value={formData.description}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Right Column photo & helper */}
          <div className="form-right-col">
            <div className="form-group">
              <label className="form-label">Foto Fasilitas (Upload dari Laptop) *</label>
              <div 
                className="photo-upload-zone" 
                onClick={() => document.getElementById('facility-image-upload').click()}
                style={{ cursor: 'pointer' }}
              >
                <input 
                  type="file" 
                  id="facility-image-upload" 
                  accept="image/*" 
                  style={{ display: 'none' }} 
                  onChange={handleFileChange}
                />
                {formData.image ? (
                  <>
                    <img src={formData.image} alt="Preview" className="uploaded-preview-img" />
                    <button type="button" className="change-photo-btn" onClick={(e) => {
                      e.stopPropagation();
                      document.getElementById('facility-image-upload').click();
                    }}>Ganti Foto</button>
                  </>
                ) : (
                  <>
                    <div className="upload-icon-circle">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                    </div>
                    <span className="upload-text">Klik untuk upload foto fasilitas</span>
                    <span className="upload-subtext">Format JPG/PNG, maksimal 5MB</span>
                  </>
                )}
              </div>
            </div>

            <div className="guide-box">
              <div className="guide-icon-container">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
              </div>
              <div className="guide-content">
                <span className="guide-title">PANDUAN PENGISIAN</span>
                <ul className="guide-list">
                  <li>Resolusi foto disarankan minimal 1200x800 px</li>
                  <li>Gunakan bahasa yang formal untuk deskripsi</li>
                  <li>Double check kategori sebelum menyimpan</li>
                </ul>
              </div>
            </div>

            <div className="status-active-box">
              <div className="status-active-group">
                <input 
                  type="checkbox" 
                  id="statusToggle"
                  className="status-active-checkbox"
                  checked={formData.status === 'AVAILABLE'}
                  onChange={handleStatusToggle}
                />
                <label htmlFor="statusToggle" className="status-active-label">
                  <span className="status-active-title">Status Aktif / Tersedia</span>
                  <span className="status-active-desc">Fasilitas dapat segera dipesan setelah disimpan</span>
                </label>
              </div>
            </div>

            <div className="form-group" style={{ marginTop: '12px' }}>
              <label className="form-label">Status Alternatif</label>
              <select
                name="status"
                className="form-select"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="AVAILABLE">Tersedia (AVAILABLE)</option>
                <option value="BOOKED">Dipinjam (BOOKED)</option>
                <option value="MAINTENANCE">Perbaikan (MAINTENANCE)</option>
              </select>
            </div>
          </div>

          {/* Form Actions */}
          <div className="form-actions-row">
            <button 
              type="button" 
              className="btn-form-cancel"
              onClick={() => navigate('/admin/fasilitas')}
              disabled={saveLoading}
            >
              Batal
            </button>
            <button 
              type="submit" 
              className="btn-form-submit"
              disabled={saveLoading}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="submit-icon"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
              {saveLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default AdminEditFasilitas;
