import { Router } from 'express';
import { employeeCompensationController } from '../../controllers/employeeCompensation.controller.ts';
import { authenticate } from '../../middlewares/auth.middleware.ts';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.post('/', employeeCompensationController.createCompensation);
router.get('/employee/:employeeId', employeeCompensationController.getEmployeeCompensations);
router.get('/employee/:employeeId/current', employeeCompensationController.getCurrentCompensation);
router.get('/:id', employeeCompensationController.getCompensationById);
router.put('/:id', employeeCompensationController.updateCompensation);
router.delete('/:id', employeeCompensationController.deleteCompensation);

export default router;

