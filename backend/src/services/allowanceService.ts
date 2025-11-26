import AllowanceType from '../models/AllowanceType.ts';
import EmployeeAllowance from '../models/EmployeeAllowance.ts';
import Employee from '../models/Employee.ts';
import { NotFoundError, ConflictError } from '../utils/errors.ts';

export const allowanceService = {
  // AllowanceType CRUD
  async createAllowanceType(data: any) {
    const existing = await AllowanceType.findOne({ name: data.name });
    if (existing) {
      throw new ConflictError('Allowance type with this name already exists');
    }
    return await AllowanceType.create(data);
  },

  async getAllAllowanceTypes(filters: any = {}) {
    const query: any = {};
    if (filters.is_active !== undefined) {
      query.is_active = filters.is_active === 'true' || filters.is_active === true;
    }
    return await AllowanceType.find(query).sort({ name: 1 });
  },

  async getAllowanceTypeById(id: string) {
    const allowanceType = await AllowanceType.findById(id);
    if (!allowanceType) {
      throw new NotFoundError('Allowance type not found');
    }
    return allowanceType;
  },

  async updateAllowanceType(id: string, data: any) {
    const allowanceType = await AllowanceType.findById(id);
    if (!allowanceType) {
      throw new NotFoundError('Allowance type not found');
    }

    if (data.name && data.name !== allowanceType.name) {
      const existing = await AllowanceType.findOne({ name: data.name });
      if (existing) {
        throw new ConflictError('Allowance type with this name already exists');
      }
    }

    Object.assign(allowanceType, data);
    await allowanceType.save();
    return allowanceType;
  },

  async deleteAllowanceType(id: string) {
    const allowanceType = await AllowanceType.findById(id);
    if (!allowanceType) {
      throw new NotFoundError('Allowance type not found');
    }
    allowanceType.is_active = false;
    await allowanceType.save();
    return { message: 'Allowance type deactivated successfully' };
  },

  // EmployeeAllowance CRUD
  async createEmployeeAllowance(data: any) {
    const employee = await Employee.findById(data.employee_id);
    if (!employee) {
      throw new NotFoundError('Employee not found');
    }

    const allowanceType = await AllowanceType.findById(data.allowance_type_id);
    if (!allowanceType) {
      throw new NotFoundError('Allowance type not found');
    }

    return await EmployeeAllowance.create(data);
  },

  async getEmployeeAllowances(employeeId: string, filters: any = {}) {
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      throw new NotFoundError('Employee not found');
    }

    const query: any = { employee_id: employeeId };
    if (filters.is_active !== undefined) {
      query.is_active = filters.is_active === 'true' || filters.is_active === true;
    }

    return await EmployeeAllowance.find(query)
      .populate('allowance_type_id')
      .sort({ effective_from: -1 });
  },

  async getEmployeeAllowanceById(id: string) {
    const allowance = await EmployeeAllowance.findById(id)
      .populate('allowance_type_id')
      .populate('employee_id');
    if (!allowance) {
      throw new NotFoundError('Employee allowance not found');
    }
    return allowance;
  },

  async updateEmployeeAllowance(id: string, data: any) {
    const allowance = await EmployeeAllowance.findById(id);
    if (!allowance) {
      throw new NotFoundError('Employee allowance not found');
    }
    Object.assign(allowance, data);
    await allowance.save();
    return allowance;
  },

  async deleteEmployeeAllowance(id: string) {
    const allowance = await EmployeeAllowance.findById(id);
    if (!allowance) {
      throw new NotFoundError('Employee allowance not found');
    }
    await allowance.deleteOne();
    return { message: 'Employee allowance deleted successfully' };
  },
};
