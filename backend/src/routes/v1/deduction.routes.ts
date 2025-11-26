import { Router } from 'express';
import { deductionController } from '../../controllers/deduction.controller.ts';
import { authenticate } from '../../middlewares/auth.middleware.ts';

const router = Router();

// All routes require authentication
router.use(authenticate);

// DeductionType routes
router.post('/types', deductionController.createDeductionType);
router.get('/types', deductionController.getAllDeductionTypes);
router.get('/types/:id', deductionController.getDeductionTypeById);
router.put('/types/:id', deductionController.updateDeductionType);
router.delete('/types/:id', deductionController.deleteDeductionType);

// EmployeeDeduction routes
router.post('/employee', deductionController.createEmployeeDeduction);
router.get('/employee/:employeeId', deductionController.getEmployeeDeductions);
router.get('/employee/:id', deductionController.getEmployeeDeductionById);
router.put('/employee/:id', deductionController.updateEmployeeDeduction);
router.delete('/employee/:id', deductionController.deleteEmployeeDeduction);

export default router;

