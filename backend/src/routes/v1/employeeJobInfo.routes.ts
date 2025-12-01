import { Router } from 'express';
import employeeJobInfoController from '../../controllers/employeeJobInfo.controller.ts';
import { authenticate } from '../../middlewares/auth.middleware.ts';
import { validate } from '../../middlewares/validation.middleware.ts';
import { createEmployeeJobInfoSchema, updateEmployeeJobInfoSchema } from '../../validators/employeeJobInfo.validator.ts';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.post('/', validate(createEmployeeJobInfoSchema), employeeJobInfoController.createJobInfo);
router.get('/employee/:employeeId/current', employeeJobInfoController.getCurrentJobInfo);
router.get('/employee/:employeeId/history', employeeJobInfoController.getJobHistory);
router.get('/all', employeeJobInfoController.getAllEmployeesWithJobInfo);
router.get('/:id', employeeJobInfoController.getJobInfoById);
router.put('/:id', validate(updateEmployeeJobInfoSchema), employeeJobInfoController.updateJobInfo);
router.put('/:id/set-current', employeeJobInfoController.setCurrentJobInfo);
router.delete('/:id', employeeJobInfoController.deleteJobInfo);

export default router;

