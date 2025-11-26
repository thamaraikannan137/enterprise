import { Router } from 'express';
import { employeeDocumentController } from '../../controllers/employeeDocument.controller.ts';
import { authenticate } from '../../middlewares/auth.middleware.ts';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.post('/', employeeDocumentController.createDocument);
router.get('/employee/:employeeId', employeeDocumentController.getEmployeeDocuments);
router.get('/expiring', employeeDocumentController.getExpiringDocuments);
router.get('/:id', employeeDocumentController.getDocumentById);
router.put('/:id', employeeDocumentController.updateDocument);
router.delete('/:id', employeeDocumentController.deleteDocument);

export default router;

