import type { Request, Response, NextFunction } from 'express';
import legalEntityService from '../services/legalEntityService.ts';
import { sendSuccess } from '../utils/response.ts';

class LegalEntityController {
  // Create legal entity
  async createLegalEntity(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const legalEntity = await legalEntityService.createLegalEntity(req.body);
      sendSuccess(res, 'Legal entity created successfully', legalEntity, 201);
    } catch (error) {
      next(error);
    }
  }

  // Get all legal entities
  async getAllLegalEntities(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const legalEntities = await legalEntityService.getAllLegalEntities(req.query);
      sendSuccess(res, 'Legal entities retrieved successfully', legalEntities);
    } catch (error) {
      next(error);
    }
  }

  // Get legal entity by ID
  async getLegalEntityById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id!;
      const legalEntity = await legalEntityService.getLegalEntityById(id);
      sendSuccess(res, 'Legal entity retrieved successfully', legalEntity);
    } catch (error) {
      next(error);
    }
  }

  // Update legal entity
  async updateLegalEntity(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id!;
      const legalEntity = await legalEntityService.updateLegalEntity(id, req.body);
      sendSuccess(res, 'Legal entity updated successfully', legalEntity);
    } catch (error) {
      next(error);
    }
  }

  // Delete legal entity
  async deleteLegalEntity(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id!;
      const result = await legalEntityService.deleteLegalEntity(id);
      sendSuccess(res, result.message || 'Legal entity deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}

export default new LegalEntityController();




