import EmployeeContact from '../models/EmployeeContact.ts';
import Employee from '../models/Employee.ts';
import { NotFoundError } from '../utils/errors.ts';

export const employeeContactService = {
  // Create employee contact
  async createContact(data: any) {
    // Verify employee exists
    const employee = await Employee.findById(data.employee_id);
    if (!employee) {
      throw new NotFoundError('Employee not found');
    }

    return await EmployeeContact.create(data);
  },

  // Get all contacts for an employee
  async getEmployeeContacts(employeeId: string) {
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      throw new NotFoundError('Employee not found');
    }

    return await EmployeeContact.find({ employee_id: employeeId })
      .sort({ is_current: -1, valid_from: -1 });
  },

  // Get current contact for an employee
  async getCurrentContact(employeeId: string) {
    return await EmployeeContact.findOne({ employee_id: employeeId, is_current: true });
  },

  // Get contact by ID
  async getContactById(id: string) {
    const contact = await EmployeeContact.findById(id);
    if (!contact) {
      throw new NotFoundError('Contact not found');
    }
    return contact;
  },

  // Update contact
  async updateContact(id: string, data: any) {
    const contact = await EmployeeContact.findById(id);
    if (!contact) {
      throw new NotFoundError('Contact not found');
    }

    Object.assign(contact, data);
    await contact.save();
    return contact;
  },

  // Delete contact
  async deleteContact(id: string) {
    const contact = await EmployeeContact.findById(id);
    if (!contact) {
      throw new NotFoundError('Contact not found');
    }

    await contact.deleteOne();
    return { message: 'Contact deleted successfully' };
  },

  // Mark contact as current and unmark others
  async setCurrentContact(id: string) {
    const contact = await EmployeeContact.findById(id);
    if (!contact) {
      throw new NotFoundError('Contact not found');
    }

    // Unmark all other contacts for this employee
    await EmployeeContact.updateMany(
      { employee_id: contact.employee_id },
      { is_current: false }
    );

    // Mark this contact as current
    contact.is_current = true;
    await contact.save();
    return contact;
  },
};
