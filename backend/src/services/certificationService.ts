import EmployeeCertification from '../models/EmployeeCertification.ts';
import Employee from '../models/Employee.ts';
import EmployeeDocument from '../models/EmployeeDocument.ts';
import { NotFoundError } from '../utils/errors.ts';

export const certificationService = {
  // Create certification
  async createCertification(data: any, filePath?: string, fileName?: string) {
    const employee = await Employee.findById(data.employee_id);
    if (!employee) {
      throw new NotFoundError('Employee not found');
    }

    // If file is uploaded, create EmployeeDocument first
    let documentId = data.document_id;
    if (filePath && fileName) {
      const document = await EmployeeDocument.create({
        employee_id: data.employee_id,
        document_type: 'certificate',
        document_name: fileName || data.certification_name || 'Certificate',
        file_path: filePath,
        issue_date: data.issue_date,
        expiry_date: data.expiry_date,
        is_active: true,
      });
      documentId = document._id;
    }

    // Create certification with document_id if file was uploaded
    const certificationData = { ...data };
    if (documentId) {
      certificationData.document_id = documentId;
    }

    return await EmployeeCertification.create(certificationData);
  },

  // Get all certifications for an employee
  async getEmployeeCertifications(employeeId: string, filters: any = {}) {
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      throw new NotFoundError('Employee not found');
    }

    const query: any = { employee_id: employeeId };
    
    if (filters.is_active !== undefined) {
      query.is_active = filters.is_active === 'true' || filters.is_active === true;
    }

    if (filters.certification_type) {
      query.certification_type = filters.certification_type;
    }

    return await EmployeeCertification.find(query)
      .populate('document_id')
      .sort({ issue_date: -1 });
  },

  // Get certification by ID
  async getCertificationById(id: string) {
    const certification = await EmployeeCertification.findById(id)
      .populate('employee_id')
      .populate('document_id');
    if (!certification) {
      throw new NotFoundError('Certification not found');
    }
    return certification;
  },

  // Update certification
  async updateCertification(id: string, data: any, filePath?: string, fileName?: string, shouldDeleteOldFile?: boolean) {
    const certification = await EmployeeCertification.findById(id);
    if (!certification) {
      throw new NotFoundError('Certification not found');
    }

    // If new file is uploaded, create or update EmployeeDocument
    if (filePath && fileName) {
      let documentId = certification.document_id;

      if (documentId) {
        // Update existing document
        const existingDocument = await EmployeeDocument.findById(documentId);
        if (existingDocument) {
          existingDocument.document_name = fileName;
          existingDocument.file_path = filePath;
          existingDocument.issue_date = data.issue_date || existingDocument.issue_date;
          existingDocument.expiry_date = data.expiry_date || existingDocument.expiry_date;
          await existingDocument.save();
        } else {
          // Document was deleted, create new one
          const newDocument = await EmployeeDocument.create({
            employee_id: certification.employee_id,
            document_type: 'certificate',
            document_name: fileName,
            file_path: filePath,
            issue_date: data.issue_date || certification.issue_date,
            expiry_date: data.expiry_date || certification.expiry_date,
            is_active: true,
          });
          documentId = newDocument._id;
        }
      } else {
        // Create new document
        const newDocument = await EmployeeDocument.create({
          employee_id: certification.employee_id,
          document_type: 'certificate',
          document_name: fileName,
          file_path: filePath,
          issue_date: data.issue_date || certification.issue_date,
          expiry_date: data.expiry_date || certification.expiry_date,
          is_active: true,
        });
        documentId = newDocument._id;
      }

      data.document_id = documentId;
    }

    Object.assign(certification, data);
    await certification.save();
    return certification;
  },

  // Delete certification
  async deleteCertification(id: string) {
    const certification = await EmployeeCertification.findById(id);
    if (!certification) {
      throw new NotFoundError('Certification not found');
    }

    // Get file path before deleting certification
    let filePath: string | null = null;
    if (certification.document_id) {
      const document = await EmployeeDocument.findById(certification.document_id);
      if (document) {
        filePath = document.file_path;
        // Delete the document record
        await document.deleteOne();
      }
    }

    // Delete certification
    await certification.deleteOne();

    return { 
      message: 'Certification deleted successfully',
      filePath: filePath // Return file path so controller can delete the physical file
    };
  },

  // Get expiring certifications
  async getExpiringCertifications(daysThreshold: number = 30) {
    const thresholdDate = new Date();
    thresholdDate.setDate(thresholdDate.getDate() + daysThreshold);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return await EmployeeCertification.find({
      is_active: true,
      expiry_date: {
        $gte: today,
        $lte: thresholdDate,
      },
    })
      .populate('employee_id', 'first_name last_name employee_code')
      .sort({ expiry_date: 1 });
  },
};
