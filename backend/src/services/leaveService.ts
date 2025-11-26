import LeaveType from '../models/LeaveType.ts';
import EmployeeLeaveEntitlement from '../models/EmployeeLeaveEntitlement.ts';
import Employee from '../models/Employee.ts';
import { NotFoundError, ConflictError } from '../utils/errors.ts';

export const leaveService = {
  // LeaveType CRUD
  async createLeaveType(data: any) {
    const existing = await LeaveType.findOne({ name: data.name });
    if (existing) {
      throw new ConflictError('Leave type with this name already exists');
    }
    return await LeaveType.create(data);
  },

  async getAllLeaveTypes(filters: any = {}) {
    const query: any = {};
    if (filters.is_active !== undefined) {
      query.is_active = filters.is_active === 'true' || filters.is_active === true;
    }
    return await LeaveType.find(query).sort({ name: 1 });
  },

  async getLeaveTypeById(id: string) {
    const leaveType = await LeaveType.findById(id);
    if (!leaveType) {
      throw new NotFoundError('Leave type not found');
    }
    return leaveType;
  },

  async updateLeaveType(id: string, data: any) {
    const leaveType = await LeaveType.findById(id);
    if (!leaveType) {
      throw new NotFoundError('Leave type not found');
    }

    if (data.name && data.name !== leaveType.name) {
      const existing = await LeaveType.findOne({ name: data.name });
      if (existing) {
        throw new ConflictError('Leave type with this name already exists');
      }
    }

    Object.assign(leaveType, data);
    await leaveType.save();
    return leaveType;
  },

  async deleteLeaveType(id: string) {
    const leaveType = await LeaveType.findById(id);
    if (!leaveType) {
      throw new NotFoundError('Leave type not found');
    }
    leaveType.is_active = false;
    await leaveType.save();
    return { message: 'Leave type deactivated successfully' };
  },

  // EmployeeLeaveEntitlement CRUD
  async createLeaveEntitlement(data: any) {
    const employee = await Employee.findById(data.employee_id);
    if (!employee) {
      throw new NotFoundError('Employee not found');
    }

    const leaveType = await LeaveType.findById(data.leave_type_id);
    if (!leaveType) {
      throw new NotFoundError('Leave type not found');
    }

    // Check for duplicate entitlement (same employee, leave type, and year)
    const existing = await EmployeeLeaveEntitlement.findOne({
      employee_id: data.employee_id,
      leave_type_id: data.leave_type_id,
      year: data.year,
    });

    if (existing) {
      throw new ConflictError('Leave entitlement already exists for this employee, leave type, and year');
    }

    // Calculate remaining days
    data.remaining_days = data.entitled_days - (data.used_days || 0);

    return await EmployeeLeaveEntitlement.create(data);
  },

  async getEmployeeLeaveEntitlements(employeeId: string, filters: any = {}) {
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      throw new NotFoundError('Employee not found');
    }

    const query: any = { employee_id: employeeId };
    if (filters.year) {
      query.year = parseInt(filters.year);
    }

    return await EmployeeLeaveEntitlement.find(query)
      .populate('leave_type_id')
      .sort({ year: -1, leave_type_id: 1 });
  },

  async getLeaveEntitlementById(id: string) {
    const entitlement = await EmployeeLeaveEntitlement.findById(id)
      .populate('leave_type_id')
      .populate('employee_id');
    if (!entitlement) {
      throw new NotFoundError('Leave entitlement not found');
    }
    return entitlement;
  },

  async updateLeaveEntitlement(id: string, data: any) {
    const entitlement = await EmployeeLeaveEntitlement.findById(id);
    if (!entitlement) {
      throw new NotFoundError('Leave entitlement not found');
    }

    // Recalculate remaining days if entitled or used days are updated
    if (data.entitled_days !== undefined || data.used_days !== undefined) {
      const entitledDays = data.entitled_days ?? entitlement.entitled_days;
      const usedDays = data.used_days ?? entitlement.used_days;
      data.remaining_days = entitledDays - usedDays;
    }

    Object.assign(entitlement, data);
    await entitlement.save();
    return entitlement;
  },

  async deleteLeaveEntitlement(id: string) {
    const entitlement = await EmployeeLeaveEntitlement.findById(id);
    if (!entitlement) {
      throw new NotFoundError('Leave entitlement not found');
    }
    await entitlement.deleteOne();
    return { message: 'Leave entitlement deleted successfully' };
  },

  // Bulk create leave entitlements for all employees
  async initializeLeaveEntitlementsForYear(year: number) {
    const employees = await Employee.find({ status: 'active' });
    const leaveTypes = await LeaveType.find({ is_active: true });

    const entitlements = [];
    for (const employee of employees) {
      for (const leaveType of leaveTypes) {
        // Check if entitlement already exists
        const existing = await EmployeeLeaveEntitlement.findOne({
          employee_id: employee._id,
          leave_type_id: leaveType._id,
          year,
        });

        if (!existing) {
          entitlements.push({
            employee_id: employee._id,
            leave_type_id: leaveType._id,
            entitled_days: leaveType.max_days_per_year,
            used_days: 0,
            remaining_days: leaveType.max_days_per_year,
            year,
          });
        }
      }
    }

    if (entitlements.length > 0) {
      await EmployeeLeaveEntitlement.insertMany(entitlements);
    }

    return { message: `Created ${entitlements.length} leave entitlements for year ${year}` };
  },
};
