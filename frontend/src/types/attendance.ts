export interface AttendanceLog {
  id: string;
  employeeId: string;
  punchType: 'web' | 'gps' | 'biometric';
  event: 'IN' | 'OUT';
  timestamp: string;
  actualTimestamp: string;
  adjustedTimestamp?: string;
  originalPunchStatus: number;
  modifiedPunchStatus?: number;
  punchStatus: number;
  geoLocation?: {
    latitude: number;
    longitude: number;
  };
  locationAddress?: {
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    state?: string;
    countryCode?: string;
    zip?: string;
    freeFormAddress?: string;
  };
  hasAddress: boolean;
  premiseId?: string;
  premiseName?: string;
  attendanceLogSource: number;
  attendanceLogSourceIdentifier?: string;
  ipAddress?: string;
  isRemoteClockIn: boolean;
  isAdjusted: boolean;
  isDeleted: boolean;
  isManuallyAdded: boolean;
  manualClockinType: number;
  pairSubSequentLogs: boolean;
  note?: string;
  attachmentId?: string;
  created_by?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ClockInOutRequest {
  employeeId: string;
  note?: string;
  locationAddress?: {
    latitude: number;
    longitude: number;
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    state?: string;
    countryCode?: string;
    zip?: string;
    freeFormAddress?: string;
  };
  ipAddress?: string;
}

export interface AttendanceStatus {
  status: 'IN' | 'OUT' | null;
  lastPunchTime: string | null;
  message: string;
}

export interface AttendanceLogsResponse {
  logs: AttendanceLog[];
  total: number;
  limit: number;
  skip: number;
}

