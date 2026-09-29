import axiosClient, { shouldUseMock } from './axiosClient';
import { mockStorage } from '../mock/mockStorage';
import { REPORT_STATUS } from '../utils/constants';

export const staffApi = {
  getReports: async (params = {}) => {
    if (shouldUseMock()) {
      return mockStorage.getReports(params);
    }
    return axiosClient.get('/staff/reports', {
      params: { ...params, listOnly: true },
    });
  },

  getAssignedReports: async (staffId, params = {}) => {
    if (shouldUseMock()) {
      return mockStorage.getReports({ ...params, assignedStaffId: staffId });
    }
    return axiosClient.get('/staff/reports', {
      params: { ...params, listOnly: true },
    });
  },

  getAllQueueReports: async (params = {}) => {
    if (shouldUseMock()) {
      return mockStorage.getReports(params);
    }
    return axiosClient.get('/staff/reports', {
      params: { ...params, listOnly: true },
    });
  },

  getDashboardStats: async () => {
    if (shouldUseMock()) {
      return mockStorage.getOverallStats();
    }
    return axiosClient.get('/staff/dashboard');
  },

  processReport: async (id, notes = '') => {
    if (shouldUseMock()) {
      return mockStorage.updateReportStatus(
        id,
        REPORT_STATUS.PROCESSING,
        null,
        notes
      );
    }
    return axiosClient.patch(`/staff/reports/${id}/process`, { notes });
  },

  resolveReport: async (id, notes = '') => {
    if (shouldUseMock()) {
      return mockStorage.updateReportStatus(
        id,
        REPORT_STATUS.RESOLVED,
        null,
        notes
      );
    }
    return axiosClient.patch(`/staff/reports/${id}/resolve`, { notes });
  },
};
