import api from '../utils/api';

export const registerUser = async (userData) => {
  try {
    const response = await api.post('/api/user/register', userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Registration failed' };
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await api.post('/api/user/login', credentials);
    
    // Save token if login successful
    if (response.data.success && response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Login failed' };
  }
};

export const getUserProfile = async () => {
  try {
    const response = await api.get('/api/user/profile');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to get profile' };
  }
};

export const logoutUser = () => {
  localStorage.removeItem('token');
  window.location.href = '/login';
};