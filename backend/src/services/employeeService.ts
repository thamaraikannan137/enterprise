import Employee from '../models/Employee.ts';
import EmployeeContact from '../models/EmployeeContact.ts';
import EmployeeDocument from '../models/EmployeeDocument.ts';
import EmployeeCompensation from '../models/EmployeeCompensation.ts';
import EmployeeAllowance from '../models/EmployeeAllowance.ts';
import EmployeeDeduction from '../models/EmployeeDeduction.ts';
import EmployeeLeaveEntitlement from '../models/EmployeeLeaveEntitlement.ts';
import EmployeeCertification from '../models/EmployeeCertification.ts';
import EmployeeQualification from '../models/EmployeeQualification.ts';
import EmployeeWorkPass from '../models/EmployeeWorkPass.ts';
import { NotFoundError, ConflictError } from '../utils/errors.ts';

class EmployeeService {
  // Generate unique employee code
  private async generateEmployeeCode(): Promise<string> {
    // Get the latest employee to determine next code
    const latestEmployee = await Employee.findOne()
      .sort({ createdAt: -1 })
      .select('employee_code');

    if (!latestEmployee || !latestEmployee.employee_code) {
      // First employee
      return 'EMP0001';
    }

    // Extract number from latest code (e.g., EMP001 -> 1)
    const match = latestEmployee.employee_code.match(/\d+$/);
    if (match) {
      const nextNumber = parseInt(match[0]) + 1;
      return `EMP${nextNumber.toString().padStart(4, '0')}`;
    }

    // Fallback: if format doesn't match, start from 1
    return 'EMP0001';
  }

  // Create new employee
  async createEmployee(data: any) {
    // Always auto-generate employee code (remove any provided code)
    data.employee_code = await this.generateEmployeeCode();

    return await Employee.create(data);
  }

  // Get all employees with pagination and filters
  async getAllEmployees(filters: any = {}) {
    const { page = 1, limit = 10, status, search } = filters;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const query: any = {};

    if (status) {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { first_name: { $regex: search, $options: 'i' } },
        { last_name: { $regex: search, $options: 'i' } },
        { employee_code: { $regex: search, $options: 'i' } },
      ];
    }

    const [employees, total] = await Promise.all([
      Employee.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Employee.countDocuments(query),
    ]);

    return {
      employees,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
    };
  }

  // Get employee by ID
  async getEmployeeById(id: string) {
    const employee = await Employee.findById(id);

    if (!employee) {
      throw new NotFoundError('Employee not found');
    }

    return employee;
  }

  // Update employee
  async updateEmployee(id: string, data: any) {
    const employee = await Employee.findById(id);

    if (!employee) {
      throw new NotFoundError('Employee not found');
    }

    // Check if updating employee_code and if it already exists
    if (data.employee_code && data.employee_code !== employee.employee_code) {
      const existingEmployee = await Employee.findOne({ employee_code: data.employee_code });

      if (existingEmployee) {
        throw new ConflictError('Employee code already exists');
      }
    }

    Object.assign(employee, data);
    await employee.save();
    return employee;
  }

  // Delete employee (soft delete by changing status)
  async deleteEmployee(id: string) {
    const employee = await Employee.findById(id);

    if (!employee) {
      throw new NotFoundError('Employee not found');
    }

    employee.status = 'terminated';
    employee.termination_date = new Date();
    await employee.save();
    return { message: 'Employee terminated successfully' };
  }

  // Get employee with all related data
  async getEmployeeWithDetails(id: string) {
    const employee = await Employee.findById(id);
    
    if (!employee) {
      throw new NotFoundError('Employee not found');
    }

    // Fetch all related data
    const [
      contacts,
      documents,
      compensations,
      allowances,
      deductions,
      leaveEntitlements,
      certifications,
      qualifications,
      workPasses,
    ] = await Promise.all([
      EmployeeContact.find({ employee_id: id }),
      EmployeeDocument.find({ employee_id: id }),
      EmployeeCompensation.find({ employee_id: id }),
      EmployeeAllowance.find({ employee_id: id }).populate('allowance_type_id'),
      EmployeeDeduction.find({ employee_id: id }).populate('deduction_type_id'),
      EmployeeLeaveEntitlement.find({ employee_id: id }).populate('leave_type_id'),
      EmployeeCertification.find({ employee_id: id }).populate('document_id'),
      EmployeeQualification.find({ employee_id: id }).populate('document_id'),
      EmployeeWorkPass.find({ employee_id: id }),
    ]);

    // Populate created_by if it exists
    if (employee.created_by) {
      await employee.populate('created_by', 'firstName lastName email');
    }

    return {
      ...employee.toObject(),
      contacts,
      documents,
      compensations,
      allowances,
      deductions,
      leaveEntitlements,
      certifications,
      qualifications,
      workPasses,
    };
  }
}

export default new EmployeeService();
