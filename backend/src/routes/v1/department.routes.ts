import { Router } from 'express';
import departmentController from '../../controllers/department.controller.ts';
import { authenticate } from '../../middlewares/auth.middleware.ts';
import { validate } from '../../middlewares/validation.middleware.ts';
import { createDepartmentSchema, updateDepartmentSchema } from '../../validators/department.validator.ts';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.post('/', validate(createDepartmentSchema), departmentController.createDepartment);
router.get('/', departmentController.getAllDepartments);
router.get('/:id', departmentController.getDepartmentById);
router.put('/:id', validate(updateDepartmentSchema), departmentController.updateDepartment);
router.delete('/:id', departmentController.deleteDepartment);

export default router;






