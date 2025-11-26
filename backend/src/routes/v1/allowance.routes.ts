import { Router } from 'express';
import { allowanceController } from '../../controllers/allowance.controller.ts';
import { authenticate } from '../../middlewares/auth.middleware.ts';

const router = Router();

// All routes require authentication
router.use(authenticate);

// AllowanceType routes
router.post('/types', allowanceController.createAllowanceType);
router.get('/types', allowanceController.getAllAllowanceTypes);
router.get('/types/:id', allowanceController.getAllowanceTypeById);
router.put('/types/:id', allowanceController.updateAllowanceType);
router.delete('/types/:id', allowanceController.deleteAllowanceType);

// EmployeeAllowance routes
router.post('/employee', allowanceController.createEmployeeAllowance);
router.get('/employee/:employeeId', allowanceController.getEmployeeAllowances);
router.get('/employee/:id', allowanceController.getEmployeeAllowanceById);
router.put('/employee/:id', allowanceController.updateEmployeeAllowance);
router.delete('/employee/:id', allowanceController.deleteEmployeeAllowance);

export default router;

