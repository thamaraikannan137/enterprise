import { Router } from 'express';
import { certificationController } from '../../controllers/certification.controller.ts';
import { authenticate } from '../../middlewares/auth.middleware.ts';
import { singleCertificationUpload, handleUploadError } from '../../middlewares/upload.middleware.ts';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Create certification with optional file upload
router.post(
  '/',
  singleCertificationUpload,
  handleUploadError,
  certificationController.createCertification
);

// Get employee certifications
router.get('/employee/:employeeId', certificationController.getEmployeeCertifications);

// Get expiring certifications
router.get('/expiring', certificationController.getExpiringCertifications);

// Get certification by ID
router.get('/:id', certificationController.getCertificationById);

// Update certification with optional file upload
router.put(
  '/:id',
  singleCertificationUpload,
  handleUploadError,
  certificationController.updateCertification
);

// Delete certification
router.delete('/:id', certificationController.deleteCertification);

export default router;

