import type { Request, Response, NextFunction } from 'express';
import employeeService from '../services/employeeService.ts';
import { sendSuccess } from '../utils/response.ts';
import { BadRequestError } from '../utils/errors.ts';

class EmployeeController {
  // Create employee
  async createEmployee(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // If a profile photo file was uploaded, add its path to the request body
      if (req.file) {
        req.body.profile_photo_path = `uploads/profile-photos/${req.file.filename}`;
      }
      const employee = await employeeService.createEmployee(req.body);
      sendSuccess(res, 'Employee created successfully', employee, 201);
    } catch (error) {
      next(error);
    }
  }

  // Get all employees
  async getAllEmployees(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await employeeService.getAllEmployees(req.query);
      sendSuccess(res, 'Employees retrieved successfully', result);
    } catch (error) {
      next(error);
    }
  }

  // Get employee by ID
  async getEmployeeById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id!;
      const employee = await employeeService.getEmployeeById(id);
      sendSuccess(res, 'Employee retrieved successfully', employee);
    } catch (error) {
      next(error);
    }
  }

  // Update employee
  async updateEmployee(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id!;
      // If a profile photo file was uploaded, add its path to the request body
      if (req.file) {
        req.body.profile_photo_path = `uploads/profile-photos/${req.file.filename}`;
      }
      const employee = await employeeService.updateEmployee(id, req.body);
      sendSuccess(res, 'Employee updated successfully', employee);
    } catch (error) {
      next(error);
    }
  }

  // Delete employee
  async deleteEmployee(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id!;
      const result = await employeeService.deleteEmployee(id);
      sendSuccess(res, result.message || 'Employee deleted successfully');
    } catch (error) {
      next(error);
    }
  }

  // Get employee with all details
  async getEmployeeWithDetails(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id!;
      const employee = await employeeService.getEmployeeWithDetails(id);
      sendSuccess(res, 'Employee details retrieved successfully', employee);
    } catch (error) {
      next(error);
    }
  }

  // Upload profile photo
  async uploadProfilePhoto(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const file = req.file;
      if (!file) {
        return next(new BadRequestError('No file uploaded'));
      }

      // Return the file path relative to uploads directory
      const filePath = `uploads/profile-photos/${file.filename}`;
      sendSuccess(res, 'Profile photo uploaded successfully', { filePath });
    } catch (error) {
      next(error);
    }
  }
}

export default new EmployeeController();

