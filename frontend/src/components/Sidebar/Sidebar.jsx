import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Sidebar.css';

const Sidebar = ({ isCollapsed, toggleSidebar }) => {
  const navigate = useNavigate();
  const { isAuthenticated, logout, user } = useAuth();

  const handleSignOut = (e) => {
    e.preventDefault();
    logout();
    navigate('/login');
  };

  const handleSignIn = (e) => {
    e.preventDefault();
    navigate('/login');
  };

  const handleBrandClick = () => {
    if (user?.role === 'admin') {
      navigate('/admin/dashboard');
    } else {
      navigate('/');
    }
  };

  const isAdmin = isAuthenticated && user?.role === 'admin';

  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        {!isCollapsed && (
          <div className="sidebar-brand-group" onClick={handleBrandClick} style={{ cursor: 'pointer' }}>
            <h2 className="sidebar-title">IPB RESERVE</h2>
            <p className="sidebar-subtitle">Main Facility Hub</p>
          </div>
        )}
        <button className="sidebar-toggle" onClick={toggleSidebar}>
          {isCollapsed ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
          )}
        </button>
      </div>

      <nav className="sidebar-nav">
        {isAdmin ? (
          <>
            <NavLink to="/admin/dashboard" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} title="Dashboard">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="nav-icon"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
              {!isCollapsed && <span>Dashboard</span>}
            </NavLink>
            <NavLink to="/admin/fasilitas" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} title="Fasilitas">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="nav-icon"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
              {!isCollapsed && <span>Fasilitas</span>}
            </NavLink>
            <NavLink to="/admin/peminjaman" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} title="Lihat Peminjaman">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="nav-icon"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
              {!isCollapsed && <span>Lihat Peminjaman</span>}
            </NavLink>
            <NavLink to="/admin/pengajuan" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} title="Lihat Pengajuan">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="nav-icon"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
              {!isCollapsed && <span>Lihat Pengajuan</span>}
            </NavLink>
            <NavLink to="/admin/riwayat" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} title="Riwayat">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="nav-icon"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              {!isCollapsed && <span>Riwayat</span>}
            </NavLink>
          </>
        ) : (
          <>
            {isAuthenticated && (
              <NavLink to="/dashboard" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} title="Dashboard">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="nav-icon"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                {!isCollapsed && <span>Dashboard</span>}
              </NavLink>
            )}
            <NavLink to="/fasilitas" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} title="Fasilitas">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="nav-icon"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
              {!isCollapsed && <span>Fasilitas</span>}
            </NavLink>
            {isAuthenticated && (
              <>
                <NavLink to="/peminjaman-saya" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} title="Peminjaman Saya">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="nav-icon"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                  {!isCollapsed && <span>Peminjaman Saya</span>}
                </NavLink>
                <NavLink to="/pengajuan-saya" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} title="Pengajuan Saya">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="nav-icon"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                  {!isCollapsed && <span>Pengajuan Saya</span>}
                </NavLink>
                <NavLink to="/riwayat" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} title="Riwayat">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="nav-icon"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                  {!isCollapsed && <span>Riwayat</span>}
                </NavLink>
              </>
            )}
          </>
        )}
      </nav>

      <div className="sidebar-footer">
        {isAuthenticated ? (
          <a href="#" className="sign-out" onClick={handleSignOut} title="Sign Out">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="sign-out-icon"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
            {!isCollapsed && <span>Sign Out</span>}
          </a>
        ) : (
          <a href="#" className="sign-out" onClick={handleSignIn} title="Login">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="sign-out-icon"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" y1="12" x2="3" y2="12"></line></svg>
            {!isCollapsed && <span>Login</span>}
          </a>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
