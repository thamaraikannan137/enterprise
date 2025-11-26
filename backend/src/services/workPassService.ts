import EmployeeWorkPass from '../models/EmployeeWorkPass.ts';
import WorkPassDocument from '../models/WorkPassDocument.ts';
import Employee from '../models/Employee.ts';
import { NotFoundError } from '../utils/errors.ts';

export const workPassService = {
  // Create work pass
  async createWorkPass(data: any) {
    const employee = await Employee.findById(data.employee_id);
    if (!employee) {
      throw new NotFoundError('Employee not found');
    }

    // If this is marked as current, unmark all others
    if (data.is_current) {
      await EmployeeWorkPass.updateMany(
        { employee_id: data.employee_id },
        { is_current: false }
      );
    }

    return await EmployeeWorkPass.create(data);
  },

  // Get all work passes for an employee
  async getEmployeeWorkPasses(employeeId: string, filters: any = {}) {
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      throw new NotFoundError('Employee not found');
    }

    const query: any = { employee_id: employeeId };
    
    if (filters.status) {
      query.status = filters.status;
    }

    if (filters.is_current !== undefined) {
      query.is_current = filters.is_current === 'true' || filters.is_current === true;
    }

    return await EmployeeWorkPass.find(query)
      .populate({
        path: 'documents',
        model: 'WorkPassDocument',
        populate: {
          path: 'document_id',
          model: 'EmployeeDocument',
        },
      })
      .sort({ application_date: -1 });
  },

  // Get work pass by ID
  async getWorkPassById(id: string) {
    const workPass = await EmployeeWorkPass.findById(id)
      .populate('employee_id')
      .populate({
        path: 'documents',
        model: 'WorkPassDocument',
        populate: {
          path: 'document_id',
          model: 'EmployeeDocument',
        },
      });
    if (!workPass) {
      throw new NotFoundError('Work pass not found');
    }
    return workPass;
  },

  // Update work pass
  async updateWorkPass(id: string, data: any) {
    const workPass = await EmployeeWorkPass.findById(id);
    if (!workPass) {
      throw new NotFoundError('Work pass not found');
    }

    // If marking as current, unmark all others
    if (data.is_current) {
      await EmployeeWorkPass.updateMany(
        { employee_id: workPass.employee_id },
        { is_current: false }
      );
    }

    Object.assign(workPass, data);
    await workPass.save();
    return workPass;
  },

  // Delete work pass
  async deleteWorkPass(id: string) {
    const workPass = await EmployeeWorkPass.findById(id);
    if (!workPass) {
      throw new NotFoundError('Work pass not found');
    }

    await workPass.deleteOne();
    return { message: 'Work pass deleted successfully' };
  },

  // Get expiring work passes
  async getExpiringWorkPasses(daysThreshold: number = 30) {
    const thresholdDate = new Date();
    thresholdDate.setDate(thresholdDate.getDate() + daysThreshold);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return await EmployeeWorkPass.find({
      is_current: true,
      expiry_date: {
        $gte: today,
        $lte: thresholdDate,
      },
    })
      .populate('employee_id', 'first_name last_name employee_code')
      .sort({ expiry_date: 1 });
  },

  // Work Pass Document Management
  async addWorkPassDocument(data: any) {
    const workPass = await EmployeeWorkPass.findById(data.work_pass_id);
    if (!workPass) {
      throw new NotFoundError('Work pass not found');
    }

    return await WorkPassDocument.create(data);
  },

  async getWorkPassDocuments(workPassId: string) {
    return await WorkPassDocument.find({ work_pass_id: workPassId })
      .populate('document_id')
      .sort({ createdAt: -1 });
  },

  async deleteWorkPassDocument(id: string) {
    const wpDocument = await WorkPassDocument.findById(id);
    if (!wpDocument) {
      throw new NotFoundError('Work pass document not found');
    }

    await wpDocument.deleteOne();
    return { message: 'Work pass document deleted successfully' };
  },
};
