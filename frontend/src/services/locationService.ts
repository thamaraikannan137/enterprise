import { apiClient } from './api';
import { API_ENDPOINTS } from '../config/constants';
import type {
  Location,
  CreateLocationInput,
  UpdateLocationInput,
} from '../types/organization';

// Backend API response wrapper
interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export const locationService = {
  /**
   * Get all locations
   */
  getLocations: async (search?: string): Promise<Location[]> => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);

    const queryString = params.toString();
    const endpoint = queryString
      ? `${API_ENDPOINTS.LOCATIONS}?${queryString}`
      : API_ENDPOINTS.LOCATIONS;

    const response = await apiClient.get<ApiResponse<Location[]>>(endpoint);
    return response.data;
  },

  /**
   * Get location by ID
   */
  getLocationById: async (id: string): Promise<Location> => {
    const response = await apiClient.get<ApiResponse<Location>>(
      `${API_ENDPOINTS.LOCATIONS}/${id}`
    );
    return response.data;
  },

  /**
   * Create new location
   */
  createLocation: async (
    locationData: CreateLocationInput
  ): Promise<Location> => {
    const response = await apiClient.post<ApiResponse<Location>>(
      API_ENDPOINTS.LOCATIONS,
      locationData
    );
    return response.data;
  },

  /**
   * Update location
   */
  updateLocation: async (
    id: string,
    locationData: UpdateLocationInput
  ): Promise<Location> => {
    const response = await apiClient.put<ApiResponse<Location>>(
      `${API_ENDPOINTS.LOCATIONS}/${id}`,
      locationData
    );
    return response.data;
  },

  /**
   * Delete location
   */
  deleteLocation: async (id: string): Promise<void> => {
    await apiClient.delete<ApiResponse<void>>(`${API_ENDPOINTS.LOCATIONS}/${id}`);
  },
};





