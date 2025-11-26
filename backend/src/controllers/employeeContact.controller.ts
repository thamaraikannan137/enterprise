import type { Request, Response, NextFunction } from 'express';
import { employeeContactService } from '../services/employeeContactService.ts';
import { sendSuccess } from '../utils/response.ts';

export const employeeContactController = {
  // Create contact
  async createContact(req: Request, res: Response, next: NextFunction) {
    try {
      const contact = await employeeContactService.createContact(req.body);
      sendSuccess(res, 'Contact created successfully', contact, 201);
    } catch (error) {
      next(error);
    }
  },

  // Get employee contacts
  async getEmployeeContacts(req: Request, res: Response, next: NextFunction) {
    try {
      const contacts = await employeeContactService.getEmployeeContacts(req.params.employeeId!);
      sendSuccess(res, 'Contacts retrieved successfully', contacts);
    } catch (error) {
      next(error);
    }
  },

  // Get current contact
  async getCurrentContact(req: Request, res: Response, next: NextFunction) {
    try {
      const contact = await employeeContactService.getCurrentContact(req.params.employeeId!);
      sendSuccess(res, 'Current contact retrieved successfully', contact);
    } catch (error) {
      next(error);
    }
  },

  // Get contact by ID
  async getContactById(req: Request, res: Response, next: NextFunction) {
    try {
      const contact = await employeeContactService.getContactById(req.params.id!);
      sendSuccess(res, 'Contact retrieved successfully', contact);
    } catch (error) {
      next(error);
    }
  },

  // Update contact
  async updateContact(req: Request, res: Response, next: NextFunction) {
    try {
      const contact = await employeeContactService.updateContact(req.params.id!, req.body);
      sendSuccess(res, 'Contact updated successfully', contact);
    } catch (error) {
      next(error);
    }
  },

  // Delete contact
  async deleteContact(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await employeeContactService.deleteContact(req.params.id!);
      sendSuccess(res, 'Contact deleted successfully', result);
    } catch (error) {
      next(error);
    }
  },

  // Set as current contact
  async setCurrentContact(req: Request, res: Response, next: NextFunction) {
    try {
      const contact = await employeeContactService.setCurrentContact(req.params.id!);
      sendSuccess(res, 'Contact set as current successfully', contact);
    } catch (error) {
      next(error);
    }
  },
};

