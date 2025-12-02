import type { Request, Response, NextFunction } from 'express';
import locationService from '../services/locationService.ts';
import { sendSuccess } from '../utils/response.ts';

class LocationController {
  // Create location
  async createLocation(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const location = await locationService.createLocation(req.body);
      sendSuccess(res, 'Location created successfully', location, 201);
    } catch (error) {
      next(error);
    }
  }

  // Get all locations
  async getAllLocations(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const locations = await locationService.getAllLocations(req.query);
      sendSuccess(res, 'Locations retrieved successfully', locations);
    } catch (error) {
      next(error);
    }
  }

  // Get location by ID
  async getLocationById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id!;
      const location = await locationService.getLocationById(id);
      sendSuccess(res, 'Location retrieved successfully', location);
    } catch (error) {
      next(error);
    }
  }

  // Update location
  async updateLocation(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id!;
      const location = await locationService.updateLocation(id, req.body);
      sendSuccess(res, 'Location updated successfully', location);
    } catch (error) {
      next(error);
    }
  }

  // Delete location
  async deleteLocation(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id!;
      const result = await locationService.deleteLocation(id);
      sendSuccess(res, result.message || 'Location deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}

export default new LocationController();





