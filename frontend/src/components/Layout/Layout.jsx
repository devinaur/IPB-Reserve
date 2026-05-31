import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import avatar from '../../assets/avatar.png';
import { useAuth } from '../../context/AuthContext';
import { notificationService } from '../../services/api';
import './Layout.css';

const Layout = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const fetchNotifications = async () => {
    try {
      const data = await notificationService.getNotifications();
      data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setNotifications(data);
    } catch (err) {
      console.error('DEBUG: Failed to fetch notifications:', err);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 15000); // refresh every 15s
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const handleNotifClick = async (notif) => {
    try {
      await notificationService.markRead(notif.id);
      fetchNotifications();
      setShowNotifDropdown(false);
      navigate(notif.link);
    } catch (err) {
      console.error('Failed to mark notification read:', err);
      navigate(notif.link);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllRead();
      fetchNotifications();
    } catch (err) {
      console.error('Failed to mark all notifications read:', err);
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;
  const rootPaths = ['/', '/dashboard', '/admin/dashboard', '/login', '/admin'];
  const isRootPath = rootPaths.includes(location.pathname);

  return (
    <div className={`layout-container ${isCollapsed ? 'collapsed' : ''}`}>
      <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />
      <div className="layout-main">
        <div className="layout-topbar">
          {!isRootPath ? (
            <button className="topbar-back-btn" onClick={() => navigate(-1)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="back-icon"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
              Kembali
            </button>
          ) : (
            <div />
          )}
          
          <div className="topbar-right">
            {isAuthenticated && (
              <div className="notification-wrapper">
                <button className="btn-notification" onClick={() => setShowNotifDropdown(!showNotifDropdown)} title="Notifikasi">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                  {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
                </button>
                {showNotifDropdown && (
                  <div className="notif-dropdown">
                    <div className="notif-header">
                      <span>Notifikasi</span>
                      {unreadCount > 0 && (
                        <button className="btn-mark-read" onClick={handleMarkAllRead}>
                          Tandai semua dibaca
                        </button>
                      )}
                    </div>
                    <div className="notif-list">
                      {notifications.length > 0 ? (
                        notifications.map((notif) => (
                          <div 
                            key={notif.id} 
                            className={`notif-item ${!notif.is_read ? 'unread' : ''}`}
                            onClick={() => handleNotifClick(notif)}
                          >
                            <h4 className="notif-item-title">{notif.title}</h4>
                            <p className="notif-item-message">{notif.message}</p>
                            <span className="notif-item-time">
                              {new Date(notif.created_at).toLocaleDateString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        ))
                      ) : (
                        <div className="notif-empty">Tidak ada notifikasi</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {isAuthenticated ? (
              <Link to="/profile" className="user-profile-link">
                <div className="user-profile">
                  <div className="avatar">
                    <img src={user.photoURL || avatar} alt="Avatar" />
                  </div>
                  <span className="user-id">
                    {user.role === 'admin' ? 'Admin' : (user.nim || user.displayName || user.email)}
                  </span>
                </div>
              </Link>
            ) : (
              <div className="user-profile">
                 <span className="user-id">Tamu</span>
              </div>
            )}
          </div>
        </div>
        <div className="layout-content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
