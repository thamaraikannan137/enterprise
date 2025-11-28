import { apiClient } from './api';
import { API_ENDPOINTS } from '../config/constants';
import type {
  EmployeeContact,
  CreateEmployeeContactInput,
  UpdateEmployeeContactInput,
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
  EmployeeFamily,
  CreateEmployeeFamilyInput,
  EmployeeExperience,
  CreateEmployeeExperienceInput,
  EmployeeEducationDetail,
  CreateEmployeeEducationDetailInput,
  EmployeeIdentity,
  CreateEmployeeIdentityInput,
  EmployeeSkills,
  CreateEmployeeSkillsInput,
  EmployeeAddress,
  CreateEmployeeAddressInput,
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

  updateContact: async (
    contactId: string,
    contactData: UpdateEmployeeContactInput
  ): Promise<EmployeeContact> => {
    if (!contactId) {
      throw new Error('Contact ID is required');
    }
    
    if (!contactData) {
      throw new Error('Contact data is required');
    }

    try {
      const response = await apiClient.put<ApiResponse<EmployeeContact>>(
        `${API_ENDPOINTS.EMPLOYEE_CONTACTS}/${contactId}`,
        contactData
      );
      
      if (response && typeof response === 'object' && 'data' in response) {
        return (response as ApiResponse<EmployeeContact>).data;
      }
      
      return response as unknown as EmployeeContact;
    } catch (error: any) {
      console.error('updateContact service error:', error);
      throw error;
    }
  },

  deleteContact: async (contactId: string): Promise<void> => {
    await apiClient.delete<ApiResponse<void>>(
      `${API_ENDPOINTS.EMPLOYEE_CONTACTS}/${contactId}`
    );
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

  // ========== FAMILY ==========
  getEmployeeFamily: async (employeeId: string): Promise<EmployeeFamily | null> => {
    try {
      const response = await apiClient.get<ApiResponse<EmployeeFamily>>(
        `${API_ENDPOINTS.EMPLOYEE_FAMILY}/employee/${employeeId}`
      );
      return response.data;
    } catch (error: any) {
      if (error?.response?.status === 404) return null;
      throw error;
    }
  },

  createOrUpdateFamily: async (employeeId: string, familyData: CreateEmployeeFamilyInput): Promise<EmployeeFamily> => {
    try {
      // Try to get existing family
      const existing = await employeeRelatedService.getEmployeeFamily(employeeId);
      if (existing) {
        const response = await apiClient.put<ApiResponse<EmployeeFamily>>(
          `${API_ENDPOINTS.EMPLOYEE_FAMILY}/${existing.id}`,
          familyData
        );
        return response.data;
      } else {
        const response = await apiClient.post<ApiResponse<EmployeeFamily>>(
          API_ENDPOINTS.EMPLOYEE_FAMILY,
          { ...familyData, employee_id: employeeId }
        );
        return response.data;
      }
    } catch (error: any) {
      console.error('createOrUpdateFamily error:', error);
      throw error;
    }
  },

  // ========== EXPERIENCE ==========
  getEmployeeExperience: async (employeeId: string): Promise<EmployeeExperience | null> => {
    try {
      const response = await apiClient.get<ApiResponse<EmployeeExperience>>(
        `${API_ENDPOINTS.EMPLOYEE_EXPERIENCE}/employee/${employeeId}`
      );
      return response.data;
    } catch (error: any) {
      if (error?.response?.status === 404) return null;
      throw error;
    }
  },

  createOrUpdateExperience: async (employeeId: string, experienceData: CreateEmployeeExperienceInput): Promise<EmployeeExperience> => {
    try {
      const existing = await employeeRelatedService.getEmployeeExperience(employeeId);
      if (existing) {
        const response = await apiClient.put<ApiResponse<EmployeeExperience>>(
          `${API_ENDPOINTS.EMPLOYEE_EXPERIENCE}/${existing.id}`,
          experienceData
        );
        return response.data;
      } else {
        const response = await apiClient.post<ApiResponse<EmployeeExperience>>(
          API_ENDPOINTS.EMPLOYEE_EXPERIENCE,
          { ...experienceData, employee_id: employeeId }
        );
        return response.data;
      }
    } catch (error: any) {
      console.error('createOrUpdateExperience error:', error);
      throw error;
    }
  },

  // ========== EDUCATION DETAIL ==========
  getEmployeeEducationDetail: async (employeeId: string): Promise<EmployeeEducationDetail | null> => {
    try {
      const response = await apiClient.get<ApiResponse<EmployeeEducationDetail>>(
        `${API_ENDPOINTS.EMPLOYEE_EDUCATION_DETAIL}/employee/${employeeId}`
      );
      return response.data;
    } catch (error: any) {
      if (error?.response?.status === 404) return null;
      throw error;
    }
  },

  createOrUpdateEducationDetail: async (employeeId: string, educationData: CreateEmployeeEducationDetailInput): Promise<EmployeeEducationDetail> => {
    try {
      const existing = await employeeRelatedService.getEmployeeEducationDetail(employeeId);
      if (existing) {
        const response = await apiClient.put<ApiResponse<EmployeeEducationDetail>>(
          `${API_ENDPOINTS.EMPLOYEE_EDUCATION_DETAIL}/${existing.id}`,
          educationData
        );
        return response.data;
      } else {
        const response = await apiClient.post<ApiResponse<EmployeeEducationDetail>>(
          API_ENDPOINTS.EMPLOYEE_EDUCATION_DETAIL,
          { ...educationData, employee_id: employeeId }
        );
        return response.data;
      }
    } catch (error: any) {
      console.error('createOrUpdateEducationDetail error:', error);
      throw error;
    }
  },

  // ========== IDENTITY ==========
  getEmployeeIdentity: async (employeeId: string): Promise<EmployeeIdentity | null> => {
    try {
      const response = await apiClient.get<ApiResponse<EmployeeIdentity>>(
        `${API_ENDPOINTS.EMPLOYEE_IDENTITY}/employee/${employeeId}`
      );
      return response.data;
    } catch (error: any) {
      if (error?.response?.status === 404) return null;
      throw error;
    }
  },

  createOrUpdateIdentity: async (employeeId: string, identityData: CreateEmployeeIdentityInput): Promise<EmployeeIdentity> => {
    try {
      const existing = await employeeRelatedService.getEmployeeIdentity(employeeId);
      if (existing) {
        const response = await apiClient.put<ApiResponse<EmployeeIdentity>>(
          `${API_ENDPOINTS.EMPLOYEE_IDENTITY}/${existing.id}`,
          identityData
        );
        return response.data;
      } else {
        const response = await apiClient.post<ApiResponse<EmployeeIdentity>>(
          API_ENDPOINTS.EMPLOYEE_IDENTITY,
          { ...identityData, employee_id: employeeId }
        );
        return response.data;
      }
    } catch (error: any) {
      console.error('createOrUpdateIdentity error:', error);
      throw error;
    }
  },

  // ========== SKILLS ==========
  getEmployeeSkills: async (employeeId: string): Promise<EmployeeSkills | null> => {
    try {
      const response = await apiClient.get<ApiResponse<EmployeeSkills>>(
        `${API_ENDPOINTS.EMPLOYEE_SKILLS}/employee/${employeeId}`
      );
      return response.data;
    } catch (error: any) {
      if (error?.response?.status === 404) return null;
      throw error;
    }
  },

  createOrUpdateSkills: async (employeeId: string, skillsData: CreateEmployeeSkillsInput): Promise<EmployeeSkills> => {
    try {
      const existing = await employeeRelatedService.getEmployeeSkills(employeeId);
      if (existing) {
        const response = await apiClient.put<ApiResponse<EmployeeSkills>>(
          `${API_ENDPOINTS.EMPLOYEE_SKILLS}/${existing.id}`,
          skillsData
        );
        return response.data;
      } else {
        const response = await apiClient.post<ApiResponse<EmployeeSkills>>(
          API_ENDPOINTS.EMPLOYEE_SKILLS,
          { ...skillsData, employee_id: employeeId }
        );
        return response.data;
      }
    } catch (error: any) {
      console.error('createOrUpdateSkills error:', error);
      throw error;
    }
  },

  // ========== ADDRESS ==========
  getEmployeeAddress: async (employeeId: string): Promise<EmployeeAddress | null> => {
    try {
      const response = await apiClient.get<ApiResponse<EmployeeAddress>>(
        `${API_ENDPOINTS.EMPLOYEE_ADDRESS}/employee/${employeeId}`
      );
      return response.data;
    } catch (error: any) {
      if (error?.response?.status === 404) return null;
      throw error;
    }
  },

  createOrUpdateAddress: async (employeeId: string, addressData: CreateEmployeeAddressInput): Promise<EmployeeAddress> => {
    try {
      const existing = await employeeRelatedService.getEmployeeAddress(employeeId);
      if (existing) {
        const response = await apiClient.put<ApiResponse<EmployeeAddress>>(
          `${API_ENDPOINTS.EMPLOYEE_ADDRESS}/${existing.id}`,
          addressData
        );
        return response.data;
      } else {
        const response = await apiClient.post<ApiResponse<EmployeeAddress>>(
          API_ENDPOINTS.EMPLOYEE_ADDRESS,
          { ...addressData, employee_id: employeeId }
        );
        return response.data;
      }
    } catch (error: any) {
      console.error('createOrUpdateAddress error:', error);
      throw error;
    }
  },
};


