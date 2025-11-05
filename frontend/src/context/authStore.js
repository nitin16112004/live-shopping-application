import { create } from 'zustand';
import { authAPI } from '../services/api';
import socketService from '../services/socket';

export const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  loading: false,
  error: null,

  login: async (credentials) => {
    set({ loading: true, error: null });
    try {
      const response = await authAPI.login(credentials);
      const { token, ...user } = response.data;
      
      localStorage.setItem('token', token);
      socketService.connect(token);
      
      set({ user, token, isAuthenticated: true, loading: false });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  register: async (userData) => {
    set({ loading: true, error: null });
    try {
      const response = await authAPI.register(userData);
      const { token, ...user } = response.data;
      
      localStorage.setItem('token', token);
      socketService.connect(token);
      
      set({ user, token, isAuthenticated: true, loading: false });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed';
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    socketService.disconnect();
    set({ user: null, token: null, isAuthenticated: false });
  },

  loadUser: async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      set({ isAuthenticated: false });
      return;
    }

    set({ loading: true });
    try {
      const response = await authAPI.getMe();
      socketService.connect(token);
      set({ user: response.data, isAuthenticated: true, loading: false });
    } catch (error) {
      localStorage.removeItem('token');
      set({ user: null, token: null, isAuthenticated: false, loading: false });
    }
  }
}));
