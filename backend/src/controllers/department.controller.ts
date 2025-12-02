import type { Request, Response, NextFunction } from 'express';
import departmentService from '../services/departmentService.ts';
import { sendSuccess } from '../utils/response.ts';

class DepartmentController {
  // Create department
  async createDepartment(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const department = await departmentService.createDepartment(req.body);
      sendSuccess(res, 'Department created successfully', department, 201);
    } catch (error) {
      next(error);
    }
  }

  // Get all departments
  async getAllDepartments(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const departments = await departmentService.getAllDepartments(req.query);
      sendSuccess(res, 'Departments retrieved successfully', departments);
    } catch (error) {
      next(error);
    }
  }

  // Get department by ID
  async getDepartmentById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id!;
      const department = await departmentService.getDepartmentById(id);
      sendSuccess(res, 'Department retrieved successfully', department);
    } catch (error) {
      next(error);
    }
  }

  // Update department
  async updateDepartment(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id!;
      const department = await departmentService.updateDepartment(id, req.body);
      sendSuccess(res, 'Department updated successfully', department);
    } catch (error) {
      next(error);
    }
  }

  // Delete department
  async deleteDepartment(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id!;
      const result = await departmentService.deleteDepartment(id);
      sendSuccess(res, result.message || 'Department deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}

export default new DepartmentController();





