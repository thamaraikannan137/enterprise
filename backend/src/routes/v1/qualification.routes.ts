import { Router } from 'express';
import { qualificationController } from '../../controllers/qualification.controller.ts';
import { authenticate } from '../../middlewares/auth.middleware.ts';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.post('/', qualificationController.createQualification);
router.get('/employee/:employeeId', qualificationController.getEmployeeQualifications);
router.get('/:id', qualificationController.getQualificationById);
router.put('/:id', qualificationController.updateQualification);
router.put('/:id/verify', qualificationController.verifyQualification);
router.delete('/:id', qualificationController.deleteQualification);

export default router;

