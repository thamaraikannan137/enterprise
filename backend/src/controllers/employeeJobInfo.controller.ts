import type { Request, Response, NextFunction } from 'express';
import employeeJobInfoService from '../services/employeeJobInfoService.ts';
import { sendSuccess } from '../utils/response.ts';

class EmployeeJobInfoController {
  // Create job info
  async createJobInfo(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const jobInfo = await employeeJobInfoService.createJobInfo(req.body);
      sendSuccess(res, 'Job info created successfully', jobInfo, 201);
    } catch (error) {
      next(error);
    }
  }

  // Get current job info for an employee
  async getCurrentJobInfo(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const employeeId = req.params.employeeId!;
      const jobInfo = await employeeJobInfoService.getCurrentJobInfo(employeeId);
      sendSuccess(res, 'Current job info retrieved successfully', jobInfo);
    } catch (error) {
      next(error);
    }
  }

  // Get job history for an employee
  async getJobHistory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const employeeId = req.params.employeeId!;
      const history = await employeeJobInfoService.getJobHistory(employeeId);
      sendSuccess(res, 'Job history retrieved successfully', history);
    } catch (error) {
      next(error);
    }
  }

  // Get job info by ID
  async getJobInfoById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id!;
      const jobInfo = await employeeJobInfoService.getJobInfoById(id);
      sendSuccess(res, 'Job info retrieved successfully', jobInfo);
    } catch (error) {
      next(error);
    }
  }

  // Update job info
  async updateJobInfo(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id!;
      const jobInfo = await employeeJobInfoService.updateJobInfo(id, req.body);
      sendSuccess(res, 'Job info updated successfully', jobInfo);
    } catch (error) {
      next(error);
    }
  }

  // Delete job info
  async deleteJobInfo(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id!;
      const result = await employeeJobInfoService.deleteJobInfo(id);
      sendSuccess(res, result.message || 'Job info deleted successfully');
    } catch (error) {
      next(error);
    }
  }

  // Set job info as current
  async setCurrentJobInfo(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id!;
      const jobInfo = await employeeJobInfoService.setCurrentJobInfo(id);
      sendSuccess(res, 'Job info set as current successfully', jobInfo);
    } catch (error) {
      next(error);
    }
  }

  // Get all employees with job info
  async getAllEmployeesWithJobInfo(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await employeeJobInfoService.getAllEmployeesWithJobInfo(req.query);
      sendSuccess(res, 'Employees with job info retrieved successfully', result);
    } catch (error) {
      next(error);
    }
  }
}

export default new EmployeeJobInfoController();





