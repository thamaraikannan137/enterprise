import EmployeeQualification from '../models/EmployeeQualification.ts';
import Employee from '../models/Employee.ts';
import EmployeeDocument from '../models/EmployeeDocument.ts';
import { NotFoundError } from '../utils/errors.ts';

export const qualificationService = {
  // Create qualification
  async createQualification(data: any, filePath?: string, fileName?: string) {
    const employee = await Employee.findById(data.employee_id);
    if (!employee) {
      throw new NotFoundError('Employee not found');
    }

    // If file is uploaded, create EmployeeDocument first
    let documentId = data.document_id;
    if (filePath && fileName) {
      const document = await EmployeeDocument.create({
        employee_id: data.employee_id,
        document_type: 'qualification',
        document_name: fileName || data.degree || 'Qualification Document',
        file_path: filePath,
        issue_date: data.completion_year ? new Date(data.completion_year, 0, 1) : undefined,
        is_active: true,
      });
      documentId = document._id;
    }

    // Create qualification with document_id if file was uploaded
    const qualificationData = { ...data };
    if (documentId) {
      qualificationData.document_id = documentId;
    }

    return await EmployeeQualification.create(qualificationData);
  },

  // Get all qualifications for an employee
  async getEmployeeQualifications(employeeId: string, filters: any = {}) {
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      throw new NotFoundError('Employee not found');
    }

    const query: any = { employee_id: employeeId };
    
    if (filters.verification_status) {
      query.verification_status = filters.verification_status;
    }

    return await EmployeeQualification.find(query)
      .populate('document_id')
      .sort({ completion_year: -1 });
  },

  // Get qualification by ID
  async getQualificationById(id: string) {
    const qualification = await EmployeeQualification.findById(id)
      .populate('employee_id')
      .populate('document_id');
    if (!qualification) {
      throw new NotFoundError('Qualification not found');
    }
    return qualification;
  },

  // Update qualification
  async updateQualification(id: string, data: any, filePath?: string, fileName?: string) {
    const qualification = await EmployeeQualification.findById(id);
    if (!qualification) {
      throw new NotFoundError('Qualification not found');
    }

    // If new file is uploaded, create or update EmployeeDocument
    if (filePath && fileName) {
      let documentId = qualification.document_id;

      if (documentId) {
        // Update existing document
        const existingDocument = await EmployeeDocument.findById(documentId);
        if (existingDocument) {
          existingDocument.document_name = fileName;
          existingDocument.file_path = filePath;
          if (data.completion_year) {
            existingDocument.issue_date = new Date(data.completion_year, 0, 1);
          }
          await existingDocument.save();
        } else {
          // Document was deleted, create new one
          const newDocument = await EmployeeDocument.create({
            employee_id: qualification.employee_id,
            document_type: 'qualification',
            document_name: fileName,
            file_path: filePath,
            issue_date: data.completion_year ? new Date(data.completion_year, 0, 1) : undefined,
            is_active: true,
          });
          documentId = newDocument._id;
        }
      } else {
        // Create new document
        const newDocument = await EmployeeDocument.create({
          employee_id: qualification.employee_id,
          document_type: 'qualification',
          document_name: fileName,
          file_path: filePath,
          issue_date: data.completion_year ? new Date(data.completion_year, 0, 1) : undefined,
          is_active: true,
        });
        documentId = newDocument._id;
      }

      data.document_id = documentId;
    }

    Object.assign(qualification, data);
    await qualification.save();
    return qualification;
  },

  // Delete qualification
  async deleteQualification(id: string) {
    const qualification = await EmployeeQualification.findById(id);
    if (!qualification) {
      throw new NotFoundError('Qualification not found');
    }

    // Get file path before deleting qualification
    let filePath: string | null = null;
    if (qualification.document_id) {
      const document = await EmployeeDocument.findById(qualification.document_id);
      if (document) {
        filePath = document.file_path;
        // Delete the document record
        await document.deleteOne();
      }
    }

    // Delete qualification
    await qualification.deleteOne();

    return { 
      message: 'Qualification deleted successfully',
      filePath: filePath // Return file path so controller can delete the physical file
    };
  },

  // Verify qualification
  async verifyQualification(id: string, status: 'verified' | 'rejected') {
    const qualification = await EmployeeQualification.findById(id);
    if (!qualification) {
      throw new NotFoundError('Qualification not found');
    }

    qualification.verification_status = status;
    await qualification.save();
    return qualification;
  },
};
