import type { Request, Response, NextFunction } from 'express';
import businessUnitService from '../services/businessUnitService.ts';
import { sendSuccess } from '../utils/response.ts';

class BusinessUnitController {
  // Create business unit
  async createBusinessUnit(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const businessUnit = await businessUnitService.createBusinessUnit(req.body);
      sendSuccess(res, 'Business unit created successfully', businessUnit, 201);
    } catch (error) {
      next(error);
    }
  }

  // Get all business units
  async getAllBusinessUnits(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const businessUnits = await businessUnitService.getAllBusinessUnits(req.query);
      sendSuccess(res, 'Business units retrieved successfully', businessUnits);
    } catch (error) {
      next(error);
    }
  }

  // Get business unit by ID
  async getBusinessUnitById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id!;
      const businessUnit = await businessUnitService.getBusinessUnitById(id);
      sendSuccess(res, 'Business unit retrieved successfully', businessUnit);
    } catch (error) {
      next(error);
    }
  }

  // Update business unit
  async updateBusinessUnit(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id!;
      const businessUnit = await businessUnitService.updateBusinessUnit(id, req.body);
      sendSuccess(res, 'Business unit updated successfully', businessUnit);
    } catch (error) {
      next(error);
    }
  }

  // Delete business unit
  async deleteBusinessUnit(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id!;
      const result = await businessUnitService.deleteBusinessUnit(id);
      sendSuccess(res, result.message || 'Business unit deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}

export default new BusinessUnitController();




