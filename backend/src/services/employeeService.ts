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
  // Validate reporting chain to prevent circular references
  private async validateReportingChain(employeeId: string, reportingToId: string): Promise<boolean> {
    const visited = new Set<string>([employeeId]);
    let currentId: string | null = reportingToId;

    while (currentId) {
      // Check for circular reference
      if (visited.has(currentId)) {
        return false; // Circular reference detected
      }
      visited.add(currentId);

      // Get the employee being reported to
      const employee = await Employee.findById(currentId).select('reporting_to');
      if (!employee || !employee.reporting_to) {
        break; // Reached the top of the chain
      }
      currentId = employee.reporting_to.toString();
    }

    return true; // No circular reference
  }

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

    // Validate reporting_to if provided
    if (data.reporting_to) {
      // Check if the reporting_to employee exists
      const reportingToEmployee = await Employee.findById(data.reporting_to);
      if (!reportingToEmployee) {
        throw new NotFoundError('Reporting to employee not found');
      }

      // Note: We can't validate circular chain during creation since the employee doesn't exist yet
      // But we can validate it after creation if needed
    }

    const employee = await Employee.create(data);

    // After creation, if reporting_to is set, validate the chain
    if (employee.reporting_to) {
      const isValidChain = await this.validateReportingChain(
        employee._id.toString(),
        employee.reporting_to.toString()
      );
      if (!isValidChain) {
        // If circular chain detected, remove the employee and throw error
        await Employee.findByIdAndDelete(employee._id);
        throw new ConflictError('Circular reporting chain detected');
      }
    }

    return employee;
  }

  // Get all employees with pagination and filters
  async getAllEmployees(filters: any = {}) {
    const { page = 1, limit = 10, status, search, designation, department, reporting_to } = filters;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const query: any = {};

    if (status) {
      query.status = status;
    }

    if (designation) {
      query.designation = { $regex: designation, $options: 'i' };
    }

    if (department) {
      query.department = { $regex: department, $options: 'i' };
    }

    if (reporting_to) {
      query.reporting_to = reporting_to;
    }

    if (search) {
      query.$or = [
        { first_name: { $regex: search, $options: 'i' } },
        { last_name: { $regex: search, $options: 'i' } },
        { employee_code: { $regex: search, $options: 'i' } },
        { designation: { $regex: search, $options: 'i' } },
        { department: { $regex: search, $options: 'i' } },
      ];
    }

    const [employees, total] = await Promise.all([
      Employee.find(query)
        .populate('reporting_to', 'first_name last_name designation employee_code')
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
    const employee = await Employee.findById(id).populate(
      'reporting_to',
      'first_name last_name designation employee_code'
    );

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

    // Validate reporting_to if being updated
    if (data.reporting_to !== undefined) {
      // Prevent self-reference
      if (data.reporting_to && data.reporting_to === id) {
        throw new ConflictError('Employee cannot report to themselves');
      }

      // If reporting_to is being set, validate the reporting chain
      if (data.reporting_to) {
        // Check if the reporting_to employee exists
        const reportingToEmployee = await Employee.findById(data.reporting_to);
        if (!reportingToEmployee) {
          throw new NotFoundError('Reporting to employee not found');
        }

        // Validate circular reference chain
        const isValidChain = await this.validateReportingChain(id, data.reporting_to);
        if (!isValidChain) {
          throw new ConflictError('Circular reporting chain detected');
        }
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

    // Populate reporting_to if it exists
    if (employee.reporting_to) {
      await employee.populate('reporting_to', 'first_name last_name designation employee_code');
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
