import { Router } from 'express';
import { qualificationController } from '../../controllers/qualification.controller.ts';
import { authenticate } from '../../middlewares/auth.middleware.ts';
import { singleQualificationUpload, handleUploadError } from '../../middlewares/upload.middleware.ts';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Create qualification with optional file upload
router.post(
  '/',
  singleQualificationUpload,
  handleUploadError,
  qualificationController.createQualification
);

// Get employee qualifications
router.get('/employee/:employeeId', qualificationController.getEmployeeQualifications);

// Get qualification by ID
router.get('/:id', qualificationController.getQualificationById);

// Update qualification with optional file upload
router.put(
  '/:id',
  singleQualificationUpload,
  handleUploadError,
  qualificationController.updateQualification
);

// Verify qualification
router.put('/:id/verify', qualificationController.verifyQualification);

// Delete qualification
router.delete('/:id', qualificationController.deleteQualification);

export default router;

