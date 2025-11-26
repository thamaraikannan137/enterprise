import EmployeeDocument from '../models/EmployeeDocument.ts';
import Employee from '../models/Employee.ts';
import { NotFoundError } from '../utils/errors.ts';

export const employeeDocumentService = {
  // Create document
  async createDocument(data: any) {
    // Verify employee exists
    const employee = await Employee.findById(data.employee_id);
    if (!employee) {
      throw new NotFoundError('Employee not found');
    }

    return await EmployeeDocument.create(data);
  },

  // Get all documents for an employee
  async getEmployeeDocuments(employeeId: string, filters: any = {}) {
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      throw new NotFoundError('Employee not found');
    }

    const query: any = { employee_id: employeeId };

    if (filters.document_type) {
      query.document_type = filters.document_type;
    }

    if (filters.is_active !== undefined) {
      query.is_active = filters.is_active === 'true' || filters.is_active === true;
    }

    return await EmployeeDocument.find(query)
      .sort({ uploaded_at: -1 });
  },

  // Get document by ID
  async getDocumentById(id: string) {
    const document = await EmployeeDocument.findById(id);
    if (!document) {
      throw new NotFoundError('Document not found');
    }
    return document;
  },

  // Update document
  async updateDocument(id: string, data: any) {
    const document = await EmployeeDocument.findById(id);
    if (!document) {
      throw new NotFoundError('Document not found');
    }

    Object.assign(document, data);
    await document.save();
    return document;
  },

  // Delete document
  async deleteDocument(id: string) {
    const document = await EmployeeDocument.findById(id);
    if (!document) {
      throw new NotFoundError('Document not found');
    }

    await document.deleteOne();
    return { message: 'Document deleted successfully' };
  },

  // Get expiring documents
  async getExpiringDocuments(daysThreshold: number = 30) {
    const thresholdDate = new Date();
    thresholdDate.setDate(thresholdDate.getDate() + daysThreshold);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return await EmployeeDocument.find({
      is_active: true,
      expiry_date: {
        $gte: today,
        $lte: thresholdDate,
      },
    }).sort({ expiry_date: 1 });
  },
};
