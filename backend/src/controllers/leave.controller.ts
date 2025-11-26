import type { Request, Response, NextFunction } from 'express';
import { leaveService } from '../services/leaveService.ts';
import { sendSuccess } from '../utils/response.ts';

export const leaveController = {
  // LeaveType endpoints
  async createLeaveType(req: Request, res: Response, next: NextFunction) {
    try {
      const leaveType = await leaveService.createLeaveType(req.body);
      sendSuccess(res, leaveType, 'Leave type created successfully', 201);
    } catch (error) {
      next(error);
    }
  },

  async getAllLeaveTypes(req: Request, res: Response, next: NextFunction) {
    try {
      const leaveTypes = await leaveService.getAllLeaveTypes(req.query);
      sendSuccess(res, leaveTypes, 'Leave types retrieved successfully');
    } catch (error) {
      next(error);
    }
  },

  async getLeaveTypeById(req: Request, res: Response, next: NextFunction) {
    try {
      const leaveType = await leaveService.getLeaveTypeById(req.params.id);
      sendSuccess(res, leaveType, 'Leave type retrieved successfully');
    } catch (error) {
      next(error);
    }
  },

  async updateLeaveType(req: Request, res: Response, next: NextFunction) {
    try {
      const leaveType = await leaveService.updateLeaveType(req.params.id, req.body);
      sendSuccess(res, leaveType, 'Leave type updated successfully');
    } catch (error) {
      next(error);
    }
  },

  async deleteLeaveType(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await leaveService.deleteLeaveType(req.params.id);
      sendSuccess(res, result, 'Leave type deleted successfully');
    } catch (error) {
      next(error);
    }
  },

  // EmployeeLeaveEntitlement endpoints
  async createLeaveEntitlement(req: Request, res: Response, next: NextFunction) {
    try {
      const entitlement = await leaveService.createLeaveEntitlement(req.body);
      sendSuccess(res, entitlement, 'Leave entitlement created successfully', 201);
    } catch (error) {
      next(error);
    }
  },

  async getEmployeeLeaveEntitlements(req: Request, res: Response, next: NextFunction) {
    try {
      const entitlements = await leaveService.getEmployeeLeaveEntitlements(req.params.employeeId, req.query);
      sendSuccess(res, entitlements, 'Leave entitlements retrieved successfully');
    } catch (error) {
      next(error);
    }
  },

  async getLeaveEntitlementById(req: Request, res: Response, next: NextFunction) {
    try {
      const entitlement = await leaveService.getLeaveEntitlementById(req.params.id);
      sendSuccess(res, entitlement, 'Leave entitlement retrieved successfully');
    } catch (error) {
      next(error);
    }
  },

  async updateLeaveEntitlement(req: Request, res: Response, next: NextFunction) {
    try {
      const entitlement = await leaveService.updateLeaveEntitlement(req.params.id, req.body);
      sendSuccess(res, entitlement, 'Leave entitlement updated successfully');
    } catch (error) {
      next(error);
    }
  },

  async deleteLeaveEntitlement(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await leaveService.deleteLeaveEntitlement(req.params.id);
      sendSuccess(res, result, 'Leave entitlement deleted successfully');
    } catch (error) {
      next(error);
    }
  },

  // Initialize leave entitlements for year
  async initializeLeaveEntitlements(req: Request, res: Response, next: NextFunction) {
    try {
      const year = parseInt(req.body.year || new Date().getFullYear());
      const result = await leaveService.initializeLeaveEntitlementsForYear(year);
      sendSuccess(res, result, 'Leave entitlements initialized successfully');
    } catch (error) {
      next(error);
    }
  },
};

