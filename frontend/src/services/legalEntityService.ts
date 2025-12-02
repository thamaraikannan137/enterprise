import { apiClient } from './api';
import { API_ENDPOINTS } from '../config/constants';
import type {
  LegalEntity,
  CreateLegalEntityInput,
  UpdateLegalEntityInput,
} from '../types/organization';

// Backend API response wrapper
interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export const legalEntityService = {
  /**
   * Get all legal entities
   */
  getLegalEntities: async (search?: string): Promise<LegalEntity[]> => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);

    const queryString = params.toString();
    const endpoint = queryString
      ? `${API_ENDPOINTS.LEGAL_ENTITIES}?${queryString}`
      : API_ENDPOINTS.LEGAL_ENTITIES;

    const response = await apiClient.get<ApiResponse<LegalEntity[]>>(endpoint);
    return response.data;
  },

  /**
   * Get legal entity by ID
   */
  getLegalEntityById: async (id: string): Promise<LegalEntity> => {
    const response = await apiClient.get<ApiResponse<LegalEntity>>(
      `${API_ENDPOINTS.LEGAL_ENTITIES}/${id}`
    );
    return response.data;
  },

  /**
   * Create new legal entity
   */
  createLegalEntity: async (
    legalEntityData: CreateLegalEntityInput
  ): Promise<LegalEntity> => {
    const response = await apiClient.post<ApiResponse<LegalEntity>>(
      API_ENDPOINTS.LEGAL_ENTITIES,
      legalEntityData
    );
    return response.data;
  },

  /**
   * Update legal entity
   */
  updateLegalEntity: async (
    id: string,
    legalEntityData: UpdateLegalEntityInput
  ): Promise<LegalEntity> => {
    const response = await apiClient.put<ApiResponse<LegalEntity>>(
      `${API_ENDPOINTS.LEGAL_ENTITIES}/${id}`,
      legalEntityData
    );
    return response.data;
  },

  /**
   * Delete legal entity
   */
  deleteLegalEntity: async (id: string): Promise<void> => {
    await apiClient.delete<ApiResponse<void>>(`${API_ENDPOINTS.LEGAL_ENTITIES}/${id}`);
  },
};





