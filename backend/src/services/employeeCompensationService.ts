import EmployeeCompensation from '../models/EmployeeCompensation.ts';
import Employee from '../models/Employee.ts';
import { NotFoundError } from '../utils/errors.ts';

export const employeeCompensationService = {
  // Create compensation
  async createCompensation(data: any) {
    // Verify employee exists
    const employee = await Employee.findById(data.employee_id);
    if (!employee) {
      throw new NotFoundError('Employee not found');
    }

    // If this is marked as current, unmark all others
    if (data.is_current) {
      await EmployeeCompensation.updateMany(
        { employee_id: data.employee_id },
        { is_current: false }
      );
    }

    return await EmployeeCompensation.create(data);
  },

  // Get all compensation records for an employee
  async getEmployeeCompensations(employeeId: string) {
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      throw new NotFoundError('Employee not found');
    }

    return await EmployeeCompensation.find({ employee_id: employeeId })
      .sort({ effective_from: -1 });
  },

  // Get current compensation
  async getCurrentCompensation(employeeId: string) {
    return await EmployeeCompensation.findOne({ employee_id: employeeId, is_current: true });
  },

  // Get compensation by ID
  async getCompensationById(id: string) {
    const compensation = await EmployeeCompensation.findById(id);
    if (!compensation) {
      throw new NotFoundError('Compensation record not found');
    }
    return compensation;
  },

  // Update compensation
  async updateCompensation(id: string, data: any) {
    const compensation = await EmployeeCompensation.findById(id);
    if (!compensation) {
      throw new NotFoundError('Compensation record not found');
    }

    // If marking as current, unmark all others
    if (data.is_current) {
      await EmployeeCompensation.updateMany(
        { employee_id: compensation.employee_id },
        { is_current: false }
      );
    }

    Object.assign(compensation, data);
    await compensation.save();
    return compensation;
  },

  // Delete compensation
  async deleteCompensation(id: string) {
    const compensation = await EmployeeCompensation.findById(id);
    if (!compensation) {
      throw new NotFoundError('Compensation record not found');
    }

    await compensation.deleteOne();
    return { message: 'Compensation record deleted successfully' };
  },

  // Get compensation history for employee
  async getCompensationHistory(employeeId: string) {
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      throw new NotFoundError('Employee not found');
    }

    return await EmployeeCompensation.find({ employee_id: employeeId })
      .sort({ effective_from: -1 });
  },
};
