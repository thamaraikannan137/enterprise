import { Router } from 'express';
import regularizationController from '../../controllers/regularization.controller.ts';
import { authenticate } from '../../middlewares/auth.middleware.ts';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Regularization routes
router.post('/requests', regularizationController.createRequest.bind(regularizationController));
router.get('/requests', regularizationController.getRequests.bind(regularizationController));
router.get('/requests/:id', regularizationController.getRequestById.bind(regularizationController));
router.put('/requests/:id', regularizationController.updateRequest.bind(regularizationController));
router.post('/requests/:id/approve', regularizationController.approveRequest.bind(regularizationController));
router.post('/requests/:id/reject', regularizationController.rejectRequest.bind(regularizationController));

export default router;


