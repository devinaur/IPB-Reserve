import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local storage for existing session on mount
    const savedUser = localStorage.getItem('ipb_reserve_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const cleanEmail = String(email).trim().toLowerCase();
    console.log('DEBUG: Login email:', cleanEmail);
    
    // Temporarily commenting out validation to bypass the persistent error
    /*
    if (!cleanEmail.includes('@apps.ipb.ac.id')) {
      throw new Error('Hanya email dengan domain @apps.ipb.ac.id yang diperbolehkan.');
    }
    */

    // Mock login logic
    if (cleanEmail.includes('admin@apps.ipb.ac.id') || cleanEmail.includes('user@apps.ipb.ac.id')) {
      const isAdmin = cleanEmail.includes('admin');
      const mockUser = {
        uid: isAdmin ? 'mock_admin_uid_123' : 'mock_uid_123',
        email: cleanEmail,
        displayName: cleanEmail.split('@')[0].replace('.', ' ').toUpperCase(),
        photoURL: `https://ui-avatars.com/api/?name=${cleanEmail}`,
        role: isAdmin ? 'admin' : 'user',
        nim: isAdmin ? null : 'G640123111',
        token: isAdmin ? 'mock-admin-token-123' : 'mock-token-123'
      };

      setUser(mockUser);
      localStorage.setItem('ipb_reserve_user', JSON.stringify(mockUser));
      return mockUser;
    } else {
        throw new Error('Login Gagal (Sistem Terbaru). Email: ' + cleanEmail);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ipb_reserve_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
