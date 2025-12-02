import { apiClient } from './api';
import { API_ENDPOINTS } from '../config/constants';
import type { Holiday, CreateHolidayInput } from '../types/holiday';

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export const holidayService = {
  getHolidays: async (filters?: {
    year?: number;
    locationId?: string;
    isActive?: boolean;
  }): Promise<Holiday[]> => {
    const params = new URLSearchParams();
    if (filters?.year) params.append('year', filters.year.toString());
    if (filters?.locationId) params.append('locationId', filters.locationId);
    if (filters?.isActive !== undefined) params.append('isActive', filters.isActive.toString());

    const queryString = params.toString();
    const endpoint = queryString
      ? `${API_ENDPOINTS.HOLIDAYS}?${queryString}`
      : API_ENDPOINTS.HOLIDAYS;

    const response = await apiClient.get<ApiResponse<Holiday[]>>(endpoint);
    // apiClient.get already returns response.data from axios
    // Backend returns { success, message, data }, so response is that object
    // We need response.data to get the actual array
    const holidays = (response as ApiResponse<Holiday[]>).data || [];
    console.log('Extracted holidays:', holidays);
    console.log('First holiday ID:', holidays[0]?.id);
    return holidays;
  },

  getHolidayById: async (id: string): Promise<Holiday> => {
    const response = await apiClient.get<ApiResponse<Holiday>>(`${API_ENDPOINTS.HOLIDAYS}/${id}`);
    return (response as ApiResponse<Holiday>).data;
  },

  createHoliday: async (data: CreateHolidayInput): Promise<Holiday> => {
    const response = await apiClient.post<ApiResponse<Holiday>>(API_ENDPOINTS.HOLIDAYS, data);
    return (response as ApiResponse<Holiday>).data;
  },

  updateHoliday: async (id: string, data: Partial<CreateHolidayInput>): Promise<Holiday> => {
    try {
      console.log('Updating holiday:', id, data);
      const response = await apiClient.put<ApiResponse<Holiday>>(`${API_ENDPOINTS.HOLIDAYS}/${id}`, data);
      return (response as ApiResponse<Holiday>).data;
    } catch (error: any) {
      console.error('Update holiday error:', error);
      console.error('Full error object:', JSON.stringify(error, null, 2));
      if (error.response) {
        console.error('Error response:', error.response.data);
      }
      throw error;
    }
  },

  deleteHoliday: async (id: string): Promise<void> => {
    try {
      console.log('Deleting holiday:', id);
      await apiClient.delete<ApiResponse<void>>(`${API_ENDPOINTS.HOLIDAYS}/${id}`);
    } catch (error: any) {
      console.error('Delete holiday error:', error);
      console.error('Full error object:', JSON.stringify(error, null, 2));
      if (error.response) {
        console.error('Error response:', error.response.data);
      }
      throw error;
    }
  },
};

