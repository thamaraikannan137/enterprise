import EmployeeCertification from '../models/EmployeeCertification.ts';
import Employee from '../models/Employee.ts';
import { NotFoundError } from '../utils/errors.ts';

export const certificationService = {
  // Create certification
  async createCertification(data: any) {
    const employee = await Employee.findById(data.employee_id);
    if (!employee) {
      throw new NotFoundError('Employee not found');
    }

    return await EmployeeCertification.create(data);
  },

  // Get all certifications for an employee
  async getEmployeeCertifications(employeeId: string, filters: any = {}) {
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      throw new NotFoundError('Employee not found');
    }

    const query: any = { employee_id: employeeId };
    
    if (filters.is_active !== undefined) {
      query.is_active = filters.is_active === 'true' || filters.is_active === true;
    }

    if (filters.certification_type) {
      query.certification_type = filters.certification_type;
    }

    return await EmployeeCertification.find(query)
      .populate('document_id')
      .sort({ issue_date: -1 });
  },

  // Get certification by ID
  async getCertificationById(id: string) {
    const certification = await EmployeeCertification.findById(id)
      .populate('employee_id')
      .populate('document_id');
    if (!certification) {
      throw new NotFoundError('Certification not found');
    }
    return certification;
  },

  // Update certification
  async updateCertification(id: string, data: any) {
    const certification = await EmployeeCertification.findById(id);
    if (!certification) {
      throw new NotFoundError('Certification not found');
    }

    Object.assign(certification, data);
    await certification.save();
    return certification;
  },

  // Delete certification
  async deleteCertification(id: string) {
    const certification = await EmployeeCertification.findById(id);
    if (!certification) {
      throw new NotFoundError('Certification not found');
    }

    await certification.deleteOne();
    return { message: 'Certification deleted successfully' };
  },

  // Get expiring certifications
  async getExpiringCertifications(daysThreshold: number = 30) {
    const thresholdDate = new Date();
    thresholdDate.setDate(thresholdDate.getDate() + daysThreshold);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return await EmployeeCertification.find({
      is_active: true,
      expiry_date: {
        $gte: today,
        $lte: thresholdDate,
      },
    })
      .populate('employee_id', 'first_name last_name employee_code')
      .sort({ expiry_date: 1 });
  },
};
