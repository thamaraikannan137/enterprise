import Department from '../models/Department.ts';
import { NotFoundError } from '../utils/errors.ts';

class DepartmentService {
  // Create new department
  async createDepartment(data: any) {
    const department = await Department.create(data);
    const departmentObj = department.toObject();
    // Transform _id to id for frontend compatibility
    if (departmentObj._id) {
      departmentObj.id = departmentObj._id.toString();
    }
    return departmentObj;
  }

  // Get all departments
  async getAllDepartments(filters: any = {}) {
    const query: any = {};

    // Optional search filter
    if (filters.search) {
      query.$or = [
        { name: { $regex: filters.search, $options: 'i' } },
        { description: { $regex: filters.search, $options: 'i' } },
      ];
    }

    const departments = await Department.find(query).sort({ name: 1 });
    
    // Transform _id to id for frontend compatibility
    return departments.map((dept: any) => {
      const deptObj = dept.toObject();
      if (deptObj._id) {
        deptObj.id = deptObj._id.toString();
      }
      return deptObj;
    });
  }

  // Get department by ID
  async getDepartmentById(id: string) {
    const department = await Department.findById(id);

    if (!department) {
      throw new NotFoundError('Department not found');
    }

    const departmentObj = department.toObject();
    // Transform _id to id for frontend compatibility
    if (departmentObj._id) {
      departmentObj.id = departmentObj._id.toString();
    }
    return departmentObj;
  }

  // Update department
  async updateDepartment(id: string, data: any) {
    const department = await Department.findById(id);

    if (!department) {
      throw new NotFoundError('Department not found');
    }

    Object.assign(department, data);
    await department.save();
    const departmentObj = department.toObject();
    // Transform _id to id for frontend compatibility
    if (departmentObj._id) {
      departmentObj.id = departmentObj._id.toString();
    }
    return departmentObj;
  }

  // Delete department
  async deleteDepartment(id: string) {
    const department = await Department.findById(id);

    if (!department) {
      throw new NotFoundError('Department not found');
    }

    await department.deleteOne();
    return { message: 'Department deleted successfully' };
  }
}

export default new DepartmentService();




