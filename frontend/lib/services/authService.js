// frontend/lib/services/authService.js
import apiClient from '../api';

const authService = {
  login: function (username, password) {
    return apiClient.post('/auth/login', { username, password });
  },

  logout: function () {
    return apiClient.post('/auth/logout');
  },

  getMe: function () {
    return apiClient.get('/auth/me');
  },

  changePassword: function (currentPassword, newPassword, confirmPassword) {
    return apiClient.put('/auth/change-password', {
      currentPassword,
      newPassword,
      confirmPassword,
    });
  },

  refreshToken: function (refreshToken) {
    return apiClient.post('/auth/refresh-token', { refreshToken });
  },
};

export default authService;