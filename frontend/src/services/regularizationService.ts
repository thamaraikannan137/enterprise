import { apiClient } from './api';
import { API_ENDPOINTS } from '../config/constants';
import type {
  RegularizationRequest,
  CreateRegularizationRequest,
  RegularizationRequestsResponse,
} from '../types/regularization';

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export const regularizationService = {
  /**
   * Create regularization request
   */
  createRequest: async (data: CreateRegularizationRequest): Promise<RegularizationRequest> => {
    const response = await apiClient.post<ApiResponse<RegularizationRequest>>(
      `${API_ENDPOINTS.REGULARIZATION}/requests`,
      data
    );
    return response.data;
  },

  /**
   * Get all regularization requests
   */
  getRequests: async (filters?: {
    employeeId?: string;
    status?: 'pending' | 'approved' | 'rejected';
    startDate?: string;
    endDate?: string;
    limit?: number;
    skip?: number;
  }): Promise<RegularizationRequestsResponse> => {
    const params = new URLSearchParams();
    if (filters?.employeeId) params.append('employeeId', filters.employeeId);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.skip) params.append('skip', filters.skip.toString());

    const queryString = params.toString();
    const endpoint = queryString
      ? `${API_ENDPOINTS.REGULARIZATION}/requests?${queryString}`
      : `${API_ENDPOINTS.REGULARIZATION}/requests`;

    const response = await apiClient.get<ApiResponse<RegularizationRequestsResponse>>(endpoint);
    return response.data;
  },

  /**
   * Get request by ID
   */
  getRequestById: async (id: string): Promise<RegularizationRequest> => {
    const response = await apiClient.get<ApiResponse<RegularizationRequest>>(
      `${API_ENDPOINTS.REGULARIZATION}/requests/${id}`
    );
    return response.data;
  },

  /**
   * Update request
   */
  updateRequest: async (
    id: string,
    data: Partial<CreateRegularizationRequest>
  ): Promise<RegularizationRequest> => {
    const response = await apiClient.put<ApiResponse<RegularizationRequest>>(
      `${API_ENDPOINTS.REGULARIZATION}/requests/${id}`,
      data
    );
    return response.data;
  },

  /**
   * Approve request
   */
  approveRequest: async (id: string, reviewNote?: string): Promise<RegularizationRequest> => {
    const response = await apiClient.post<ApiResponse<RegularizationRequest>>(
      `${API_ENDPOINTS.REGULARIZATION}/requests/${id}/approve`,
      { reviewNote }
    );
    return response.data;
  },

  /**
   * Reject request
   */
  rejectRequest: async (id: string, reviewNote: string): Promise<RegularizationRequest> => {
    const response = await apiClient.post<ApiResponse<RegularizationRequest>>(
      `${API_ENDPOINTS.REGULARIZATION}/requests/${id}/reject`,
      { reviewNote }
    );
    return response.data;
  },
};


