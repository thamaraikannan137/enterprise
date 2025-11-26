import { Router } from 'express';
import { employeeContactController } from '../../controllers/employeeContact.controller.ts';
import { authenticate } from '../../middlewares/auth.middleware.ts';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.post('/', employeeContactController.createContact);
router.get('/employee/:employeeId', employeeContactController.getEmployeeContacts);
router.get('/employee/:employeeId/current', employeeContactController.getCurrentContact);
router.get('/:id', employeeContactController.getContactById);
router.put('/:id', employeeContactController.updateContact);
router.put('/:id/set-current', employeeContactController.setCurrentContact);
router.delete('/:id', employeeContactController.deleteContact);

export default router;

