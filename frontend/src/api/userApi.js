import axiosClient, { shouldUseMock } from './axiosClient';
import { mockStorage } from '../mock/mockStorage';
import { ROLES } from '../utils/constants';

export const userApi = {
  getUsers: async (params = {}) => {
    if (shouldUseMock()) {
      return mockStorage.getUsers(params);
    }
    return axiosClient.get('/api/admin/users', { params });
  },

  getById: async (id) => {
    if (shouldUseMock()) {
      return mockStorage.getUserById(id);
    }
    return axiosClient.get(`/api/admin/users/${id}`);
  },

  create: async (userData) => {
    if (shouldUseMock()) {
      return mockStorage.createUserByAdmin(userData);
    }
    return axiosClient.post('/api/admin/users', userData);
  },

  update: async (id, data) => {
    if (shouldUseMock()) {
      return mockStorage.updateUser(id, data);
    }
    return axiosClient.put(`/api/admin/users/${id}`, data);
  },

  toggleStatus: async (id) => {
    if (shouldUseMock()) {
      return mockStorage.toggleUserStatus(id);
    }
    return axiosClient.patch(`/api/admin/users/${id}/toggle-status`);
  },

  getDashboardStats: async () => {
    if (shouldUseMock()) {
      return mockStorage.getOverallStats();
    }
    return axiosClient.get('/api/user/dashboard');
  },
};

export const staffApi = {
  getAssignedReports: async (staffId, params = {}) => {
    if (shouldUseMock()) {
      return mockStorage.getReports({ ...params, assignedStaffId: staffId });
    }
    return axiosClient.get('/api/staff/reports', {
      params: { ...params, listOnly: true },
    });
  },

  getAllQueueReports: async (params = {}) => {
    if (shouldUseMock()) {
      return mockStorage.getReports(params);
    }
    return axiosClient.get('/api/staff/reports', {
      params: { ...params, listOnly: true },
    });
  },
};

export const adminApi = {
  getDashboardStats: async () => {
    if (shouldUseMock()) {
      return mockStorage.getOverallStats();
    }
    return axiosClient.get('/api/admin/dashboard');
  },

  getAllStaff: async (params = {}) => {
    if (shouldUseMock()) {
      return mockStorage.getUsers({ ...params, role: ROLES.STAFF });
    }
    return axiosClient.get('/api/admin/staff', { params });
  },

  getAllGeneralUsers: async (params = {}) => {
    if (shouldUseMock()) {
      return mockStorage.getUsers({ ...params, role: ROLES.USER });
    }
    return axiosClient.get('/api/admin/users', { params });
  },
};
