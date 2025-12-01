import EmployeeJobInfo from '../models/EmployeeJobInfo.ts';
import Employee from '../models/Employee.ts';
import { NotFoundError, ConflictError, ValidationError } from '../utils/errors.ts';

class EmployeeJobInfoService {
  // Validate reporting chain to prevent circular references
  private async validateReportingChain(employeeId: string, reportingToId: string): Promise<boolean> {
    const visited = new Set<string>([employeeId]);
    let currentId: string | null = reportingToId;

    while (currentId) {
      if (visited.has(currentId)) {
        return false; // Circular reference detected
      }
      visited.add(currentId);

      const jobInfo: any = await EmployeeJobInfo.findOne({ 
        employee_id: currentId, 
        is_current: true 
      }).select('reporting_to');
      
      if (!jobInfo || !jobInfo.reporting_to) {
        break; // Reached the top of the chain
      }
      currentId = jobInfo.reporting_to.toString();
    }

    return true; // No circular reference
  }

  // Create new job info
  async createJobInfo(data: any) {
    // Verify employee exists
    const employee = await Employee.findById(data.employee_id);
    if (!employee) {
      throw new NotFoundError('Employee not found');
    }

    // Clean up empty strings - convert to undefined/null for optional fields
    if (data.joining_date === '' || data.joining_date === null) {
      delete data.joining_date;
    }
    if (data.time_type === '' || data.time_type === null) {
      delete data.time_type;
    }
    if (data.location === '' || data.location === null) {
      delete data.location;
    }
    if (data.legal_entity === '' || data.legal_entity === null) {
      delete data.legal_entity;
    }
    if (data.business_unit === '' || data.business_unit === null) {
      delete data.business_unit;
    }
    if (data.worker_type === '' || data.worker_type === null) {
      delete data.worker_type;
    }
    if (data.probation_policy === '' || data.probation_policy === null) {
      delete data.probation_policy;
    }
    if (data.notice_period === '' || data.notice_period === null) {
      delete data.notice_period;
    }
    if (data.reporting_to === '' || data.reporting_to === null) {
      delete data.reporting_to;
    }

    // If this is set as current, unmark all other current job infos for this employee
    if (data.is_current !== false) {
      await EmployeeJobInfo.updateMany(
        { employee_id: data.employee_id },
        { is_current: false }
      );
      data.is_current = true;
    }

    // Validate reporting_to if provided
    if (data.reporting_to) {
      const reportingToEmployee = await Employee.findById(data.reporting_to);
      if (!reportingToEmployee) {
        throw new NotFoundError('Reporting to employee not found');
      }

      // Prevent self-reference
      if (data.reporting_to === data.employee_id) {
        throw new ConflictError('Employee cannot report to themselves');
      }

      // Validate circular reference chain
      const isValidChain = await this.validateReportingChain(
        data.employee_id,
        data.reporting_to
      );
      if (!isValidChain) {
        throw new ConflictError('Circular reporting chain detected');
      }
    }

    // Set effective_from if not provided
    if (!data.effective_from) {
      data.effective_from = new Date();
    }

    try {
      return await EmployeeJobInfo.create(data);
    } catch (error: any) {
      // Handle Mongoose validation errors
      if (error.name === 'ValidationError') {
        const errors = Object.values(error.errors).map((e: any) => e.message);
        throw new ValidationError(JSON.stringify(errors));
      }
      throw error;
    }
  }

  // Get current job info for an employee
  async getCurrentJobInfo(employeeId: string) {
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      throw new NotFoundError('Employee not found');
    }

    const jobInfo = await EmployeeJobInfo.findOne({ 
      employee_id: employeeId, 
      is_current: true 
    }).populate('reporting_to', 'first_name last_name employee_code');

    return jobInfo;
  }

  // Get all job info history for an employee
  async getJobHistory(employeeId: string) {
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      throw new NotFoundError('Employee not found');
    }

    return await EmployeeJobInfo.find({ employee_id: employeeId })
      .populate('reporting_to', 'first_name last_name employee_code')
      .sort({ effective_from: -1 });
  }

  // Get job info by ID
  async getJobInfoById(id: string) {
    const jobInfo = await EmployeeJobInfo.findById(id)
      .populate('reporting_to', 'first_name last_name employee_code')
      .populate('employee_id', 'first_name last_name employee_code');

    if (!jobInfo) {
      throw new NotFoundError('Job info not found');
    }

    return jobInfo;
  }

  // Update job info
  async updateJobInfo(id: string, data: any) {
    const jobInfo = await EmployeeJobInfo.findById(id);
    if (!jobInfo) {
      throw new NotFoundError('Job info not found');
    }

    // If setting as current, unmark all other current job infos for this employee
    if (data.is_current === true) {
      await EmployeeJobInfo.updateMany(
        { 
          employee_id: jobInfo.employee_id,
          _id: { $ne: id }
        },
        { is_current: false }
      );
    }

    // Validate reporting_to if being updated
    if (data.reporting_to !== undefined) {
      // Prevent self-reference
      if (data.reporting_to && data.reporting_to === jobInfo.employee_id.toString()) {
        throw new ConflictError('Employee cannot report to themselves');
      }

      if (data.reporting_to) {
        const reportingToEmployee = await Employee.findById(data.reporting_to);
        if (!reportingToEmployee) {
          throw new NotFoundError('Reporting to employee not found');
        }

        // Validate circular reference chain
        const isValidChain = await this.validateReportingChain(
          jobInfo.employee_id.toString(),
          data.reporting_to
        );
        if (!isValidChain) {
          throw new ConflictError('Circular reporting chain detected');
        }
      }
    }

    Object.assign(jobInfo, data);
    await jobInfo.save();
    return jobInfo;
  }

  // Delete job info
  async deleteJobInfo(id: string) {
    const jobInfo = await EmployeeJobInfo.findById(id);
    if (!jobInfo) {
      throw new NotFoundError('Job info not found');
    }

    await jobInfo.deleteOne();
    return { message: 'Job info deleted successfully' };
  }

  // Set job info as current
  async setCurrentJobInfo(id: string) {
    const jobInfo = await EmployeeJobInfo.findById(id);
    if (!jobInfo) {
      throw new NotFoundError('Job info not found');
    }

    // Unmark all other job infos for this employee
    await EmployeeJobInfo.updateMany(
      { 
        employee_id: jobInfo.employee_id,
        _id: { $ne: id }
      },
      { is_current: false }
    );

    // Mark this as current
    jobInfo.is_current = true;
    await jobInfo.save();
    return jobInfo;
  }

  // Get all employees with current job info (for listing/searching)
  async getAllEmployeesWithJobInfo(filters: any = {}) {
    const { page = 1, limit = 10, status, search, designation, department } = filters;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const query: any = { is_current: true };

    if (status) {
      query.status = status;
    }

    if (designation) {
      query.designation = { $regex: designation, $options: 'i' };
    }

    if (department) {
      query.department = { $regex: department, $options: 'i' };
    }

    if (search) {
      query.$or = [
        { designation: { $regex: search, $options: 'i' } },
        { department: { $regex: search, $options: 'i' } },
      ];
    }

    const [jobInfos, total] = await Promise.all([
      EmployeeJobInfo.find(query)
        .populate('employee_id', 'first_name last_name employee_code')
        .populate('reporting_to', 'first_name last_name designation employee_code')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      EmployeeJobInfo.countDocuments(query),
    ]);

    return {
      jobInfos,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
    };
  }
}

export default new EmployeeJobInfoService();

