import { apiClient } from './api';
import { API_ENDPOINTS } from '../config/constants';
import type {
  Employee,
  EmployeeWithDetails,
  CreateEmployeeInput,
  UpdateEmployeeInput,
  EmployeeFilters,
  EmployeeListResponse,
} from '../types/employee';

// Backend API response wrapper
interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export const employeeService = {
  /**
   * Get all employees with pagination and filters
   */
  getEmployees: async (filters?: EmployeeFilters): Promise<EmployeeListResponse> => {
    const params = new URLSearchParams();
    
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.search) params.append('search', filters.search);

    const queryString = params.toString();
    const endpoint = queryString 
      ? `${API_ENDPOINTS.EMPLOYEES}?${queryString}`
      : API_ENDPOINTS.EMPLOYEES;

    const response = await apiClient.get<ApiResponse<EmployeeListResponse>>(endpoint);
    return response.data;
  },

  /**
   * Get employee by ID
   */
  getEmployeeById: async (id: string): Promise<Employee> => {
    const response = await apiClient.get<ApiResponse<Employee>>(
      `${API_ENDPOINTS.EMPLOYEES}/${id}`
    );
    return response.data;
  },

  /**
   * Get employee with all related details
   */
  getEmployeeWithDetails: async (id: string): Promise<EmployeeWithDetails> => {
    const response = await apiClient.get<ApiResponse<EmployeeWithDetails>>(
      `${API_ENDPOINTS.EMPLOYEES}/${id}/details`
    );
    return response.data;
  },

  /**
   * Create new employee
   */
  createEmployee: async (employeeData: CreateEmployeeInput): Promise<Employee> => {
    const response = await apiClient.post<ApiResponse<Employee>>(
      API_ENDPOINTS.EMPLOYEES,
      employeeData
    );
    return response.data;
  },

  /**
   * Update employee
   */
  updateEmployee: async (
    id: string,
    employeeData: UpdateEmployeeInput
  ): Promise<Employee> => {
    const response = await apiClient.put<ApiResponse<Employee>>(
      `${API_ENDPOINTS.EMPLOYEES}/${id}`,
      employeeData
    );
    return response.data;
  },

  /**
   * Delete employee
   */
  deleteEmployee: async (id: string): Promise<void> => {
    await apiClient.delete<ApiResponse<void>>(`${API_ENDPOINTS.EMPLOYEES}/${id}`);
  },

  /**
   * Upload profile photo
   */
  uploadProfilePhoto: async (file: File): Promise<string> => {
    try {
      const formData = new FormData();
      formData.append('profile_photo', file);

      const axiosInstance = apiClient.getAxiosInstance();
      const response = await axiosInstance.post<ApiResponse<{ filePath: string }>>(
        `${API_ENDPOINTS.EMPLOYEES}/upload-profile-photo`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      console.log('Upload response:', response.data);
      
      if (response.data.success && response.data.data?.filePath) {
        return response.data.data.filePath;
      } else {
        throw new Error(response.data.message || 'Upload failed - invalid response');
      }
    } catch (error: any) {
      console.error('Upload error details:', error);
      if (error.response) {
        const errorMessage = error.response.data?.message || error.response.data?.error || 'Upload failed';
        throw new Error(errorMessage);
      }
      throw error;
    }
  },
};

