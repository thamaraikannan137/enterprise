import { Router } from 'express';
import { employeeDocumentController } from '../../controllers/employeeDocument.controller.ts';
import { authenticate } from '../../middlewares/auth.middleware.ts';
import { singleDocumentUpload, handleUploadError } from '../../middlewares/upload.middleware.ts';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Create document with optional file upload
router.post(
  '/',
  singleDocumentUpload,
  handleUploadError,
  employeeDocumentController.createDocument
);

// Get employee documents
router.get('/employee/:employeeId', employeeDocumentController.getEmployeeDocuments);

// Get expiring documents
router.get('/expiring', employeeDocumentController.getExpiringDocuments);

// Get document by ID
router.get('/:id', employeeDocumentController.getDocumentById);

// Update document with optional file upload
router.put(
  '/:id',
  singleDocumentUpload,
  handleUploadError,
  employeeDocumentController.updateDocument
);

// Delete document
router.delete('/:id', employeeDocumentController.deleteDocument);

export default router;

