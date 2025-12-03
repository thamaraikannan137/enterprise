import { apiClient } from './api';
import { API_ENDPOINTS } from '../config/constants';
import type {
  AttendanceLog,
  ClockInOutRequest,
  AttendanceStatus,
  AttendanceLogsResponse,
} from '../types/attendance';

// Backend API response wrapper
interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export const attendanceService = {
  /**
   * Clock In
   */
  clockIn: async (data: ClockInOutRequest): Promise<AttendanceLog> => {
    const response = await apiClient.post<ApiResponse<AttendanceLog>>(
      `${API_ENDPOINTS.ATTENDANCE}/clock-in`,
      data
    );
    return response.data;
  },

  /**
   * Clock Out
   */
  clockOut: async (data: ClockInOutRequest): Promise<AttendanceLog> => {
    const response = await apiClient.post<ApiResponse<AttendanceLog>>(
      `${API_ENDPOINTS.ATTENDANCE}/clock-out`,
      data
    );
    return response.data;
  },

  /**
   * Get current attendance status
   */
  getCurrentStatus: async (employeeId: string): Promise<AttendanceStatus> => {
    const response = await apiClient.get<ApiResponse<AttendanceStatus>>(
      `${API_ENDPOINTS.ATTENDANCE}/status/${employeeId}`
    );
    return response.data;
  },

  /**
   * Get today's attendance logs
   */
  getTodayAttendance: async (employeeId: string): Promise<AttendanceLog[]> => {
    const response = await apiClient.get<ApiResponse<AttendanceLog[]>>(
      `${API_ENDPOINTS.ATTENDANCE}/today/${employeeId}`
    );
    return response.data;
  },

  /**
   * Get attendance logs with filters
   */
  getAttendanceLogs: async (
    employeeId: string,
    filters?: {
      startDate?: string;
      endDate?: string;
      limit?: number;
      skip?: number;
    }
  ): Promise<AttendanceLogsResponse> => {
    const params = new URLSearchParams();
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.skip) params.append('skip', filters.skip.toString());

    const queryString = params.toString();
    const endpoint = queryString
      ? `${API_ENDPOINTS.ATTENDANCE}/logs/${employeeId}?${queryString}`
      : `${API_ENDPOINTS.ATTENDANCE}/logs/${employeeId}`;

    const response = await apiClient.get<ApiResponse<AttendanceLogsResponse>>(endpoint);
    return response.data;
  },

  /**
   * Get monthly attendance summary
   */
  getMonthlyAttendance: async (
    employeeId: string,
    year?: number,
    month?: number
  ): Promise<{
    year: number;
    month: number;
    dailyStatus: { [key: string]: any };
    totalDays: number;
  }> => {
    const params = new URLSearchParams();
    if (year) params.append('year', year.toString());
    if (month) params.append('month', month.toString());

    const queryString = params.toString();
    const endpoint = queryString
      ? `${API_ENDPOINTS.ATTENDANCE}/monthly/${employeeId}?${queryString}`
      : `${API_ENDPOINTS.ATTENDANCE}/monthly/${employeeId}`;

    const response = await apiClient.get<ApiResponse<any>>(endpoint);
    return response.data;
  },

  /**
   * Get attendance summary for a specific date
   */
  getAttendanceSummary: async (
    employeeId: string,
    date: string
  ): Promise<any> => {
    const params = new URLSearchParams();
    params.append('date', date);

    const endpoint = `${API_ENDPOINTS.ATTENDANCE}/summary/${employeeId}?${params.toString()}`;
    const response = await apiClient.get<ApiResponse<any>>(endpoint);
    return response.data;
  },

  /**
   * Get attendance summaries for a date range (similar to Keka format)
   * Returns array of daily summaries with validInOutPairs and timeEntries
   */
  getAttendanceSummaryRange: async (
    employeeId: string,
    startDate: string,
    endDate: string
  ): Promise<any[]> => {
    const params = new URLSearchParams();
    params.append('startDate', startDate);
    params.append('endDate', endDate);

    const endpoint = `${API_ENDPOINTS.ATTENDANCE}/summary-range/${employeeId}?${params.toString()}`;
    const response = await apiClient.get<ApiResponse<any[]>>(endpoint);
    return response.data;
  },
};

