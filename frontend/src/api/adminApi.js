import axiosClient, { shouldUseMock } from './axiosClient';
import { mockStorage } from '../mock/mockStorage';
import { REPORT_STATUS, ROLES } from '../utils/constants';

export const adminApi = {
  getDashboardStats: async () => {
    if (shouldUseMock()) {
      return mockStorage.getOverallStats();
    }
    return axiosClient.get('/admin/dashboard');
  },

  getPendingReports: async (params = {}) => {
    if (shouldUseMock()) {
      return mockStorage.getReports({
        ...params,
        status: REPORT_STATUS.PENDING_VERIFICATION,
      });
    }
    return axiosClient.get('/admin/reports/pending', {
      params: { ...params, listOnly: true },
    });
  },

  getAllReports: async (params = {}) => {
    if (shouldUseMock()) {
      return mockStorage.getReports(params);
    }
    return axiosClient.get('/admin/reports', {
      params: { ...params, listOnly: true },
    });
  },

  approveReport: async (id) => {
    if (shouldUseMock()) {
      return mockStorage.updateReportStatus(
        id,
        REPORT_STATUS.APPROVED,
        null,
        'Disetujui Admin'
      );
    }
    return axiosClient.patch(`/admin/reports/${id}/approve`);
  },

  rejectReport: async (id, reason) => {
    if (shouldUseMock()) {
      return mockStorage.updateReportStatus(
        id,
        REPORT_STATUS.REJECTED,
        null,
        reason
      );
    }
    return axiosClient.patch(`/admin/reports/${id}/reject`, { reason });
  },

  getAllStaff: async (params = {}) => {
    if (shouldUseMock()) {
      return mockStorage.getUsers({ ...params, role: ROLES.STAFF });
    }
    return axiosClient.get('/admin/staff', { params });
  },

  getAllGeneralUsers: async (params = {}) => {
    if (shouldUseMock()) {
      return mockStorage.getUsers({ ...params, role: ROLES.USER });
    }
    return axiosClient.get('/admin/users', { params });
  },
};
