import Employee from '../models/Employee.ts';
import EmployeeDocument from '../models/EmployeeDocument.ts';
import EmployeeCompensation from '../models/EmployeeCompensation.ts';
import EmployeeAllowance from '../models/EmployeeAllowance.ts';
import EmployeeDeduction from '../models/EmployeeDeduction.ts';
import EmployeeLeaveEntitlement from '../models/EmployeeLeaveEntitlement.ts';
import EmployeeCertification from '../models/EmployeeCertification.ts';
import EmployeeQualification from '../models/EmployeeQualification.ts';
import EmployeeWorkPass from '../models/EmployeeWorkPass.ts';
import EmployeeJobInfo from '../models/EmployeeJobInfo.ts';
import { NotFoundError } from '../utils/errors.ts';

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

    const employee = await Employee.create(data);
    const employeeObj = employee.toObject();
    // Transform _id to id for frontend compatibility
    if (employeeObj._id) {
      employeeObj.id = employeeObj._id.toString();
    }
    return employeeObj;
  }

  // Get all employees with pagination and filters
  async getAllEmployees(filters: any = {}) {
    const { page = 1, limit = 10, search } = filters;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const query: any = {};

    if (search) {
      query.$or = [
        { first_name: { $regex: search, $options: 'i' } },
        { last_name: { $regex: search, $options: 'i' } },
        { employee_code: { $regex: search, $options: 'i' } },
        { work_email: { $regex: search, $options: 'i' } },
        { personal_email: { $regex: search, $options: 'i' } },
        { mobile_number: { $regex: search, $options: 'i' } },
      ];
    }

    const [employees, total] = await Promise.all([
      Employee.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Employee.countDocuments(query),
    ]);

    // Fetch current job info for all employees
    const employeeIds = employees.map(emp => emp._id);
    const currentJobInfos = await EmployeeJobInfo.find({
      employee_id: { $in: employeeIds },
      is_current: true,
    })
      .populate('reporting_to', 'first_name last_name employee_code designation')
      .lean();

    // Create a map of employee_id -> job info for quick lookup
    const jobInfoMap = new Map();
    currentJobInfos.forEach((jobInfo: any) => {
      jobInfoMap.set(jobInfo.employee_id.toString(), jobInfo);
    });

    // Merge job info into employee objects
    const employeesWithJobInfo = employees.map((employee: any) => {
      const employeeObj = employee.toObject();
      
      // Transform _id to id for frontend compatibility
      if (employeeObj._id) {
        employeeObj.id = employeeObj._id.toString();
      }
      
      const jobInfo = jobInfoMap.get(employee._id.toString());
      
      if (jobInfo) {
        // Add job info fields to employee object for frontend compatibility
        employeeObj.designation = jobInfo.designation;
        employeeObj.department = jobInfo.department;
        employeeObj.status = jobInfo.status;
        employeeObj.hire_date = jobInfo.hire_date;
        employeeObj.joining_date = jobInfo.joining_date;
        employeeObj.location = jobInfo.location;
        employeeObj.time_type = jobInfo.time_type;
        employeeObj.reporting_to = jobInfo.reporting_to;
        employeeObj.reportingToEmployee = jobInfo.reporting_to; // For frontend compatibility
      }
      
      return employeeObj;
    });

    return {
      employees: employeesWithJobInfo,
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

    const employeeObj = employee.toObject();
    // Transform _id to id for frontend compatibility
    if (employeeObj._id) {
      employeeObj.id = employeeObj._id.toString();
    }
    return employeeObj;
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
        throw new NotFoundError('Employee code already exists');
      }
    }

    Object.assign(employee, data);
    await employee.save();
    const employeeObj = employee.toObject();
    // Transform _id to id for frontend compatibility
    if (employeeObj._id) {
      employeeObj.id = employeeObj._id.toString();
    }
    return employeeObj;
  }

  // Delete employee (soft delete by changing status - but status is now in JobInfo)
  async deleteEmployee(id: string) {
    const employee = await Employee.findById(id);

    if (!employee) {
      throw new NotFoundError('Employee not found');
    }

    // Note: Since status is now in EmployeeJobInfo, we might want to handle this differently
    // For now, we'll just delete the employee record
    await employee.deleteOne();
    return { message: 'Employee deleted successfully' };
  }

  // Get employee with all related data
  async getEmployeeWithDetails(id: string) {
    const employee = await Employee.findById(id);
    
    if (!employee) {
      throw new NotFoundError('Employee not found');
    }

    // Fetch all related data (excluding job info which is in separate collection)
    const [
      documents,
      compensations,
      allowances,
      deductions,
      leaveEntitlements,
      certifications,
      qualifications,
      workPasses,
    ] = await Promise.all([
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

    const employeeObj = employee.toObject();
    // Transform _id to id for frontend compatibility
    if (employeeObj._id) {
      employeeObj.id = employeeObj._id.toString();
    }

    return {
      ...employeeObj,
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
