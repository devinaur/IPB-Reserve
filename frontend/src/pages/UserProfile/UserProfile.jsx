import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout/Layout';
import { useAuth } from '../../context/AuthContext';
import './UserProfile.css';

const UserProfile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <Layout>
      <div className="profile-page-wrapper">
        <header className="profile-header">
          <div className="header-text">
            <h1 className="profile-title">Profil</h1>
            <p className="profile-subtitle">Kelola informasi pribadi dan pengaturan akun Anda.</p>
          </div>
        </header>

        <div className="profile-content">
          <div className="profile-left-col">
            <div className="profile-card avatar-card">
              <div className="avatar-placeholder">
                <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
              </div>
               <h2 className="user-name">{user?.displayName || 'User'}</h2>
              <p className="user-id-tag">{user?.role?.toUpperCase() || 'USER'}</p>
              <button className="btn-change-photo">Ubah Foto</button>
            </div>

            <div className="profile-card status-card">
              <h3 className="card-section-title">ACCOUNT STATUS</h3>
              <div className="status-item">
                <div className="status-info">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                  <span>Verified</span>
                </div>
                <span className="badge-active">ACTIVE</span>
              </div>
              <div className="status-item">
                <div className="status-info">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                  <span>Joined Jun 2023</span>
                </div>
              </div>
            </div>
          </div>

          <div className="profile-right-col">
            <div className="profile-card info-card">
              <div className="card-header">
                <h3 className="card-section-title">Informasi Data Diri</h3>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              </div>
              <div className="form-grid">
                 <div className="form-group full-width">
                  <label>Nama Lengkap</label>
                  <input type="text" value={user?.displayName || ''} disabled className="disabled-input" />
                </div>
                <div className="form-group">
                  <label>NIM</label>
                  <input type="text" value={user?.nim || 'G640123111'} disabled className="disabled-input" />
                </div>
                <div className="form-group">
                  <label>Email Institusi</label>
                  <input type="text" value={user?.email || ''} disabled className="disabled-input" />
                </div>
              </div>
            </div>

            <div className="profile-card settings-card">
              <div className="card-header">
                <h3 className="card-section-title">Pengaturan Akun</h3>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
              </div>
              <div className="form-group">
                <label>No. Telepon (WhatsApp)</label>
                <input type="text" placeholder="+62 8XX XXXX XXXX" className="form-input" />
              </div>
              <div className="form-group">
                <label>Alamat Domisili</label>
                <textarea 
                  placeholder="Masukkan alamat lengkap domisili Anda saat ini..." 
                  className="form-textarea"
                  rows="4"
                ></textarea>
              </div>
            </div>

            <div className="profile-actions">
              <button className="btn-cancel" onClick={() => navigate(-1)}>Cancel</button>
              <button className="btn-save" onClick={() => alert('Profile saved!')}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UserProfile;
