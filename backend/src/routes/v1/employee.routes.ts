import { Router } from 'express';
import employeeController from '../../controllers/employee.controller.ts';
import { authenticate } from '../../middlewares/auth.middleware.ts';
import { validate } from '../../middlewares/validation.middleware.ts';
import { createEmployeeSchema, updateEmployeeSchema } from '../../validators/employee.validator.ts';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.post('/', validate(createEmployeeSchema), employeeController.createEmployee);
router.get('/', employeeController.getAllEmployees);
router.get('/:id', employeeController.getEmployeeById);
router.get('/:id/details', employeeController.getEmployeeWithDetails);
router.put('/:id', validate(updateEmployeeSchema), employeeController.updateEmployee);
router.delete('/:id', employeeController.deleteEmployee);

export default router;

