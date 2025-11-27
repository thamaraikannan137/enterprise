import EmployeeDocument from '../models/EmployeeDocument.ts';
import Employee from '../models/Employee.ts';
import { NotFoundError } from '../utils/errors.ts';

export const employeeDocumentService = {
  // Create document
  async createDocument(data: any, filePath?: string, fileName?: string) {
    // Verify employee exists
    const employee = await Employee.findById(data.employee_id);
    if (!employee) {
      throw new NotFoundError('Employee not found');
    }

    // If file path is provided, use it; otherwise use the one from data
    const documentData = { ...data };
    if (filePath) {
      documentData.file_path = filePath;
      if (fileName && !documentData.document_name) {
        documentData.document_name = fileName;
      }
    }

    return await EmployeeDocument.create(documentData);
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
  async updateDocument(id: string, data: any, filePath?: string, fileName?: string) {
    const document = await EmployeeDocument.findById(id);
    if (!document) {
      throw new NotFoundError('Document not found');
    }

    // Store old file path for deletion
    const oldFilePath = document.file_path;

    // If new file is uploaded, update file path
    if (filePath) {
      data.file_path = filePath;
      if (fileName && !data.document_name) {
        data.document_name = fileName;
      }
    }

    Object.assign(document, data);
    await document.save();

    return {
      document,
      oldFilePath: filePath ? oldFilePath : null, // Only return if file was replaced
    };
  },

  // Delete document
  async deleteDocument(id: string) {
    const document = await EmployeeDocument.findById(id);
    if (!document) {
      throw new NotFoundError('Document not found');
    }

    // Get file path before deleting
    const filePath = document.file_path;

    await document.deleteOne();
    return { 
      message: 'Document deleted successfully',
      filePath: filePath // Return file path so controller can delete the physical file
    };
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
