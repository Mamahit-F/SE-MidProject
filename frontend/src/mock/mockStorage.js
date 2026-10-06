import { INITIAL_USERS, INITIAL_REPORTS } from './initialData';
import { REPORT_STATUS, ROLES } from '../utils/constants';

const USERS_STORAGE_KEY = 'spk_users_db_v1';
const REPORTS_STORAGE_KEY = 'spk_reports_db_v1';

const sleep = (ms = 180) => new Promise((resolve) => setTimeout(resolve, ms));

const getStoredUsers = () => {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(INITIAL_USERS));
      return INITIAL_USERS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_USERS;
  }
};

const saveUsers = (users) => {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
};

const getStoredReports = () => {
  try {
    const raw = localStorage.getItem(REPORTS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(REPORTS_STORAGE_KEY, JSON.stringify(INITIAL_REPORTS));
      return INITIAL_REPORTS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_REPORTS;
  }
};

const saveReports = (reports) => {
  localStorage.setItem(REPORTS_STORAGE_KEY, JSON.stringify(reports));
};

export const mockStorage = {
  resetToDefaults: async () => {
    await sleep(100);
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(INITIAL_USERS));
    localStorage.setItem(REPORTS_STORAGE_KEY, JSON.stringify(INITIAL_REPORTS));
    return true;
  },

  // Auth & User operations
  findUserByCredentials: async (identifier, password) => {
    await sleep(250);
    const users = getStoredUsers();
    // Default mock passwords accepted: any password for prototype or 'password'
    const user = users.find(
      (u) =>
        (u.email.toLowerCase() === identifier.toLowerCase() ||
          u.username.toLowerCase() === identifier.toLowerCase()) &&
        u.status === 'ACTIVE'
    );
    if (!user) {
      throw new Error('Email/Username atau password tidak cocok atau akun dinonaktifkan.');
    }
    return {
      token: `mock_jwt_token_${user.id}_${Date.now()}`,
      user,
    };
  },

  registerUser: async (userData) => {
    await sleep(300);
    const users = getStoredUsers();
    
    // Check if email already exists
    if (users.some((u) => u.email.toLowerCase() === userData.email.toLowerCase())) {
      throw new Error('Email ini sudah terdaftar. Silakan gunakan email lain atau login.');
    }
    
    // Check if username already exists
    if (users.some((u) => u.username.toLowerCase() === userData.username.toLowerCase())) {
      throw new Error('Username sudah digunakan. Pilih username lain.');
    }

    const newUser = {
      id: `USR-${String(users.length + 1).padStart(3, '0')}`,
      name: userData.name,
      username: userData.username,
      email: userData.email,
      role: ROLES.USER,
      status: 'ACTIVE',
      phone: userData.phone || '-',
      department: userData.department || 'Pengguna Fasilitas',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.username}`,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    saveUsers(users);

    return {
      token: `mock_jwt_token_${newUser.id}_${Date.now()}`,
      user: newUser,
    };
  },

  getUsers: async ({ role, search, status } = {}) => {
    await sleep(200);
    let users = getStoredUsers();

    if (role && role !== 'ALL') {
      users = users.filter((u) => u.role === role);
    }
    if (status && status !== 'ALL') {
      users = users.filter((u) => u.status === status);
    }
    if (search) {
      const q = search.toLowerCase();
      users = users.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          u.username.toLowerCase().includes(q) ||
          (u.department && u.department.toLowerCase().includes(q))
      );
    }

    return users;
  },

  getUserById: async (id) => {
    await sleep(150);
    const users = getStoredUsers();
    const user = users.find((u) => u.id === id);
    if (!user) throw new Error('Pengguna tidak ditemukan.');
    return user;
  },

  updateUser: async (id, updates) => {
    await sleep(250);
    const users = getStoredUsers();
    const index = users.findIndex((u) => u.id === id);
    if (index === -1) throw new Error('Pengguna tidak ditemukan.');

    users[index] = { ...users[index], ...updates };
    saveUsers(users);
    return users[index];
  },

  toggleUserStatus: async (id) => {
    await sleep(200);
    const users = getStoredUsers();
    const index = users.findIndex((u) => u.id === id);
    if (index === -1) throw new Error('Pengguna tidak ditemukan.');

    const currentStatus = users[index].status;
    users[index].status = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    saveUsers(users);
    return users[index];
  },

  createUserByAdmin: async (userData) => {
    await sleep(300);
    const users = getStoredUsers();
    const prefix = userData.role === ROLES.STAFF ? 'STF' : userData.role === ROLES.ADMIN ? 'ADM' : 'USR';
    
    if (users.some((u) => u.email.toLowerCase() === userData.email.toLowerCase())) {
      throw new Error('Email sudah digunakan.');
    }
    if (users.some((u) => u.username.toLowerCase() === userData.username.toLowerCase())) {
      throw new Error('Username sudah digunakan.');
    }

    const newUser = {
      id: `${prefix}-${String(users.length + 1).padStart(3, '0')}`,
      name: userData.name,
      username: userData.username,
      email: userData.email,
      role: userData.role || ROLES.USER,
      status: 'ACTIVE',
      phone: userData.phone || '-',
      department: userData.department || 'Divisi Fasilitas',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.username}`,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    saveUsers(users);
    return newUser;
  },

  // Report Operations
  getReports: async ({ status, search, userId, assignedStaffId, sortBy = 'newest' } = {}) => {
    await sleep(220);
    let reports = getStoredReports();

    if (userId) {
      reports = reports.filter((r) => r.userId === userId);
    }
    if (assignedStaffId) {
      reports = reports.filter((r) => r.assignedStaffId === assignedStaffId);
    }
    if (status && status !== 'ALL') {
      reports = reports.filter((r) => r.status === status);
    }
    if (search) {
      const q = search.toLowerCase();
      reports = reports.filter(
        (r) =>
          r.id.toLowerCase().includes(q) ||
          r.location.toLowerCase().includes(q) ||
          (r.title && r.title.toLowerCase().includes(q)) ||
          r.description.toLowerCase().includes(q) ||
          (r.category && r.category.toLowerCase().includes(q))
      );
    }

    if (sortBy === 'newest') {
      reports.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === 'oldest') {
      reports.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }

    return reports;
  },

  getReportById: async (id) => {
    await sleep(180);
    const reports = getStoredReports();
    const report = reports.find((r) => r.id === id);
    if (!report) throw new Error('Laporan tidak ditemukan.');
    return report;
  },

  createReport: async (reportData, currentUser) => {
    await sleep(350);
    const reports = getStoredReports();
    const reportCount = reports.length + 1;
    const year = new Date().getFullYear();
    const newId = `REP-${year}-${String(reportCount).padStart(3, '0')}`;

    const building = reportData.building || 'OTHER';
    const room = reportData.room || reportData.location || '-';
    const location = reportData.location || `${building} - ${room}`;

    const now = new Date().toISOString();
    const newReport = {
      id: newId,
      title: reportData.title || `Laporan Kebersihan di ${location.split('(')[0].trim()}`,
      building: building,
      room: room,
      location: location,
      category: reportData.category || 'Lainnya',
      description: reportData.description,
      imageUrl: reportData.imageUrl || 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&auto=format&fit=crop&q=80',
      status: REPORT_STATUS.PENDING_VERIFICATION || REPORT_STATUS.MENUNGGU,
      urgency: reportData.urgency || 'MEDIUM',
      userId: currentUser ? currentUser.id : 'USR-001',
      userName: currentUser ? currentUser.name : 'Pengguna',
      userEmail: currentUser ? currentUser.email : 'user@kebersihan.id',
      assignedStaffId: null,
      assignedStaffName: null,
      createdAt: now,
      inProgressAt: null,
      completedAt: null,
      timeline: [
        {
          status: REPORT_STATUS.MENUNGGU,
          title: 'Laporan Dibuat',
          description: `Laporan dibuat oleh ${currentUser ? currentUser.name : 'Pengguna'} dan sedang menunggu respon petugas.`,
          timestamp: now,
          actor: currentUser ? `${currentUser.name} (Pelapor)` : 'Pelapor',
        },
      ],
      notes: '',
    };

    reports.unshift(newReport);
    saveReports(reports);
    return newReport;
  },

  updateReportStatus: async (reportId, newStatus, actorUser, notes = '') => {
    await sleep(250);
    const reports = getStoredReports();
    const index = reports.findIndex((r) => r.id === reportId);
    if (index === -1) throw new Error('Laporan tidak ditemukan.');

    const report = reports[index];
    const now = new Date().toISOString();

    report.status = newStatus;
    if (notes) {
      report.notes = notes;
    }

    if (newStatus === REPORT_STATUS.DIPROSES) {
      report.inProgressAt = now;
      if (actorUser) {
        report.assignedStaffId = actorUser.id;
        report.assignedStaffName = actorUser.name;
      }
      report.timeline.push({
        status: REPORT_STATUS.DIPROSES,
        title: 'Penanganan Dimulai',
        description: notes || `Petugas ${actorUser ? actorUser.name : ''} telah memulai penanganan di lokasi.`,
        timestamp: now,
        actor: actorUser ? `${actorUser.name} (${actorUser.role})` : 'Petugas Kebersihan',
      });
    } else if (newStatus === REPORT_STATUS.DITANGANI) {
      report.completedAt = now;
      report.timeline.push({
        status: REPORT_STATUS.DITANGANI,
        title: 'Laporan Selesai Ditangani',
        description: notes || 'Pekerjaan kebersihan selesai dan area telah siap digunakan kembali.',
        timestamp: now,
        actor: actorUser ? `${actorUser.name} (${actorUser.role})` : 'Petugas Kebersihan',
      });
    }

    reports[index] = report;
    saveReports(reports);
    return report;
  },

  // Dashboard Stats
  getOverallStats: async () => {
    await sleep(200);
    const reports = getStoredReports();
    const users = getStoredUsers();

    const totalReports = reports.length;
    const waiting = reports.filter((r) => r.status === REPORT_STATUS.MENUNGGU).length;
    const inProgress = reports.filter((r) => r.status === REPORT_STATUS.DIPROSES).length;
    const resolved = reports.filter((r) => r.status === REPORT_STATUS.DITANGANI).length;

    const totalUsers = users.filter((u) => u.role === ROLES.USER).length;
    const totalStaff = users.filter((u) => u.role === ROLES.STAFF).length;

    // Location distribution
    const locationCounts = {};
    reports.forEach((r) => {
      const locKey = r.location.split('-')[0].trim() || r.location;
      locationCounts[locKey] = (locationCounts[locKey] || 0) + 1;
    });

    return {
      totalReports,
      waiting,
      inProgress,
      resolved,
      totalUsers,
      totalStaff,
      locationCounts,
    };
  },

  getNotifications: async () => {
    await sleep(150);
    const raw = localStorage.getItem('spk_mock_notifications');
    return raw ? JSON.parse(raw) : [];
  },

  getUnreadNotificationCount: async () => {
    await sleep(100);
    const raw = localStorage.getItem('spk_mock_notifications');
    const list = raw ? JSON.parse(raw) : [];
    return { count: list.filter((n) => !n.isRead).length };
  },

  markNotificationAsRead: async (id) => {
    await sleep(100);
    const raw = localStorage.getItem('spk_mock_notifications');
    const list = raw ? JSON.parse(raw) : [];
    const item = list.find((n) => n.id === id);
    if (item) item.isRead = true;
    localStorage.setItem('spk_mock_notifications', JSON.stringify(list));
    return item;
  },

  markAllNotificationsAsRead: async () => {
    await sleep(100);
    const raw = localStorage.getItem('spk_mock_notifications');
    const list = raw ? JSON.parse(raw) : [];
    list.forEach((n) => { n.isRead = true; });
    localStorage.setItem('spk_mock_notifications', JSON.stringify(list));
    return { message: 'All marked as read' };
  },
};
