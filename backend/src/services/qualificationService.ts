import EmployeeQualification from '../models/EmployeeQualification.ts';
import Employee from '../models/Employee.ts';
import { NotFoundError } from '../utils/errors.ts';

export const qualificationService = {
  // Create qualification
  async createQualification(data: any) {
    const employee = await Employee.findById(data.employee_id);
    if (!employee) {
      throw new NotFoundError('Employee not found');
    }

    return await EmployeeQualification.create(data);
  },

  // Get all qualifications for an employee
  async getEmployeeQualifications(employeeId: string, filters: any = {}) {
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      throw new NotFoundError('Employee not found');
    }

    const query: any = { employee_id: employeeId };
    
    if (filters.verification_status) {
      query.verification_status = filters.verification_status;
    }

    return await EmployeeQualification.find(query)
      .populate('document_id')
      .sort({ completion_year: -1 });
  },

  // Get qualification by ID
  async getQualificationById(id: string) {
    const qualification = await EmployeeQualification.findById(id)
      .populate('employee_id')
      .populate('document_id');
    if (!qualification) {
      throw new NotFoundError('Qualification not found');
    }
    return qualification;
  },

  // Update qualification
  async updateQualification(id: string, data: any) {
    const qualification = await EmployeeQualification.findById(id);
    if (!qualification) {
      throw new NotFoundError('Qualification not found');
    }

    Object.assign(qualification, data);
    await qualification.save();
    return qualification;
  },

  // Delete qualification
  async deleteQualification(id: string) {
    const qualification = await EmployeeQualification.findById(id);
    if (!qualification) {
      throw new NotFoundError('Qualification not found');
    }

    await qualification.deleteOne();
    return { message: 'Qualification deleted successfully' };
  },

  // Verify qualification
  async verifyQualification(id: string, status: 'verified' | 'rejected') {
    const qualification = await EmployeeQualification.findById(id);
    if (!qualification) {
      throw new NotFoundError('Qualification not found');
    }

    qualification.verification_status = status;
    await qualification.save();
    return qualification;
  },
};
