import type { Request, Response, NextFunction } from 'express';
import { employeeContactService } from '../services/employeeContactService.ts';
import { sendSuccess } from '../utils/response.ts';

export const employeeContactController = {
  // Create contact
  async createContact(req: Request, res: Response, next: NextFunction) {
    try {
      const contact = await employeeContactService.createContact(req.body);
      sendSuccess(res, contact, 'Contact created successfully', 201);
    } catch (error) {
      next(error);
    }
  },

  // Get employee contacts
  async getEmployeeContacts(req: Request, res: Response, next: NextFunction) {
    try {
      const contacts = await employeeContactService.getEmployeeContacts(parseInt(req.params.employeeId));
      sendSuccess(res, contacts, 'Contacts retrieved successfully');
    } catch (error) {
      next(error);
    }
  },

  // Get current contact
  async getCurrentContact(req: Request, res: Response, next: NextFunction) {
    try {
      const contact = await employeeContactService.getCurrentContact(parseInt(req.params.employeeId));
      sendSuccess(res, contact, 'Current contact retrieved successfully');
    } catch (error) {
      next(error);
    }
  },

  // Get contact by ID
  async getContactById(req: Request, res: Response, next: NextFunction) {
    try {
      const contact = await employeeContactService.getContactById(parseInt(req.params.id));
      sendSuccess(res, contact, 'Contact retrieved successfully');
    } catch (error) {
      next(error);
    }
  },

  // Update contact
  async updateContact(req: Request, res: Response, next: NextFunction) {
    try {
      const contact = await employeeContactService.updateContact(parseInt(req.params.id), req.body);
      sendSuccess(res, contact, 'Contact updated successfully');
    } catch (error) {
      next(error);
    }
  },

  // Delete contact
  async deleteContact(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await employeeContactService.deleteContact(parseInt(req.params.id));
      sendSuccess(res, result, 'Contact deleted successfully');
    } catch (error) {
      next(error);
    }
  },

  // Set as current contact
  async setCurrentContact(req: Request, res: Response, next: NextFunction) {
    try {
      const contact = await employeeContactService.setCurrentContact(parseInt(req.params.id));
      sendSuccess(res, contact, 'Contact set as current successfully');
    } catch (error) {
      next(error);
    }
  },
};

