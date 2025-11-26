import { Router } from 'express';
import { auditController } from '../../controllers/audit.controller.ts';
import { authenticate } from '../../middlewares/auth.middleware.ts';
import { authorize } from '../../middlewares/authorize.middleware.ts';
import { USER_ROLES } from '../../config/constants.ts';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Audit logs - typically only admins should access
router.post('/', authorize(USER_ROLES.ADMIN), auditController.createAuditLog);
router.get('/', authorize(USER_ROLES.ADMIN), auditController.getAuditLogs);
router.get('/record/:tableName/:recordId', authorize(USER_ROLES.ADMIN), auditController.getRecordAuditHistory);
router.get('/user/:userId', authorize(USER_ROLES.ADMIN), auditController.getUserAuditLogs);

export default router;

