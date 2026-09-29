import axiosClient, { shouldUseMock } from './axiosClient';
import { mockStorage } from '../mock/mockStorage';

export const authApi = {
  login: async (credentials) => {
    if (shouldUseMock()) {
      return mockStorage.findUserByCredentials(credentials.identifier, credentials.password);
    }
    const response = await axiosClient.post('/auth/login', credentials);
    return response;
  },

  register: async (userData) => {
    if (shouldUseMock()) {
      return mockStorage.registerUser(userData);
    }
    const response = await axiosClient.post('/auth/register', userData);
    return response;
  },

  getProfile: async () => {
    if (shouldUseMock()) {
      const storedUser = JSON.parse(localStorage.getItem('spk_current_user'));
      if (storedUser) {
        return mockStorage.getUserById(storedUser.id);
      }
      throw new Error('Tidak ada sesi aktif');
    }
    const response = await axiosClient.get('/auth/profile');
    return response;
  },

  updateProfile: async (id, data) => {
    if (shouldUseMock()) {
      return mockStorage.updateUser(id, data);
    }
    // Call /auth/profile or /users/me for self update
    const response = await axiosClient.put('/auth/profile', data);
    return response;
  },

  uploadProfilePhoto: async (file) => {
    if (shouldUseMock()) {
      const storedUser = JSON.parse(localStorage.getItem('spk_current_user'));
      const fakeUrl = URL.createObjectURL(file);
      return mockStorage.updateUser(storedUser.id, { avatar: fakeUrl });
    }
    const formData = new FormData();
    formData.append('file', file);
    const response = await axiosClient.post('/auth/profile-photo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  },

  logout: async () => {
    if (shouldUseMock()) {
      return { success: true };
    }
    return axiosClient.post('/auth/logout');
  },
};
