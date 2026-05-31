import axios from 'axios';

// Base API instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add Firebase/Mock token if available
api.interceptors.request.use((config) => {
  const userStr = localStorage.getItem('ipb_reserve_user');
  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      const token = user.token || 'mock-token-123';
      config.headers['Authorization'] = `Bearer ${token}`;
      console.log('DEBUG: Auth header set for request:', config.url);
    } catch (e) {
      console.error('DEBUG: Failed to parse user from localStorage', e);
    }
  } else {
    console.warn('DEBUG: No user found in localStorage for request:', config.url);
  }
  return config;
});

export const facilityService = {
  getFacilities: async (query = '') => {
    try {
      const response = await api.get(`/facilities${query}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching facilities:', error);
      // Fallback to empty array or throw error
      throw error;
    }
  },

  getFacilityDetail: async (id) => {
    const response = await api.get(`/facilities/${id}`);
    return response.data;
  },

  createFacility: async (data) => {
    const response = await api.post('/facilities', data);
    return response.data;
  },

  updateFacility: async (id, data) => {
    const response = await api.put(`/facilities/${id}`, data);
    return response.data;
  },

  deleteFacility: async (id) => {
    const response = await api.delete(`/facilities/${id}`);
    return response.data;
  }
};

export const reservationService = {
  getMyReservations: async () => {
    const response = await api.get('/reservations/me');
    return response.data;
  },

  getAllReservations: async () => {
    const response = await api.get('/reservations');
    return response.data;
  },

  getStats: async () => {
    const response = await api.get('/reservations/stats');
    return response.data;
  },

  createReservation: async (data) => {
    const response = await api.post('/reservations', data);
    return response.data;
  },
  
  deleteReservation: async (id) => {
    const response = await api.delete(`/reservations/${id}`);
    return response.data;
  },

  updateStatus: async (id, status, rejectionReason = null) => {
    const response = await api.put(`/reservations/${id}/status`, { status, rejection_reason: rejectionReason });
    return response.data;
  },

  reportDamage: async (id, damageReport) => {
    const response = await api.put(`/reservations/${id}/damage`, { damage_report: damageReport });
    return response.data;
  }
};

export const notificationService = {
  getNotifications: async () => {
    const response = await api.get('/notifications');
    return response.data;
  },
  markRead: async (id) => {
    const response = await api.put(`/notifications/${id}/read`);
    return response.data;
  },
  markAllRead: async () => {
    const response = await api.put('/notifications/read-all');
    return response.data;
  }
};

export default api;
