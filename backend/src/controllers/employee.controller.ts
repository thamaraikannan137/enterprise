import type { Request, Response, NextFunction } from 'express';
import employeeService from '../services/employeeService.ts';
import { sendSuccess } from '../utils/response.ts';

class EmployeeController {
  // Create employee
  async createEmployee(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
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
}

export default new EmployeeController();

