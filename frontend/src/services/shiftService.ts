import { apiClient } from './api';
import { API_ENDPOINTS } from '../config/constants';
import type { Shift, CreateShiftInput } from '../types/shift';

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export const shiftService = {
  getShifts: async (filters?: { isActive?: boolean; locationId?: string }): Promise<Shift[]> => {
    const params = new URLSearchParams();
    if (filters?.isActive !== undefined) params.append('isActive', filters.isActive.toString());
    if (filters?.locationId) params.append('locationId', filters.locationId);

    const queryString = params.toString();
    const endpoint = queryString
      ? `${API_ENDPOINTS.SHIFTS}?${queryString}`
      : API_ENDPOINTS.SHIFTS;

    const response = await apiClient.get<ApiResponse<Shift[]>>(endpoint);
    console.log('getShifts response:', response);
    // apiClient.get already returns response.data from axios
    // Backend returns { success, message, data }, so response is that object
    // We need response.data to get the actual array
    const shifts = (response as ApiResponse<Shift[]>).data || [];
    console.log('Extracted shifts:', shifts);
    console.log('First shift ID:', shifts[0]?.id);
    return shifts;
  },

  getShiftById: async (id: string): Promise<Shift> => {
    const response = await apiClient.get<ApiResponse<Shift>>(`${API_ENDPOINTS.SHIFTS}/${id}`);
    return (response as ApiResponse<Shift>).data;
  },

  createShift: async (data: CreateShiftInput): Promise<Shift> => {
    const response = await apiClient.post<ApiResponse<Shift>>(API_ENDPOINTS.SHIFTS, data);
    return (response as ApiResponse<Shift>).data;
  },

  updateShift: async (id: string, data: Partial<CreateShiftInput>): Promise<Shift> => {
    try {
      console.log('Updating shift:', id, data);
      const response = await apiClient.put<ApiResponse<Shift>>(`${API_ENDPOINTS.SHIFTS}/${id}`, data);
      return (response as ApiResponse<Shift>).data;
    } catch (error: any) {
      console.error('Update shift error:', error);
      console.error('Full error object:', JSON.stringify(error, null, 2));
      if (error.response) {
        console.error('Error response:', error.response.data);
      }
      throw error;
    }
  },

  deleteShift: async (id: string): Promise<void> => {
    try {
      console.log('Deleting shift:', id);
      await apiClient.delete<ApiResponse<void>>(`${API_ENDPOINTS.SHIFTS}/${id}`);
    } catch (error: any) {
      console.error('Delete shift error:', error);
      console.error('Full error object:', JSON.stringify(error, null, 2));
      if (error.response) {
        console.error('Error response:', error.response.data);
      }
      throw error;
    }
  },
};

