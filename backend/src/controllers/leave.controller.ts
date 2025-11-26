import type { Request, Response, NextFunction } from 'express';
import { leaveService } from '../services/leaveService.ts';
import { sendSuccess } from '../utils/response.ts';

export const leaveController = {
  // LeaveType endpoints
  async createLeaveType(req: Request, res: Response, next: NextFunction) {
    try {
      const leaveType = await leaveService.createLeaveType(req.body);
      sendSuccess(res, 'Leave type created successfully', leaveType, 201);
    } catch (error) {
      next(error);
    }
  },

  async getAllLeaveTypes(req: Request, res: Response, next: NextFunction) {
    try {
      const leaveTypes = await leaveService.getAllLeaveTypes(req.query);
      sendSuccess(res, 'Leave types retrieved successfully', leaveTypes);
    } catch (error) {
      next(error);
    }
  },

  async getLeaveTypeById(req: Request, res: Response, next: NextFunction) {
    try {
      const leaveType = await leaveService.getLeaveTypeById(req.params.id!);
      sendSuccess(res, 'Leave type retrieved successfully', leaveType);
    } catch (error) {
      next(error);
    }
  },

  async updateLeaveType(req: Request, res: Response, next: NextFunction) {
    try {
      const leaveType = await leaveService.updateLeaveType(req.params.id!, req.body);
      sendSuccess(res, 'Leave type updated successfully', leaveType);
    } catch (error) {
      next(error);
    }
  },

  async deleteLeaveType(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await leaveService.deleteLeaveType(req.params.id!);
      sendSuccess(res, 'Leave type deleted successfully', result);
    } catch (error) {
      next(error);
    }
  },

  async bulkCreateLeaveTypes(req: Request, res: Response, next: NextFunction) {
    try {
      const leaveTypes = await leaveService.bulkCreateLeaveTypes(req.body);
      sendSuccess(
        res,
        `${leaveTypes.length} leave type(s) created successfully`,
        leaveTypes,
        201
      );
    } catch (error) {
      next(error);
    }
  },

  // EmployeeLeaveEntitlement endpoints
  async createLeaveEntitlement(req: Request, res: Response, next: NextFunction) {
    try {
      const entitlement = await leaveService.createLeaveEntitlement(req.body);
      sendSuccess(res, 'Leave entitlement created successfully', entitlement, 201);
    } catch (error) {
      next(error);
    }
  },

  async getEmployeeLeaveEntitlements(req: Request, res: Response, next: NextFunction) {
    try {
      const entitlements = await leaveService.getEmployeeLeaveEntitlements(req.params.employeeId!, req.query);
      sendSuccess(res, 'Leave entitlements retrieved successfully', entitlements);
    } catch (error) {
      next(error);
    }
  },

  async getLeaveEntitlementById(req: Request, res: Response, next: NextFunction) {
    try {
      const entitlement = await leaveService.getLeaveEntitlementById(req.params.id!);
      sendSuccess(res, 'Leave entitlement retrieved successfully', entitlement);
    } catch (error) {
      next(error);
    }
  },

  async updateLeaveEntitlement(req: Request, res: Response, next: NextFunction) {
    try {
      const entitlement = await leaveService.updateLeaveEntitlement(req.params.id!, req.body);
      sendSuccess(res, 'Leave entitlement updated successfully', entitlement);
    } catch (error) {
      next(error);
    }
  },

  async deleteLeaveEntitlement(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await leaveService.deleteLeaveEntitlement(req.params.id!);
      sendSuccess(res, 'Leave entitlement deleted successfully', result);
    } catch (error) {
      next(error);
    }
  },

  // Initialize leave entitlements for year
  async initializeLeaveEntitlements(req: Request, res: Response, next: NextFunction) {
    try {
      const year = parseInt(req.body.year || new Date().getFullYear());
      const result = await leaveService.initializeLeaveEntitlementsForYear(year);
      sendSuccess(res, 'Leave entitlements initialized successfully', result);
    } catch (error) {
      next(error);
    }
  },
};

