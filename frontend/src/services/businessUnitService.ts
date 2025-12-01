import { apiClient } from './api';
import { API_ENDPOINTS } from '../config/constants';
import type {
  BusinessUnit,
  CreateBusinessUnitInput,
  UpdateBusinessUnitInput,
} from '../types/organization';

// Backend API response wrapper
interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export const businessUnitService = {
  /**
   * Get all business units
   */
  getBusinessUnits: async (search?: string): Promise<BusinessUnit[]> => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);

    const queryString = params.toString();
    const endpoint = queryString
      ? `${API_ENDPOINTS.BUSINESS_UNITS}?${queryString}`
      : API_ENDPOINTS.BUSINESS_UNITS;

    const response = await apiClient.get<ApiResponse<BusinessUnit[]>>(endpoint);
    return response.data;
  },

  /**
   * Get business unit by ID
   */
  getBusinessUnitById: async (id: string): Promise<BusinessUnit> => {
    const response = await apiClient.get<ApiResponse<BusinessUnit>>(
      `${API_ENDPOINTS.BUSINESS_UNITS}/${id}`
    );
    return response.data;
  },

  /**
   * Create new business unit
   */
  createBusinessUnit: async (
    businessUnitData: CreateBusinessUnitInput
  ): Promise<BusinessUnit> => {
    const response = await apiClient.post<ApiResponse<BusinessUnit>>(
      API_ENDPOINTS.BUSINESS_UNITS,
      businessUnitData
    );
    return response.data;
  },

  /**
   * Update business unit
   */
  updateBusinessUnit: async (
    id: string,
    businessUnitData: UpdateBusinessUnitInput
  ): Promise<BusinessUnit> => {
    const response = await apiClient.put<ApiResponse<BusinessUnit>>(
      `${API_ENDPOINTS.BUSINESS_UNITS}/${id}`,
      businessUnitData
    );
    return response.data;
  },

  /**
   * Delete business unit
   */
  deleteBusinessUnit: async (id: string): Promise<void> => {
    await apiClient.delete<ApiResponse<void>>(`${API_ENDPOINTS.BUSINESS_UNITS}/${id}`);
  },
};




