import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import logoIPB from '../../assets/logo-ipb.png';
import './UserLogin.css';

const UserIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const LockIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);

const ArrowRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"></line>
    <polyline points="12 5 19 12 12 19"></polyline>
  </svg>
);

const AdminIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="sign-in-icon">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);

import { useAuth } from '../../context/AuthContext';

const UserLogin = () => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      await login(email, password);
      navigate('/fasilitas');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      <Header />
      <main className="admin-login-main">
        <div className="login-card">
          <div className="login-logo-container">
            <div className="login-logo-placeholder">
              <img src={logoIPB} alt="IPB Logo" className="login-logo-img" />
            </div>
            <h1 className="login-title">IPB RESERVE</h1>
            <p className="login-subtitle">Sistem Peminjaman Fasilitas</p>
          </div>

          <form className="login-form" onSubmit={handleLogin}>
            {error && <div className="error-message" style={{ color: 'red', fontSize: '12px', marginBottom: '10px', textAlign: 'center' }}>{error}</div>}
            
            <Input 
              label="EMAIL" 
              type="email" 
              placeholder="nama@apps.ipb.ac.id" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<UserIcon />} 
              required
            />
            <Input 
              label="PASSWORD" 
              type="password" 
              placeholder="Enter your password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<LockIcon />} 
              required
            />
            
            <div className="login-button-container">
              <Button type="submit" icon={<ArrowRightIcon />} disabled={isLoading}>
                {isLoading ? 'LOGGING IN...' : 'LOGIN'}
              </Button>
            </div>
          </form>

          <div className="login-footer">
            <a href="#" className="forgot-password">Forgot Password</a>
            
            <div className="divider"></div>
            
            <Link to="/admin" className="sign-in-user">
              <AdminIcon />
              Sign in as Admin
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserLogin;
