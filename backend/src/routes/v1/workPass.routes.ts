import { Router } from 'express';
import { workPassController } from '../../controllers/workPass.controller.ts';
import { authenticate } from '../../middlewares/auth.middleware.ts';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.post('/', workPassController.createWorkPass);
router.get('/employee/:employeeId', workPassController.getEmployeeWorkPasses);
router.get('/expiring', workPassController.getExpiringWorkPasses);
router.get('/:id', workPassController.getWorkPassById);
router.put('/:id', workPassController.updateWorkPass);
router.delete('/:id', workPassController.deleteWorkPass);

// Work Pass Document routes
router.post('/documents', workPassController.addWorkPassDocument);
router.get('/documents/:workPassId', workPassController.getWorkPassDocuments);
router.delete('/documents/:id', workPassController.deleteWorkPassDocument);

export default router;

