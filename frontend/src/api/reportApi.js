import axiosClient, { shouldUseMock } from './axiosClient';
import { mockStorage } from '../mock/mockStorage';
import { REPORT_STATUS } from '../utils/constants';

export const reportApi = {
  getAll: async (params = {}) => {
    if (shouldUseMock()) {
      return mockStorage.getReports(params);
    }
    const response = await axiosClient.get('/admin/reports', {
      params: { ...params, listOnly: true },
    });
    return response;
  },

  getMyReports: async (userId, params = {}) => {
    if (shouldUseMock()) {
      return mockStorage.getReports({ ...params, userId });
    }
    const response = await axiosClient.get('/api/reports/my', {
      params: { ...params, listOnly: true },
    });
    return response;
  },

  getById: async (id) => {
    if (shouldUseMock()) {
      return mockStorage.getReportById(id);
    }
    return axiosClient.get(`/api/reports/${id}`);
  },

  getPending: async (params = {}) => {
    if (shouldUseMock()) {
      return mockStorage.getReports({
        ...params,
        status: REPORT_STATUS.PENDING_VERIFICATION,
      });
    }
    const response = await axiosClient.get('/admin/reports/pending', {
      params: { ...params, listOnly: true },
    });
    return response;
  },

  create: async (reportData, currentUser) => {
    if (shouldUseMock()) {
      return mockStorage.createReport(reportData, currentUser);
    }

    // Check if reportData is FormData or regular object
    if (reportData instanceof FormData) {
      return axiosClient.post('/api/reports', reportData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    }

    return axiosClient.post('/api/reports', reportData);
  },

  approve: async (id) => {
    if (shouldUseMock()) {
      return mockStorage.updateReportStatus(
        id,
        REPORT_STATUS.APPROVED,
        null,
        'Laporan disetujui Admin'
      );
    }
    return axiosClient.patch(`/admin/reports/${id}/approve`);
  },

  reject: async (id, reason) => {
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

  process: async (id, notes = '') => {
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

  resolve: async (id, notes = '') => {
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

  updateStatus: async (reportId, status, actorUser, notes = '') => {
    if (shouldUseMock()) {
      return mockStorage.updateReportStatus(reportId, status, actorUser, notes);
    }

    if (status === REPORT_STATUS.APPROVED || status === 'Disetujui') {
      return axiosClient.patch(`/admin/reports/${reportId}/approve`);
    }
    if (status === REPORT_STATUS.REJECTED || status === 'Ditolak') {
      return axiosClient.patch(`/admin/reports/${reportId}/reject`, {
        reason: notes || 'Ditolak oleh Admin',
      });
    }
    if (status === REPORT_STATUS.PROCESSING || status === 'Diproses') {
      return axiosClient.patch(`/staff/reports/${reportId}/process`, { notes });
    }
    if (status === REPORT_STATUS.RESOLVED || status === 'Ditangani') {
      return axiosClient.patch(`/staff/reports/${reportId}/resolve`, { notes });
    }

    return axiosClient.get(`/api/reports/${reportId}`);
  },

  getStats: async () => {
    if (shouldUseMock()) {
      return mockStorage.getOverallStats();
    }
    return axiosClient.get('/admin/dashboard');
  },
};
