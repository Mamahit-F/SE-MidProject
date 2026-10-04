export const ROLES = {
  USER: 'USER',
  STAFF: 'STAFF',
  ADMIN: 'ADMIN',
};

export const REPORT_STATUS = {
  PENDING_VERIFICATION: 'PENDING_VERIFICATION',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  PROCESSING: 'PROCESSING',
  RESOLVED: 'RESOLVED',

  // Backward-compatibility aliases for legacy references if any
  MENUNGGU: 'PENDING_VERIFICATION',
  DISETUJUI: 'APPROVED',
  DITOLAK: 'REJECTED',
  DIPROSES: 'PROCESSING',
  DITANGANI: 'RESOLVED',
};

export const STATUS_LABELS = {
  [REPORT_STATUS.PENDING_VERIFICATION]: 'Menunggu Verifikasi',
  [REPORT_STATUS.APPROVED]: 'Disetujui',
  [REPORT_STATUS.REJECTED]: 'Ditolak',
  [REPORT_STATUS.PROCESSING]: 'Diproses',
  [REPORT_STATUS.RESOLVED]: 'Ditangani',
};

export const BUILDINGS = [
  { value: 'GK1', label: 'Gedung Kuliah 1 (GK1)' },
  { value: 'GK2', label: 'Gedung Kuliah 2 (GK2)' },
  { value: 'GK3', label: 'Gedung Kuliah 3 (GK3)' },
  { value: 'GA', label: 'Gedung Administrasi (GA)' },
  { value: 'PC', label: 'Pioneer Chapel (PC)' },
  { value: 'EAST_HALL', label: 'East Hall' },
  { value: 'PARKING_LOT', label: 'Parking Lot' },
  { value: 'OTHER', label: 'Lainnya' },
];

export const BUILDING_LABELS = {
  GK1: 'Gedung Kuliah 1 (GK1)',
  GK2: 'Gedung Kuliah 2 (GK2)',
  GK3: 'Gedung Kuliah 3 (GK3)',
  GA: 'Gedung Administrasi (GA)',
  PC: 'Pioneer Chapel (PC)',
  EAST_HALL: 'East Hall',
  PARKING_LOT: 'Parking Lot',
  OTHER: 'Lainnya',
};

export const REPORT_CATEGORIES = [
  'Sisa Makanan',
  'Bangkai Hewan',
  'Kotoran Hewan',
  'Berdebu',
  'Genangan Air',
  'Banyak Daun Jatuh',
  'Tempat Sampah Penuh / Bau',
  'Lantai Basah / Licin',
  'Lainnya',
];

// Legacy list retained for backward-compatibility
export const BUILDING_LOCATIONS = [
  'Gedung Kuliah 1 (GK1)',
  'Gedung Kuliah 2 (GK2)',
  'Gedung Kuliah 3 (GK3)',
  'Gedung Administrasi (GA)',
  'Pioneer Chapel (PC)',
  'East Hall',
  'Parking Lot',
  'Lainnya',
];
