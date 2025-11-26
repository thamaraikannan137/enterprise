import { Router } from 'express';
import { certificationController } from '../../controllers/certification.controller.ts';
import { authenticate } from '../../middlewares/auth.middleware.ts';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.post('/', certificationController.createCertification);
router.get('/employee/:employeeId', certificationController.getEmployeeCertifications);
router.get('/expiring', certificationController.getExpiringCertifications);
router.get('/:id', certificationController.getCertificationById);
router.put('/:id', certificationController.updateCertification);
router.delete('/:id', certificationController.deleteCertification);

export default router;

