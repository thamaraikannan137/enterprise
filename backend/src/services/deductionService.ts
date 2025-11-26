import DeductionType from '../models/DeductionType.ts';
import EmployeeDeduction from '../models/EmployeeDeduction.ts';
import Employee from '../models/Employee.ts';
import { NotFoundError, ConflictError } from '../utils/errors.ts';

export const deductionService = {
  // DeductionType CRUD
  async createDeductionType(data: any) {
    const existing = await DeductionType.findOne({ name: data.name });
    if (existing) {
      throw new ConflictError('Deduction type with this name already exists');
    }
    return await DeductionType.create(data);
  },

  async getAllDeductionTypes(filters: any = {}) {
    const query: any = {};
    if (filters.is_active !== undefined) {
      query.is_active = filters.is_active === 'true' || filters.is_active === true;
    }
    return await DeductionType.find(query).sort({ name: 1 });
  },

  async getDeductionTypeById(id: string) {
    const deductionType = await DeductionType.findById(id);
    if (!deductionType) {
      throw new NotFoundError('Deduction type not found');
    }
    return deductionType;
  },

  async updateDeductionType(id: string, data: any) {
    const deductionType = await DeductionType.findById(id);
    if (!deductionType) {
      throw new NotFoundError('Deduction type not found');
    }

    if (data.name && data.name !== deductionType.name) {
      const existing = await DeductionType.findOne({ name: data.name });
      if (existing) {
        throw new ConflictError('Deduction type with this name already exists');
      }
    }

    Object.assign(deductionType, data);
    await deductionType.save();
    return deductionType;
  },

  async deleteDeductionType(id: string) {
    const deductionType = await DeductionType.findById(id);
    if (!deductionType) {
      throw new NotFoundError('Deduction type not found');
    }
    deductionType.is_active = false;
    await deductionType.save();
    return { message: 'Deduction type deactivated successfully' };
  },

  // Bulk create deduction types
  async bulkCreateDeductionTypes(dataArray: any[]) {
    if (!Array.isArray(dataArray) || dataArray.length === 0) {
      throw new Error('Invalid data: expected a non-empty array');
    }

    // Check for duplicate names in the input
    const names = dataArray.map(item => item.name);
    const uniqueNames = new Set(names);
    if (names.length !== uniqueNames.size) {
      throw new ConflictError('Duplicate names found in the input array');
    }

    // Check for existing names in database
    const existingTypes = await DeductionType.find({ name: { $in: names } });
    if (existingTypes.length > 0) {
      const existingNames = existingTypes.map(t => t.name).join(', ');
      throw new ConflictError(`Deduction types with these names already exist: ${existingNames}`);
    }

    const created = await DeductionType.insertMany(dataArray);
    return created;
  },

  // EmployeeDeduction CRUD
  async createEmployeeDeduction(data: any) {
    const employee = await Employee.findById(data.employee_id);
    if (!employee) {
      throw new NotFoundError('Employee not found');
    }

    const deductionType = await DeductionType.findById(data.deduction_type_id);
    if (!deductionType) {
      throw new NotFoundError('Deduction type not found');
    }

    return await EmployeeDeduction.create(data);
  },

  async getEmployeeDeductions(employeeId: string, filters: any = {}) {
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      throw new NotFoundError('Employee not found');
    }

    const query: any = { employee_id: employeeId };
    if (filters.is_active !== undefined) {
      query.is_active = filters.is_active === 'true' || filters.is_active === true;
    }

    return await EmployeeDeduction.find(query)
      .populate('deduction_type_id')
      .sort({ effective_from: -1 });
  },

  async getEmployeeDeductionById(id: string) {
    const deduction = await EmployeeDeduction.findById(id)
      .populate('deduction_type_id')
      .populate('employee_id');
    if (!deduction) {
      throw new NotFoundError('Employee deduction not found');
    }
    return deduction;
  },

  async updateEmployeeDeduction(id: string, data: any) {
    const deduction = await EmployeeDeduction.findById(id);
    if (!deduction) {
      throw new NotFoundError('Employee deduction not found');
    }
    Object.assign(deduction, data);
    await deduction.save();
    return deduction;
  },

  async deleteEmployeeDeduction(id: string) {
    const deduction = await EmployeeDeduction.findById(id);
    if (!deduction) {
      throw new NotFoundError('Employee deduction not found');
    }
    await deduction.deleteOne();
    return { message: 'Employee deduction deleted successfully' };
  },
};
