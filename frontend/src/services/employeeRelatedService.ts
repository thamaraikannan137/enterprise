import { apiClient } from './api';
import { API_ENDPOINTS } from '../config/constants';
import type {
  EmployeeContact,
  CreateEmployeeContactInput,
  EmployeeCompensation,
  CreateEmployeeCompensationInput,
  UpdateEmployeeCompensationInput,
  EmployeeDocument,
  CreateEmployeeDocumentInput,
  EmployeeWorkPass,
  CreateEmployeeWorkPassInput,
  EmployeeCertification,
  CreateEmployeeCertificationInput,
  EmployeeQualification,
  CreateEmployeeQualificationInput,
} from '../types/employeeRelated';

// Backend API response wrapper
interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export const employeeRelatedService = {
  // ========== CONTACTS ==========
  createContact: async (contactData: CreateEmployeeContactInput): Promise<EmployeeContact> => {
    const response = await apiClient.post<ApiResponse<EmployeeContact>>(
      API_ENDPOINTS.EMPLOYEE_CONTACTS,
      contactData
    );
    return response.data;
  },

  getEmployeeContacts: async (employeeId: string): Promise<EmployeeContact[]> => {
    const response = await apiClient.get<ApiResponse<EmployeeContact[]>>(
      `${API_ENDPOINTS.EMPLOYEE_CONTACTS}/employee/${employeeId}`
    );
    return response.data;
  },

  // ========== COMPENSATION ==========
  createCompensation: async (
    compensationData: CreateEmployeeCompensationInput
  ): Promise<EmployeeCompensation> => {
    const response = await apiClient.post<ApiResponse<EmployeeCompensation>>(
      API_ENDPOINTS.EMPLOYEE_COMPENSATION,
      compensationData
    );
    return response.data;
  },

  getEmployeeCompensations: async (employeeId: string): Promise<EmployeeCompensation[]> => {
    const response = await apiClient.get<ApiResponse<EmployeeCompensation[]>>(
      `${API_ENDPOINTS.EMPLOYEE_COMPENSATION}/employee/${employeeId}`
    );
    return response.data;
  },

  updateCompensation: async (
    compensationId: string,
    compensationData: UpdateEmployeeCompensationInput
  ): Promise<EmployeeCompensation> => {
    if (!compensationId) {
      throw new Error('Compensation ID is required');
    }
    
    if (!compensationData) {
      throw new Error('Compensation data is required');
    }

    try {
      const response = await apiClient.put<ApiResponse<EmployeeCompensation>>(
        `${API_ENDPOINTS.EMPLOYEE_COMPENSATION}/${compensationId}`,
        compensationData
      );
      
      // apiClient.put returns response.data from axios, which is the ApiResponse<T>
      // So response is ApiResponse<EmployeeCompensation> = { success: boolean, message?: string, data: EmployeeCompensation }
      // We need to return response.data to get the EmployeeCompensation
      if (response && typeof response === 'object' && 'data' in response) {
        return (response as ApiResponse<EmployeeCompensation>).data;
      }
      
      // Fallback: if response structure is different (shouldn't happen with proper API)
      return response as unknown as EmployeeCompensation;
    } catch (error: any) {
      console.error('updateCompensation service error:', error);
      throw error;
    }
  },

  deleteCompensation: async (compensationId: string): Promise<void> => {
    await apiClient.delete<ApiResponse<void>>(
      `${API_ENDPOINTS.EMPLOYEE_COMPENSATION}/${compensationId}`
    );
  },

  // ========== DOCUMENTS ==========
  createDocument: async (documentData: CreateEmployeeDocumentInput): Promise<EmployeeDocument> => {
    const response = await apiClient.post<ApiResponse<EmployeeDocument>>(
      API_ENDPOINTS.EMPLOYEE_DOCUMENTS,
      documentData
    );
    return response.data;
  },

  getEmployeeDocuments: async (employeeId: string): Promise<EmployeeDocument[]> => {
    const response = await apiClient.get<ApiResponse<EmployeeDocument[]>>(
      `${API_ENDPOINTS.EMPLOYEE_DOCUMENTS}/employee/${employeeId}`
    );
    return response.data;
  },

  // ========== WORK PASSES ==========
  createWorkPass: async (workPassData: CreateEmployeeWorkPassInput): Promise<EmployeeWorkPass> => {
    const response = await apiClient.post<ApiResponse<EmployeeWorkPass>>(
      API_ENDPOINTS.WORK_PASSES,
      workPassData
    );
    return response.data;
  },

  getEmployeeWorkPasses: async (employeeId: string): Promise<EmployeeWorkPass[]> => {
    const response = await apiClient.get<ApiResponse<EmployeeWorkPass[]>>(
      `${API_ENDPOINTS.WORK_PASSES}/employee/${employeeId}`
    );
    return response.data;
  },

  // ========== CERTIFICATIONS ==========
  createCertification: async (
    certificationData: CreateEmployeeCertificationInput
  ): Promise<EmployeeCertification> => {
    const formData = new FormData();
    Object.entries(certificationData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (value instanceof File) {
          formData.append(key, value);
        } else {
          formData.append(key, String(value));
        }
      }
    });

    const response = await apiClient.post<ApiResponse<EmployeeCertification>>(
      API_ENDPOINTS.CERTIFICATIONS,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },

  getEmployeeCertifications: async (employeeId: string): Promise<EmployeeCertification[]> => {
    const response = await apiClient.get<ApiResponse<EmployeeCertification[]>>(
      `${API_ENDPOINTS.CERTIFICATIONS}/employee/${employeeId}`
    );
    return response.data;
  },

  // ========== QUALIFICATIONS ==========
  createQualification: async (
    qualificationData: CreateEmployeeQualificationInput
  ): Promise<EmployeeQualification> => {
    const formData = new FormData();
    Object.entries(qualificationData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (value instanceof File) {
          formData.append(key, value);
        } else {
          formData.append(key, String(value));
        }
      }
    });

    const response = await apiClient.post<ApiResponse<EmployeeQualification>>(
      API_ENDPOINTS.QUALIFICATIONS,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },

  getEmployeeQualifications: async (employeeId: string): Promise<EmployeeQualification[]> => {
    const response = await apiClient.get<ApiResponse<EmployeeQualification[]>>(
      `${API_ENDPOINTS.QUALIFICATIONS}/employee/${employeeId}`
    );
    return response.data;
  },
};


